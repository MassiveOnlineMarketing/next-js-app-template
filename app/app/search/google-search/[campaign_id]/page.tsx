import { getGoogleSearchCampaignById } from '@/application/useCases/googleSearchCampaign/getGoogleSearchCampaignById'
import React, { Suspense } from 'react'

import { getGoogleSearchLatestSerpResults } from '@/application/useCases/googleSearchLatestSerpResults/getGoogleSearchLatestSerpResults'
import BreadCrumbsSearchKeywords from '@/presentation/keyword-tracker/components/bread-crumbs'
import ClientPage from './ClientPage'
import { LoadingSpinner } from '@/presentation/components/ui/loading-spinner'
import { GoogleSearchCampaign } from '@/domain/serpTracker/enitities/GoogleSearchCampaign'
import { auth } from '@/application/services/AuthService'

// TODO: ui
const page = async ({
  params: { campaign_id }
}: {
  params: { campaign_id: string }
}) => {

  const googleSearchCampaign = await getGoogleSearchCampaignById(campaign_id)
  if (!googleSearchCampaign) return <div className='flex h-full w-full items-center justify-center'>Project not Found</div>;

  return (
    <div className="w-full h-full">
      <BreadCrumbsSearchKeywords campaignName={googleSearchCampaign.data!.campaignName} />

      <Suspense fallback={<div className='flex h-full w-full items-center justify-center'><LoadingSpinner /></div>}>
        <PageInitializationLoading project={googleSearchCampaign.data!} />
      </Suspense>  </div>
  )
}

async function PageInitializationLoading({ project }: { project: GoogleSearchCampaign }) {

  // TODO AUTH: Check if the user is authorized to view the project 
  const session = await auth()
  if (project.userId !== session?.user.id) return <div className='flex h-full w-full items-center justify-center'>Not authorized</div>;
  const latestResultsRes = await getGoogleSearchLatestSerpResults(project.id);
  const filteredSerpResults = latestResultsRes.data!.filter(result => result !== null) ;

  return <ClientPage latestSerpResults={filteredSerpResults} googleSearchCampaign={project} />
}
export default page