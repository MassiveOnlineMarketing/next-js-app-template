"use server";
import Stripe from "stripe";
import { stripe, StripeService } from "@/application/services/StripeService";
import { SimpleError } from "@/domain/errors/simpleErrors";
import EmailRepository from "@/infrastructure/repositories/EMailRepository";
import { storeMonthlySubcsriptionPlans } from "@/config/stripe/subscriptions";
import { db } from "@/infrastructure/db/prisma";
import { storeOneTimeProducts } from "@/config/stripe/one-time-products";
import userRepository from "@/infrastructure/repositories/UserRepository";


export async function POST(request: Request) {
  // console.log('stripe/webhook request: ', request)
  const body = await request.text();
  const sig = request.headers.get("stripe-signature") ?? "";

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET ?? "",
    );
  } catch (err) {
    console.log("stripe/webhook error: ", err);
    return new Response(
      `Webhook Error: ${err instanceof Error ? err.message : "Unknown error"}`,
      { status: 400 },
    );
  }

  console.log("stripe/webhook event: ", event.type);

  const stripeService = new StripeService(stripe);

  try {
    if (event.type === "customer.subscription.updated") {
      console.log('❗ should fire when subscription is updated')
      await sendEmail(event);

      // Update the user's subscription data in the database
      const stripeCustomer = await stripeService.getStripeCustomerData(event.data.object.customer as string);
      const updatedSubscriptionData = {
        stripeSubscriptionId: event.data.object.id,
        stripeCustomerId: event.data.object.customer as string,
        stripePriceId: event.data.object.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(
          event.data.object.current_period_end * 1000,
        ),
      }
      console.log('updatedSubscriptionData: ', updatedSubscriptionData)
      await userRepository.updateStripeSubscriptionData(updatedSubscriptionData, stripeCustomer.email as string);
    }


    if (event.type === "customer.subscription.deleted") {
      console.log('❗ should fire when subscription is deleted')
      await sendEmail(event);

      const stripeCustomer = await stripeService.getStripeCustomerData(event.data.object.customer as string);
      await userRepository.updateStripeSubscriptionData({ stripeCustomerId: stripeCustomer.id, stripeSubscriptionId: null, stripePriceId: null, stripeCurrentPeriodEnd: null }, stripeCustomer.email as string);
    }

    // * Fires when a payment is successful
    if (event.type === "invoice.payment_succeeded") {
      console.log('❗ should fire after a successfull payment. Ment for subscription payments')
      await sendEmail(event);

      // event when the subscription is created, add the credits to the user
      if (event.data.object.billing_reason === "subscription_create") {
        await subscriptionCreditsRenewal(event);
      }

      // event for monthly renewal of subscription
      if (event.data.object.billing_reason === "subscription_cycle") {
        await subscriptionCreditsRenewal(event);
      }


      // If updated, add the difference in credits to the user ? wanneer update, subscriptie wijziging de correcte credits toevoegen
      const updated = event.data.object.billing_reason === "subscription_update" ? true : false;
    }


    //* checkout session completed, fires on both subscription and one-time purchases. 
    if (event.type === "checkout.session.completed") {
      console.log("❗ fire when chcekout session is completed");
      await sendEmail(event);

      const session = event.data.object as Stripe.Checkout.Session;
      // If the user doesn't have a userId, return a 400 error
      if (!session?.metadata?.userId || !session?.metadata?.stripePriceId) {
        return new Response("Invalid session metadata", {status: 400});
      }
      const userId = session.metadata.userId;
      const stripePriceId = session.metadata.stripePriceId;

      //* Handle one-time purchases, subscription is handle by payment_succeeded event
      if (!session.subscription) {
        await oneTimePurchaseEvent(stripePriceId, userId);
      }
    }
  } catch (error) {
    console.error("Error processing stripe webhook", error);
    return new Response(null, { status: 500 });
  }

  return new Response(null, { status: 200 });
}

async function sendEmail(event: Stripe.Event) {
  console.log('event: ', event)

  const emailRepository = new EmailRepository();
  await emailRepository.sendEmail(event);
}


async function subscriptionCreditsRenewal(event: Stripe.InvoicePaymentSucceededEvent) {
  console.log('SUBSCRIPTION CREDITS RENEWAL');
  const stripeCustomerId = event.data.object.customer;
  console.log('stripeCustomerId: ', stripeCustomerId);
  const subscriptionItem = event.data.object.lines.data[0];
  console.log('subscriptionItem: ', subscriptionItem);
  const plan = storeMonthlySubcsriptionPlans.find(
    (plan) => plan.stripePriceId === subscriptionItem.price!.id,
  );
  console.log('plan: ', plan);
  if (!plan) {
    console.error('Invalid subscription plan');
    console.log('Invalid subscription plan');
    return new Response("Invalid subscription plan", { status: 400 });
  }
  const creditsToAdd = plan.credits || 0;
  const userEmail = event.data.object.customer_email;
  if (!userEmail) {
    console.error('Invalid user email');
    console.log('Invalid user email');
    return new Response("Invalid user email", { status: 400 });
  }
  try {
    console.log('Attempting to update user credits...');
    console.log(`User Email: ${userEmail}`);
    console.log('Credits to add: ', creditsToAdd);

    const user = await db.user.findFirst({
      where: { email: userEmail },
    });
    console.log('User before update: ', user);

    const newUser = await db.user.update({
      where: { id: user?.id },
      data: {
        credits: { increment: creditsToAdd },
      },
    });

    console.log('User after update: ', newUser);
    return new Response("User credits updated", { status: 200 });
  } catch (error) {
    console.error('Error updating user credits: ', error);
    console.log('Error updating user credits: ', error);
    return new Response("Error updating user credits", { status: 500 });
  }
}

async function oneTimePurchaseEvent(stripePriceId: string, userId: string) {
  const plan = storeOneTimeProducts.find(
    (plan) => plan.stripePriceId === stripePriceId,
  );

  if (!plan) {
    return new Response("Invalid plan", { status: 400 });
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

    return new Response("User updated", { status: 200 });
  } catch (error) {
    console.error("One time purchase, Error updating user in database:", error);
    return new Response("Failed to update user in database", { status: 500 });
  }
}