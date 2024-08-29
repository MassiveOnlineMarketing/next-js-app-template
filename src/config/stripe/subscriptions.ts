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
    id: "personal-3000-monthly",
    name: "Personal 3.000 Credits Monthly",
    description:
      "Gets you started with improving and tracking your SEO performance",
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_SUBSCRIPTION_PRICE_ID_PERSONAL_1 ?? "",
    credits: 3000,
    price: 5.5,
  },{
    id: "personal-12000-monthly",
    name: "Personal 12.000 Credits Monthly",
    description:
      "Gets you started with improving and tracking your SEO performance",
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_SUBSCRIPTION_PRICE_ID_PERSONAL_2 ?? "",
    credits: 12000,
    price: 22,
  },{
    id: "personal-21000-monthly",
    name: "Personal 21.000 Credits Monthly",
    description:
      "Gets you started with improving and tracking your SEO performance",
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_SUBSCRIPTION_PRICE_ID_PERSONAL_3 ?? "",
    credits: 21000,
    price: 38,
  },{
    id: "starter-30000-monthly",
    name: "Starter 30.000 Credits Monthly",
    description:
      "Gets you started with improving and tracking your SEO performance",
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_SUBSCRIPTION_PRICE_ID_STARTER_1 ?? "",
    credits: 30000,
    price: 45,
  },{
    id: "starter-120000-monthly",
    name: "Starter 120.000 Credits Monthly",
    description:
      "Gets you started with improving and tracking your SEO performance",
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_SUBSCRIPTION_PRICE_ID_STARTER_2 ?? "",
    credits: 120000,
    price: 180,
  },{
    id: "starter-210000-monthly",
    name: "Starter 210.000 Credits Monthly",
    description:
      "Gets you started with improving and tracking your SEO performance",
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_SUBSCRIPTION_PRICE_ID_STARTER_3 ?? "",
    credits: 210000,
    price: 315,
  },{
    id: "premium-300000-monthly",
    name: "Premium 300.000 Credits Monthly",
    description:
      "Gets you started with improving and tracking your SEO performance",
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_SUBSCRIPTION_PRICE_ID_PREMIUM_1 ?? "",
    credits: 300000,
    price: 375,
  },{
    id: "premium-1200000-monthly",
    name: "Premium 1.200.000 Credits Monthly",
    description:
      "Gets you started with improving and tracking your SEO performance",
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_SUBSCRIPTION_PRICE_ID_PREMIUM_2 ?? "",
    credits: 1200000,
    price: 1200,
  },{
    id: "premium-2100000-monthly",
    name: "Premium 2.100.000 Credits Monthly",
    description:
      "Gets you started with improving and tracking your SEO performance",
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_SUBSCRIPTION_PRICE_ID_PREMIUM_3 ?? "",
    credits: 2100000,
    price: 2100,
  },{
    id: "test",
    name: "test daily",
    description:
      "Gets you started with improving and tracking your SEO performance",
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_100_SUBSCRIPTION_PRICE_ID ?? "",
    credits: 100,
    price: 10,
  },
]

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