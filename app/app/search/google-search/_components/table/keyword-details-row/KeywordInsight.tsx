import React from 'react'

import { GoogleSearchLatestKeywordResult } from '@/domain/serpTracker/enitities/GoogleSearchLatestKeywordResult'

import UserResultDetails from './keyword-insight/UserResultDetails'
import PerformanceDetails from './keyword-insight/PerformanceDetails'

import { Card, CardTitle } from './Card'

import { GoogleIconSvg } from '../../../../../../../assets/logos'

const KeywordInsight = ({ keywordData, domainUrl }: {
  keywordData: GoogleSearchLatestKeywordResult
  domainUrl: string
}) => {
  return (
    <Card className="mt-6">
      <CardTitle heading="Keyword Insight" icon={GoogleIconSvg} />
      <div className="grid grid-flow-col">
        <div className="flex-grow flex flex-row gap-[10px] w-fit bg-primary-50 p-[6px] rounded-lg">
          <UserResultDetails keywordData={keywordData} domainUrl={domainUrl} />
          <PerformanceDetails keywordData={keywordData} />
        </div>
      </div>
    </Card>
  )
}

export default KeywordInsight