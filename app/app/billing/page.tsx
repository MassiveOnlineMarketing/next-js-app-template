import { auth } from "@/application/services/AuthService"
import { getStripeCustomerInvoices } from "@/application/useCases/stripe/getStripeCustomerInvoices";
import { getStripeUserSubscription } from "@/application/useCases/stripe/getStripeUserSubscription";
import { storeOneTimeProducts } from "@/config/stripe/one-time-products"
import { OneTimePurchaseCard } from "@/presentation/stripe/components/billing-cards"
import SubscriptionPlan from "@/presentation/stripe/components/SubscriptionPlan";
import ClientComp from "./ClientComp";

const page = async () => {
  const session = await auth();
  const subscriptionPlan = await getStripeUserSubscription()
  const invoices = await getStripeCustomerInvoices()
  console.log('invoices', invoices)

  if (!session) {
    return <div>Unauthorized</div>
  }

  const subscriptionPlanData = subscriptionPlan.data

  return (
    <div className="p-6">
      {/* <pre>{JSON.stringify(invoices, null, 2)}</pre> */}
      <ClientComp data={invoices} />

      <SubscriptionPlan subscriptionPlan={subscriptionPlanData} user={session.user} />

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