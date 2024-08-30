import { storeMonthlySubcsriptionPlans } from "@/config/stripe/subscriptions";
import { SimpleError } from "@/domain/errors/simpleErrors";
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

    const invoices = this.stripe.paymentIntents.list({ customer: user.stripeCustomerId });

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
