
import Stripe from "stripe";
import { stripe, StripeService } from "@/application/services/StripeService";
import { SimpleError } from "@/domain/errors/simpleErrors";

export const maxDuration = 300;

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
    await stripeService.handleWebsocketEvent(event);
  } catch (error) {
    if (error instanceof SimpleError) {
      console.error("Error processing stripe webhook", error);
      return new Response(null, { status: error.statusCode });
    }
  }

  return new Response(null, { status: 200 });
}
