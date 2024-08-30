import { storeOneTimeProducts } from "@/config/stripe/one-time-products";
import { storeMonthlySubcsriptionPlans } from "@/config/stripe/subscriptions";
import { SimpleError } from "@/domain/errors/simpleErrors";
import { db } from "@/infrastructure/db/prisma";
import EmailRepository from "@/infrastructure/repositories/EMailRepository";
import userRepository from "@/infrastructure/repositories/UserRepository";
import Stripe from "stripe";

export type UserSubscriptionPlan = Awaited<ReturnType<StripeService['getUserSubscriptionPlan']>>;

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

    if (event.type === "customer.subscription.updated") {
      console.log('❗ should fire when subscription is updated')
      sendEmail(event);

      // Update the user's subscription data in the database
      const stripeCustomer = await this.getStripeCustomerData(event.data.object.customer as string);
      const updatedSubscriptionData = {
        stripeSubscriptionId: event.data.object.id,
        stripeCustomerId: event.data.object.customer as string,
        stripePriceId: event.data.object.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(
          event.data.object.current_period_end * 1000,
        ),
      }
      console.log('updatedSubscriptionData: ', updatedSubscriptionData)
      userRepository.updateStripeSubscriptionData(updatedSubscriptionData, stripeCustomer.email as string);
    }


    if (event.type === "customer.subscription.deleted") {
      console.log('❗ should fire when subscription is deleted')
      sendEmail(event);

      const stripeCustomer = await this.getStripeCustomerData(event.data.object.customer as string);
      userRepository.updateStripeSubscriptionData({ stripeCustomerId: stripeCustomer.id, stripeSubscriptionId: null, stripePriceId: null, stripeCurrentPeriodEnd: null }, stripeCustomer.email as string);
    }

    // * Fires when a payment is successful
    if (event.type === "invoice.payment_succeeded") {
      console.log('❗ should fire after a successfull payment. Ment for subscription payments')
      sendEmail(event);

      // event when the subscription is created, add the credits to the user
      if (event.data.object.billing_reason === "subscription_create") {
        this.subscriptionCreditsRenewal(event);
      }

      // event for monthly renewal of subscription
      if (event.data.object.billing_reason === "subscription_cycle") {
        this.subscriptionCreditsRenewal(event);
      }
      
      
      // If updated, add the difference in credits to the user ? wanneer update, subscriptie wijziging de correcte credits toevoegen
      const updated = event.data.object.billing_reason === "subscription_update" ? true : false;
    }


    //* checkout session completed, fires on both subscription and one-time purchases. 
    if (event.type === "checkout.session.completed") {
      console.log("❗ fire when chcekout session is completed");
      sendEmail(event);

      const session = event.data.object as Stripe.Checkout.Session;
      // If the user doesn't have a userId, return a 400 error
      if (!session?.metadata?.userId || !session?.metadata?.stripePriceId) {
        return new SimpleError(400, "Invalid session metadata");
      }
      const userId = session.metadata.userId;
      const stripePriceId = session.metadata.stripePriceId;

      //* Handle one-time purchases, subscription is handle by payment_succeeded event
      if (!session.subscription) {
        this.oneTimePurchaseEvent(stripePriceId, userId);
      }
    }
  }



  async subscriptionCreditsRenewal(event: Stripe.InvoicePaymentSucceededEvent) {
    console.log('SUBSCRIPTION CREDITS RENEWAL')
    const stripeCustomerId = event.data.object.customer;
    console.log('stripeCustomerId: ', stripeCustomerId)
    const subscriptionItem = event.data.object.lines.data[0];
    console.log('subscriptionItem: ', subscriptionItem)
    const plan = storeMonthlySubcsriptionPlans.find(
      (plan) => plan.stripePriceId === subscriptionItem.price!.id,
    );
    console.log('plan: ', plan)
    if (!plan) {
      return new SimpleError(400, "Invalid subscription plan");
    }
    const credditsToAdd = plan.credits || 0;
    const data = {
      stripeSubscriptionId: subscriptionItem.subscription,
      stripeCustomerId: stripeCustomerId as string,
      stripePriceId: subscriptionItem.price!.id,
      stripeCurrentPeriodEnd: new Date(
        subscriptionItem.period.end * 1000,
      ),

      credits: { increment: credditsToAdd },
    }
    console.log('data: ', data)
    const userEmail = event.data.object.customer_email;
    if (!userEmail) {
      return new SimpleError(400, "Invalid user email");
    }
    const newUser = await userRepository.updateByStripeCustomerId(data, userEmail);
    console.log('newUser: ', newUser)
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

  async getStripeCustomerData(stripeCustomerId: string): Promise<Stripe.Customer> {
    const customer: Stripe.Customer | Stripe.DeletedCustomer = await this.stripe.customers.retrieve(stripeCustomerId as string);

    if (isDeletedCustomer(customer)) {
      console.log('customer is deleted: ', customer)
      throw new SimpleError(400, "Customer is deleted");
    }

    return customer;
  }

  async getCustomerInvoices(userId: string): Promise<Stripe.ApiListPromise<Stripe.PaymentIntent>> {
    const user = await userRepository.getById(userId);
    if (!user?.stripeCustomerId) {
      throw new SimpleError(400, "User not found");
    }

    const invoices = this.stripe.paymentIntents.list({customer: user.stripeCustomerId});

    return invoices;
  }

  async getUserSubscriptionPlan(userId: string) {
    const user = await userRepository.getById(userId);
    if (!user) {
      throw new SimpleError(400, "User not found");
    }

    const isSubscribed =
      user.stripePriceId &&
      user.stripeCurrentPeriodEnd &&
      user.stripeCurrentPeriodEnd.getTime() + 84_400_000 > Date.now();

    const plan = isSubscribed
      ? storeMonthlySubcsriptionPlans.find(
        (plan) => plan.stripePriceId === user.stripePriceId,
      )
      : null;

    let isCanceled = false;
    if (isSubscribed && user.stripeSubscriptionId) {
      const stripePlan = await stripe.subscriptions.retrieve(
        user.stripeSubscriptionId,
      );

      isCanceled = stripePlan.cancel_at_period_end;
    }

    return {
      ...plan,
      stripeSubscriptionId: user.stripeSubscriptionId,
      stripeCurrentPeriodEnd: user.stripeCurrentPeriodEnd,
      stripeCustomerId: user.stripeCustomerId,
      isSubscribed,
      isCanceled,
    };
  }
}


// Type guard to check if the customer is a DeletedCustomer
function isDeletedCustomer(customer: Stripe.Customer | Stripe.DeletedCustomer): customer is Stripe.DeletedCustomer {
  return (customer as Stripe.DeletedCustomer).deleted !== undefined;
}

async function sendEmail(event: Stripe.Event) {
  console.log('event: ', event)

  const emailRepository = new EmailRepository();
  await emailRepository.sendEmail(event);
}
