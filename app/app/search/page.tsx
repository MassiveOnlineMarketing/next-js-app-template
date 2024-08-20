import { GoogleSearchCampaignWithResult } from '@/application/dto/GoogleSearchCampaignWithResult';
import { auth } from '@/application/services/AuthService'
import { getGoogleSearchCampaignByUserId } from '@/application/useCases/googleSearchCampaign/getGoogleSearchCampaignByUserId'
import googleSearchCampaignRepository from '@/infrastructure/repositories/GoogleSearchCampaignRepository';
import MessageFromTeam from '@/presentation/components/dashboard/MessageFromTeam';
import Link from 'next/link';
import React from 'react'

import DataTable from './_components/search-project-table';
import { columns } from './_components/search-project-table-columns';
import { TableTitle } from '@/presentation/components/ui/table';
import SearchPageBanner from '../_dash-layout/SearchPageBanner';


const page = async () => {

  const session = await auth();
  const user = session?.user

  const userId = session?.user?.id
  if (!userId) return null
  // const userCampaigns = await getGoogleSearchCampaignByUserId(userId)

  const userCampaigns = await googleSearchCampaignRepository.getCampaignsWithCampaignResultByUserId(userId)
  const formattedCampaigns = GoogleSearchCampaignWithResult.fromDbQuery(userCampaigns)


  return (
    <div>
      <SearchPageBanner user={user} className='mb-4'/>
      <MessageFromTeam
        className="max-w-[770px] mb-6"
        heading="Message from Team"
        message='Keyword Tracker is a product in development, we are constantly updating and improving the user experience. Your feedback is valuable to us. For any questions regarding assistance and feedback, please feel free to <a class="text-primary-500" href="https://yourwebsite.com/contact">contact us</a>.'
      />
      <div className="bg-white dark:bg-dark-bg-light shadow-base rounded-2xl p-8">
        <TableTitle heading="Google Search Campaigns" />
        <DataTable columns={columns} data={formattedCampaigns} />
      </div>
    </div>
  )
}

export default page