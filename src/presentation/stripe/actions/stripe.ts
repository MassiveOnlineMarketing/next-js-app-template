"use server";

import { BASE_URL } from "../../../../routes";
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
  // console.log('manageSubAction: isCurrentPlan', isCurrentPlan)
  // console.log('manageSubAction: stripeSubscriptionId', stripeSubscriptionId)

  // if (isSubscribed && stripeCustomerId ) {
  //     const stripeSession = await stripe.billingPortal.sessions.create({
  //         customer: stripeCustomerId,
  //         return_url: billingUrl,
  //     });

  //     return { url: stripeSession.url };
  // }

  // if (isSubscribed && stripeCustomerId ) {
  //    // * standard billing portal for existing customers
  //     const stripeSession = await stripe.billingPortal.sessions.create({
  //         customer: stripeCustomerId,
  //         return_url: billingUrl,
  //     });

  //     return { url: stripeSession.url };
  // }

  // if (isSubscribed && stripeCustomerId  && stripeSubscriptionId) {
  //     console.log('run')
  //     // * update subscription for existing customers
  //     const subscription = await stripe.subscriptions.retrieve(stripeSubscriptionId);

  //     const stripeSession = await stripe.subscriptions.update(
  //         stripeSubscriptionId,
  //         {
  //             items: [{
  //                 id: subscription.items.data[0].id,
  //                 price: stripePriceId
  //             }],
  //             proration_behavior: "always_invoice",
  //         }
  //     );

  //     console.log('stripeSession', stripeSession)

  //     return { url: billingUrl };
  // }

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
};
