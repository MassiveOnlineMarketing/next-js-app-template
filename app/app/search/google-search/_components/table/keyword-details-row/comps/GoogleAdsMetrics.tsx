import { GoogleSearchLatestKeywordResult } from '@/domain/serpTracker/enitities/GoogleSearchLatestKeywordResult'
import React from 'react'
import { Card, CardTitle, CardRow } from '../Card'
import TraficLightIndicator from './TraficLightIndicator'

const GoogleAdsMetrics = ({keywordData}: {keywordData: GoogleSearchLatestKeywordResult}) => {
  const competitionIndex = Number(keywordData.competitionIndex)
  const highTopOfBidPage = Number(keywordData.highTopOfBidPage)
  const lowTopOfBidPage = Number(keywordData.lowTopOfBidPage)

  return (
    <Card>
      <CardTitle title='Competition Index' >
        <TraficLightIndicator maxValue={100} currentValue={competitionIndex} />
      </CardTitle>
      <CardRow label='Keyword volume' value={`${keywordData.avgMonthlySearches}/mo`} />
      <CardRow label='Higest bid' value={highTopOfBidPage} fill />
      <CardRow label='Lowest bid' value={lowTopOfBidPage} />
    </Card>
  )
}

export default GoogleAdsMetrics