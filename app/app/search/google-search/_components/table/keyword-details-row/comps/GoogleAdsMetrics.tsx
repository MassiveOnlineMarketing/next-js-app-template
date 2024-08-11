import { GoogleSearchLatestKeywordResult } from '@/domain/serpTracker/enitities/GoogleSearchLatestKeywordResult'
import React from 'react'
import { Card, CardTitle, CardRow } from '../Card'
import { TraficLight, TraficLightIndicator, TraficLightMinMaxValue } from './TraficLightIndicator'

const GoogleAdsMetrics = ({ keywordData }: { keywordData: GoogleSearchLatestKeywordResult }) => {
  const competitionIndex = Number(keywordData.competitionIndex)
  const highTopOfBidPage = Number(keywordData.highTopOfBidPage)
  const lowTopOfBidPage = Number(keywordData.lowTopOfBidPage)

  return (
    <Card>
      <CardTitle title='Competition Index' >
        <TraficLight>
          <TraficLightMinMaxValue maxValue={100} currentValue={competitionIndex} />
          <TraficLightIndicator maxValue={100} currentValue={competitionIndex} flip />
        </TraficLight>
      </CardTitle>
      <CardRow label='Keyword volume' value={`${keywordData.avgMonthlySearches}/mo`} />
      <CardRow label='Higest bid' value={highTopOfBidPage} fill />
      <CardRow label='Lowest bid' value={lowTopOfBidPage} />
    </Card>
  )
}

export default GoogleAdsMetrics