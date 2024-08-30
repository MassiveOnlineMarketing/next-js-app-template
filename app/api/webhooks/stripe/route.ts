"use server";
import Stripe from "stripe";
import { stripe, StripeService } from "@/application/services/StripeService";
import { SimpleError } from "@/domain/errors/simpleErrors";
import EmailRepository from "@/infrastructure/repositories/EMailRepository";
import { storeMonthlySubcsriptionPlans } from "@/config/stripe/subscriptions";
import { db } from "@/infrastructure/db/prisma";


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

  if (event.type === "invoice.payment_succeeded") {
    console.log("stripe/webhook event: invoice.payment_succeeded");

    await sendEmail(event);

    // event for monthly renewal of subscription
    if (event.data.object.billing_reason === "subscription_cycle") {
      console.log('SUBSCRIPTION CREDITS RENEWAL ON API ROUTE');
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
        return new Response("Invalid subscription plan", {status: 400});
      }
      const creditsToAdd = plan.credits || 0;
      const userEmail = event.data.object.customer_email;
      if (!userEmail) {
        console.error('Invalid user email');
        console.log('Invalid user email');
        return new Response("Invalid user email", {status: 400});
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
      } catch (error) {
        console.error('Error updating user credits: ', error);
        console.log('Error updating user credits: ', error);
      }
    }
  }


  const stripeService = new StripeService(stripe);

  try {
    await stripeService.handleWebsocketEvent(event);
  } catch (error) {
    if (error instanceof SimpleError) {
      console.error("Error processing stripe webhook", error);
      return new Response(null, { status: error.statusCode });
    }
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