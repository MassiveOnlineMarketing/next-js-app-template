import { storeOneTimeProducts } from "@/config/stripe/one-time-products";
import { storeMonthlySubcsriptionPlans } from "@/config/stripe/subscriptions";
import { SimpleError } from "@/domain/errors/simpleErrors";
import { db } from "@/infrastructure/db/prisma";
import EmailRepository from "@/infrastructure/repositories/EMailRepository";
import Stripe from "stripe";


export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2024-06-20",
  typescript: true,
});

export class StripeService {
  private stripe: Stripe;

  constructor(stripe: Stripe) {
    this.stripe = stripe
  }


  // This is ran when a user completes a checkout session, both for new subscriptions and product purchases
  async handleWebsocketEvent(event: Stripe.Event): Promise<any> {


    if (event.type === "customer.subscription.updated"){
      console.log('❗ should fire when subscription is updated')
      console.log('event: ', event)
      const emailRepository = new EmailRepository();
      await emailRepository.sendEmail(event);
    }

    if (event.type === "invoice.payment_succeeded"){
      console.log('❗ should fire after a successfull payment. Ment for subscription payments')
      console.log('event: ', event)
      const emailRepository = new EmailRepository();
      await emailRepository.sendEmail(event);

      // If created add all the credits to the user
      const created = event.data.object.billing_reason === "subscription_create" ? true : false;

      // If updated, add the difference in credits to the user
      const updated = event.data.object.billing_reason === "subscription_update" ? true : false;

      // const continue = event.data.object.billing_reason === ""
    }

    //* checkout session completed, fires on both subscription and one-time purchases. 
    if (event.type === "checkout.session.completed") {
      console.log("❗ fire when chcekout session is completed");
      const session = event.data.object as Stripe.Checkout.Session;
      console.log("stripe/webhook Checkout session: ", session);
      const emailRepository = new EmailRepository();
      await emailRepository.sendEmail(event);

      // If the user doesn't have a userId, return a 400 error
      if (!session?.metadata?.userId || !session?.metadata?.stripePriceId) {
        return new SimpleError(400, "Invalid session metadata"); 
      }
      const userId = session.metadata.userId;
      const stripePriceId = session.metadata.stripePriceId;

      //* Check if the user has a subscription
      if (session.subscription) {
        return this.subscriptionEvent(session, userId);
      }
      //* Else User has made a one-time purchase
      else {
        this.oneTimePurchaseEvent(stripePriceId, userId);
      }
    }
  }


  async subscriptionEvent(session: Stripe.Checkout.Session, userId: string) {
    console.log("Subscription event: ", session);
    const subscription = await this.stripe.subscriptions.retrieve(
      session.subscription as string,
    );


    const plan = storeMonthlySubcsriptionPlans.find(
      (plan) => plan.stripePriceId === subscription.items.data[0].price.id,
    );

    if (!plan) {
      return new SimpleError(400, "Invalid subscription plan");
    } 
    const credditsToAdd = plan.credits || 0;
  
    try {
      await db.user.update({
        where: {
          id: userId,
        },
        data: {
          stripeSubscriptionId: subscription.id,
          stripeCustomerId: subscription.customer as string,
          stripePriceId: subscription.items.data[0].price.id,
          stripeCurrentPeriodEnd: new Date(
            subscription.current_period_end * 1000,
          ),
          // TODO: Move this to payment succeeded event
          credits: { increment: credditsToAdd },
        },
      });
    } catch (error) {
      console.error("Subscription, Error updating user in database:", error);
      return new SimpleError(500, "Failed to update user in database");
    }
  }

  async oneTimePurchaseEvent(stripePriceId: string, userId: string) {
    const plan = storeOneTimeProducts.find(
      (plan) => plan.stripePriceId === stripePriceId,
    );

    if (!plan) {
      return new SimpleError(400, "Invalid subscription plan");
    } 
    const credditsToAdd = plan.credits || 0;

    // Add credits to the user's account
    try {
      await db.user.update({
        where: { id: userId },
        data: {
          credits: { increment: credditsToAdd },
        },
      });
    } catch (error) {
      console.error("One time purchase, Error updating user in database:", error);
      return new SimpleError(500, "Failed to update user in database");
    }
  }
}