import { auth } from "@/application/services/AuthService"
import { storeOneTimeProducts } from "@/config/stripe/one-time-products"
import { OneTimePurchaseCard } from "@/presentation/stripe/components/billing-cards"
import SubscriptionPlan from "@/presentation/stripe/components/SubscriptionPlan";
import { getUserSubscriptionPlan } from "@/presentation/stripe/subscription";

const page = async () => {
  const session = await auth();
  const subscriptionPlan = await getUserSubscriptionPlan()
  
  if (!session) {
    return <div>Unauthorized</div>
  }

  return (
    <div className="p-6">

      <SubscriptionPlan subscriptionPlan={subscriptionPlan} user={session.user} />

      {/* Buy One Time */}
      <div className="flex gap-4 py-4">
        {storeOneTimeProducts.map((product) => (
          <OneTimePurchaseCard key={product.id} plan={product} user={session.user} />
        ))}
      </div>
    </div>
  )
}

export default page