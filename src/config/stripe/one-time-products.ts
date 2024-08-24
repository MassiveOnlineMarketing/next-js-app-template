export interface OneTimeProduct {
  id: string;
  name: string;
  description: string;
  stripePriceId: string;
  credits: number;
  price: number;
}

export const storeOneTimeProducts: OneTimeProduct[] = [
  {
    id: "8750-one-time",
    name: "8.750 One Time",
    description:
      "Gets you a total of 8.750 credits, will last one month if you use 250 credits daily",
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_250_ONE_TIME_PRICE_ID ?? "",
    credits: 8750,
    price: 17.5,
  },
  {
    id: "17500-one-time",
    name: "17.500 One Time",
    description:
      "Gets you a total of 17.500 credits, will last one month if you use 500 credits daily",
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_500_ONE_TIME_PRICE_ID ?? "",
    credits: 17500,
    price: 32.0,
  },
  {
    id: "35000-one-time",
    name: "35.000 One Time",
    description:
      "Gets you a total of 35.000 credits, will last one month if you use 1000 credits daily",
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_1000_ONE_TIME_PRICE_ID ?? "",
    credits: 35000,
    price: 58.0,
  },
  {
    id: "70000-one-time",
    name: "70.000 One Time",
    description:
      "Gets you a total of 70.000 credits, will last one month if you use 2000 credits daily",
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_2000_ONE_TIME_PRICE_ID ?? "",
    credits: 70000,
    price: 104.0,
  },
];
