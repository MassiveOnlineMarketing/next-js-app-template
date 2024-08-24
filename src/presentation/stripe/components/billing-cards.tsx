
import { User } from "next-auth";

import ManageUserSubscriptionButton from "./manage-user-subscription-button";
import BuyOneTimeProductButton from "./buy-one-time-product-button";

import { UserSubscriptionPlan } from "../subscription";

import { OneTimeProduct } from "@/config/stripe/one-time-products";
import { SubscriptionPlanProps } from "@/config/stripe/subscriptions";


const SubscriptionCard = ({ plan, user, subscriptionPlan, selectedPlan }: { plan: SubscriptionPlanProps, user: User, subscriptionPlan: UserSubscriptionPlan, selectedPlan: 'monthly' | 'yearly' }) => {
  return (
    <div className='p-4 border rounded-md border-primary-500'>
      <PlanDetails plan={plan} title={selectedPlan === 'monthly' ? 'Credits Montly' : 'Credits Yearly'} />
      <ManageUserSubscriptionButton
        userId={user.id || ''}
        email={user.email || ''}
        isCurrentPlan={subscriptionPlan?.name === plan.name}
        isSubscribed={!!subscriptionPlan.isSubscribed}
        stripeCustomerId={subscriptionPlan?.stripeCustomerId}
        stripeSubscriptionId={subscriptionPlan?.stripeSubscriptionId}
        stripePriceId={plan.stripePriceId}
      />
    </div>
  )
}

const OneTimePurchaseCard = ({ plan, user }: { plan: OneTimeProduct, user: User }) => {
  return (
    <div className='p-4 border rounded-md border-primary-500'>
      <PlanDetails plan={plan} title="Credits"/>
      <BuyOneTimeProductButton
        userId={user.id || ''}
        email={user.email || ''}
        stripePriceId={plan.stripePriceId}
      />
    </div>
  )
}


const PlanDetails = ({ plan, title }: { plan: SubscriptionPlanProps, title: string }) => {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-2xl text-gray-800 font-semibold text-center">{plan.credits.toLocaleString()}</h2>
      <h3 className="text-2xl text-gray-800 text-center">{title}</h3>
      <p>{plan.description}</p>
      <p className="text-3xl text-gray-800 text-center">€{plan.price}</p>
      <p className="text-center">
        <span>€{(plan.price / plan.credits * 1000).toFixed(2)}</span>
        <span> per 1000</span>
      </p>
    </div>
  )
}

export { SubscriptionCard, OneTimePurchaseCard };