import { storeOneTimeProducts } from "@/presentation/lib/stripe/constants/one-time-products";
import { storeMonthlySubcsriptionPlans } from "@/presentation/lib/stripe/constants/subscriptions";
import { stripe } from "@/presentation/lib/stripe/stripe";
// import { stripe } from "@/dashboard/stripe/stripe";
import { db } from "@/infrastructure/db/prisma";
import Stripe from "stripe";
import { headers } from "next/headers";

export async function POST(request: Request) {
  // console.log('stripe/webhook: request', request)
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
    return new Response(
      `Webhook Error: ${err instanceof Error ? err.message : "Unknown error"}`,
      { status: 400 },
    );
  }

  console.log("stripe/webhook: event", event.type);

  // * This is ran when a user completes a checkout session, both for new subscriptions and product purchases
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    console.log("stripe/webhook: Checkout session", session);

    // If the user doesn't have a userId, return a 400 error
    if (!session?.metadata?.userId || !session?.metadata?.stripePriceId) {
      return new Response(null, { status: 400 });
    }
    const userId = session.metadata.userId;
    const stripePriceId = session.metadata.stripePriceId;

    // Check if the user has a subscription
    if (session.subscription) {
      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string,
      );

      let credditsToAdd = 0;

      const plan = storeMonthlySubcsriptionPlans.find(
        (plan) => plan.stripePriceId === subscription.items.data[0].price.id,
      );

      if (plan) {
        credditsToAdd = plan.credits;
      }

      await db.user.update({
        where: {
          id: session.metadata.userId,
        },
        data: {
          stripeSubscriptionId: subscription.id,
          stripeCustomerId: subscription.customer as string,
          stripePriceId: subscription.items.data[0].price.id,
          stripeCurrentPeriodEnd: new Date(
            subscription.current_period_end * 1000,
          ),
          credits: { increment: credditsToAdd },
        },
      });
    }
    // Else User has made a one-time purchase
    else {
      let credditsToAdd = 0;

      const plan = storeOneTimeProducts.find(
        (plan) => plan.stripePriceId === stripePriceId,
      );

      if (plan) {
        credditsToAdd = plan.credits;
      }

      // Add credits to the user's account
      await db.user.update({
        where: { id: userId },
        data: {
          credits: { increment: credditsToAdd },
        },
      });
    }
  }

  //  * Main event for when a user updates or cancels their subscription
  // if (event.type === 'customer.subscription.updated') {
  //     const session = event.data.object as Stripe.Subscription;
  //     console.log('stripe/webhook: session', session)
  //     const stripeCustomerId = session.customer as string;

  //     // * If the user has cancelled their subscription
  //     if (session.cancel_at_period_end) {
  //         await db.user.update({
  //             where: {
  //                 stripeCustomerId: stripeCustomerId
  //             },
  //             data: {
  //                 stripeCurrentPeriodEnd: new Date(session.current_period_end * 1000)
  //             }
  //         })

  //         return new Response(null, { status: 200 });
  //     }

  //     // * If the user has updated their subscription
  //     // @ts-ignore
  //     const stripeNewPriceId = session.plan.id

  //     const user = await db.user.findFirst({
  //         where: {
  //             stripeCustomerId: stripeCustomerId
  //         }
  //     })

  //     if (!user) {
  //         return new Response(null, { status: 400 });
  //     }

  //     const currentPlan = storeSubcsriptionPlans.find(plan => plan.stripePriceId === user?.stripePriceId)
  //     const newPlan = storeSubcsriptionPlans.find(plan => plan.stripePriceId === stripeNewPriceId)

  //     if (!currentPlan || !newPlan) {
  //         return new Response(null, { status: 400 });
  //     }

  //     // If the new plan has more credits than the current plan, add the difference to the user's account
  //     if (newPlan?.credits > currentPlan?.credits) {
  //         const creditsToAdd = newPlan.credits - currentPlan.credits;
  //         console.log('stripe/webhook: creditsToAdd', creditsToAdd)
  //         await db.user.update({
  //             where: {
  //                 stripeCustomerId: stripeCustomerId
  //             },
  //             data: {
  //                 credits: { increment: creditsToAdd },
  //                 stripePriceId: stripeNewPriceId,
  //                 stripeCurrentPeriodEnd: new Date(session.current_period_end * 1000)
  //             }
  //         })
  //     }
  //     // If the new plan has less credits than the current plan, dont add new credits
  //     else {
  //         console.log('stripe/webhook: no credits to add')
  //         await db.user.update({
  //             where: {
  //                 stripeCustomerId: stripeCustomerId
  //             },
  //             data: {
  //                 stripePriceId: stripeNewPriceId,
  //                 stripeCurrentPeriodEnd: new Date(session.current_period_end * 1000)
  //             }
  //         })
  //     }
  // }

  // if (event.type === 'invoice.payment_succeeded') {
  //     const session = event.data.object as Stripe.Invoice;
  //     // console.log('stripe/webhook: invoice session', session)
  //     console.log('stripe/webhook: invoice session')
  // }

  // * Event when subscription changes, updated and cancelled. Here we send a invoice to the user for a one-time purchase
  // if (event.type === 'customer.subscription.updated') {
  //     const session = event.data.object as Stripe.Subscription;

  //     console.log('stripe/webhook: subscription session', session)

  //     const invoiceItem = await stripe.invoiceItems.create({
  //         customer: session.customer as string,
  //         amount: 1000,
  //         currency: 'usd',
  //         description: 'One-time purchase',
  //     })

  //     console.log('stripe/webhook: invoiceItem', invoiceItem)

  //     const invoice = await stripe.invoices.create({
  //         customer: session.customer as string,
  //         auto_advance: true,
  //         // collection_method: 'send_invoice',
  //         // days_until_due: 30
  //     })

  // }

  return new Response(null, { status: 200 });
}
