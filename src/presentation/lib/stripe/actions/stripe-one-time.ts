"use server";

import { stripe } from "@/application/services/StripeService";
import { BASE_URL } from "../../../../../routes";
import { db } from "@/infrastructure/db/prisma";


interface ManageStripeBuyOneTimeProductActionProps {
  userId: string;
  email: string;
  stripePriceId: string;
}

export const manageStripeBuyOneTimeProductAction = async ({
  userId,
  email,
  stripePriceId,
}: ManageStripeBuyOneTimeProductActionProps) => {
  const billingUrl = `${BASE_URL}/app/billing`;
  console.log('billingUrl', billingUrl)

  const user = await db.user.findUnique({
    where: {
      id: userId
    }
  })


  if (user?.stripeCustomerId) {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "ideal", "paypal"],
      mode: "payment",
      line_items: [
        {
          price: stripePriceId,
          quantity: 1,
        },
      ],
      success_url: billingUrl,
      cancel_url: billingUrl,   
      customer: user.stripeCustomerId,
      metadata: {
        userId: userId,
        stripePriceId: stripePriceId,
      },
    });
    console.log('session', session)
  
    return { url: session.url };
  } else {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "ideal", "paypal"],
      mode: "payment",
      line_items: [
        {
          price: stripePriceId,
          quantity: 1,
        },
      ],
      customer_email: email,
      success_url: billingUrl,
      cancel_url: billingUrl,   
      metadata: {
        userId: userId,
        stripePriceId: stripePriceId,
      },
    });
    console.log('session', session)
  
    return { url: session.url };
  }
};
