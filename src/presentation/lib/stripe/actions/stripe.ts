"use server";

import { BASE_URL } from "../../../../../routes";
import { stripe } from "@/application/services/StripeService";

interface ManageStripeSubscriptionActionProps {
  isSubscribed: boolean;
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
  isCurrentPlan: boolean;
  email: string;
  userId: string;
  stripePriceId: string;
}

export const manageStripeSubscriptionAction = async ({
  isSubscribed,
  stripeCustomerId,
  stripeSubscriptionId,
  isCurrentPlan,
  email,
  userId,
  stripePriceId,
}: ManageStripeSubscriptionActionProps) => {
  const billingUrl = `${BASE_URL}/app/billing`;

  console.log("manageSubAction: isSubscribed", isSubscribed);
  console.log("manageSubAction: stripeCustomerId", stripeCustomerId);
  // TODO: case when user has no subscription but has a stripeCustomerId

  // if (isSubscribed && stripeCustomerId ) {
  //     const stripeSession = await stripe.billingPortal.sessions.create({
  //         customer: stripeCustomerId,
  //         return_url: billingUrl,
  //     });

  //     return { url: stripeSession.url };
  // }

  //! subscribed and stripeCustomerId
  if (isSubscribed && stripeCustomerId) {
    console.log("run subscribed and stripeCustomerId");
    // * standard billing portal for existing customers
    const stripeSession = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: billingUrl,
    });

    return { url: stripeSession.url };
  }

  //! subscribed and active subscription - can update users subscription
  // Gives 4 events - customer.subscription.updated, invoice.payment_succeeded, invoice.payment_succeeded, customer.subscription.updated
  if (isSubscribed && stripeCustomerId && stripeSubscriptionId) {
    console.log('run')
    // * update subscription for existing customers
    const subscription = await stripe.subscriptions.retrieve(stripeSubscriptionId);

    const stripeSession = await stripe.subscriptions.update(
      stripeSubscriptionId,
      {
        items: [{
          id: subscription.items.data[0].id,
          price: stripePriceId
        }],
        // TODO Stripe: Add proration_behavior to the update subscription
        proration_behavior: "always_invoice",
        metadata: {
          userId: userId,
          stripePriceId,
        },
      }
    );

    console.log('stripeSession', stripeSession)

    return { url: billingUrl };
  }



  //! not subscribed and no stripeCustomerId
  if (!isSubscribed && !stripeCustomerId) {
    console.log("run not subscribed and no stripeCustomerId");
    // * Create a new subscription and customer
    const stripeSession = await stripe.checkout.sessions.create({
      success_url: billingUrl,
      cancel_url: billingUrl,
      payment_method_types: ["card"],
      mode: "subscription",
      billing_address_collection: "auto",
      customer_email: email,
      line_items: [
        {
          price: stripePriceId,
          quantity: 1,
        },
      ],
      metadata: {
        userId: userId,
        stripePriceId,
      },
    });

    return { url: stripeSession.url };
  }

  // ! when user previously had a subscription, therefore we still have the stripeCustomerId. Use that to create a new subscription
  if (stripeCustomerId) {
    console.log("run stripeCustomerId");
    const stripeSession = await stripe.checkout.sessions.create({
      success_url: billingUrl,
      cancel_url: billingUrl,
      payment_method_types: ["card"],
      mode: "subscription",
      billing_address_collection: "auto",
      customer: stripeCustomerId,
      line_items: [
        {
          price: stripePriceId,
          quantity: 1,
        },
      ],
      metadata: {
        userId: userId,
        stripePriceId,
      },
    });

    return { url: stripeSession.url };
  }


  console.log("not subscribed and stripeCustomerId");
  // * Create a new subscription and customer
  const stripeSession = await stripe.checkout.sessions.create({
    success_url: billingUrl,
    cancel_url: billingUrl,
    payment_method_types: ["card"],
    mode: "subscription",
    billing_address_collection: "auto",
    customer_email: email,
    line_items: [
      {
        price: stripePriceId,
        quantity: 1,
      },
    ],
    metadata: {
      userId: userId,
      stripePriceId,
    },
  });

  return { url: stripeSession.url };

};
