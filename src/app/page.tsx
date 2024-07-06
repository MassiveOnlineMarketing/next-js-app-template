import { Toaster } from "@/presentation/components/toast/toaster";
import CreateGoogleSearchCampaignForm from "./(home)/create-google-search-campaign-form";
import CreateNewWebsiteButton from "./(home)/create-new-website-button";
import WebsitesList from "./(home)/websites-list";

export default function Home() {

  return (
    <div className="min-h-screen p-24">
      {/* <WebsitesList /> */}
      <CreateNewWebsiteButton />
      {/* <CreateGoogleSearchCampaignForm /> */}

      
    </div>
  );
}
