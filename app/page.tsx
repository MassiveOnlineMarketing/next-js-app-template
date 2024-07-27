'use server'


import Link from "next/link";
import ClientComp from "./(home)/client-comp";
import ClientPage from "./(home)/clientPage";
import currentUser from "@/presentation/auth/actions/currentUser";


export default async function Home() {
  // const session = await currentUser()
  // console.log('session user', session)


  return (
    <div className="min-h-screen p-24">
      <Link href={'/app/search'} > Link </Link>
      {/* <WebsitesList /> */}
      <ClientPage />
      <ClientComp />
      {/* <CreateGoogleSearchCampaignForm /> */}

      
    </div>
  );
}
