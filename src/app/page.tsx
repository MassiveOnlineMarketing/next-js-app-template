

import CreateNewWebsiteButton from "./(home)/create-new-website-button";
import currentUser from "@/presentation/auth/actions/currentUser";


export default async function Home() {
  const session = await currentUser()
  console.log('session user', session)


  return (
    <div className="min-h-screen p-24">
      {/* <WebsitesList /> */}
      <CreateNewWebsiteButton />
      {/* <CreateGoogleSearchCampaignForm /> */}

      
    </div>
  );
}
