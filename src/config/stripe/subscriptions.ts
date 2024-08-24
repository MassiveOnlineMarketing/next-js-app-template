export interface SubscriptionPlanProps {
  id: string;
  name: string;
  description: string;
  stripePriceId: string;
  credits: number;
  price: number;
}

export const storeMonthlySubcsriptionPlans: SubscriptionPlanProps[] = [
  {
    id: "8750-monthly",
    name: "8.750 Credits Monthly",
    description:
      "Gets you started with improving and tracking your SEO performance",
    stripePriceId:
      process.env.NEXT_PUBLIC_STRIPE_250_SUBSCRIPTION_PRICE_ID ?? "",
    credits: 8750,
    price: 15.75,
  },
  {
    id: "17500-monthly",
    name: "17.500 Credits Monthly",
    description:
      "Gets you started with improving and tracking your SEO performance",
    stripePriceId:
      process.env.NEXT_PUBLIC_STRIPE_500_SUBSCRIPTION_PRICE_ID ?? "",
    credits: 17500,
    price: 29,
  },
  {
    id: "35000-monthly",
    name: "35.000 Credits Monthly",
    description:
      "Gets you started with improving and tracking your SEO performance",
    stripePriceId:
      process.env.NEXT_PUBLIC_STRIPE_250_SUBSCRIPTION_PRICE_ID ?? "",
    credits: 35000,
    price: 52.5,
  },
  {
    id: "70000-monthly",
    name: "70.000 Credits Monthly",
    description:
      "Gets you started with improving and tracking your SEO performance",
    stripePriceId:
      process.env.NEXT_PUBLIC_STRIPE_500_SUBSCRIPTION_PRICE_ID ?? "",
    credits: 70000,
    price: 94.5,
  },
];

// TODO: Add yearly subscription plans to environment variables
export const storeYearlySubcsriptionPlans: SubscriptionPlanProps[] = [
  {
    id: "105000-yearly",
    name: "105.000 Credits Yearly",
    description:
      "Gets you started with improving and tracking your SEO performance",
    stripePriceId:
      process.env.NEXT_PUBLIC_STRIPE_250_YEARLY_SUBSCRIPTION_PRICE_ID ?? "",
    credits: 105000,
    price: 170,
  },
  {
    id: "210000-yearly",
    name: "210.000 Credits Yearly",
    description:
      "Gets you started with improving and tracking your SEO performance",
    stripePriceId:
      process.env.NEXT_PUBLIC_STRIPE_500_YEARLY_SUBSCRIPTION_PRICE_ID ?? "",
    credits: 210000,
    price: 312,
  },
  {
    id: "420000-yearly",
    name: "420.000 Credits Yearly",
    description:
      "Gets you started with improving and tracking your SEO performance",
    stripePriceId:
      process.env.NEXT_PUBLIC_STRIPE_250_YEARLY_SUBSCRIPTION_PRICE_ID ?? "",
    credits: 420000,
    price: 567,
  },
  {
    id: "840000-yearly",
    name: "840.000 Credits Yearly",
    description:
      "Gets you started with improving and tracking your SEO performance",
    stripePriceId:
      process.env.NEXT_PUBLIC_STRIPE_500_YEARLY_SUBSCRIPTION_PRICE_ID ?? "",
    credits: 840000,
    price: 1020,
  },
];