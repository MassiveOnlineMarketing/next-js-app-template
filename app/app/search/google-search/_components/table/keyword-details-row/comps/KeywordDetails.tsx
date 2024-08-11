import React from 'react'
import { Card, CardDateRow, CardPlainRow, CardRow, CardTagsRow, CardTitle } from '../Card'
import { TraficLight, TraficLightIndicator } from './TraficLightIndicator'
import { GoogleSearchLatestKeywordResult } from '@/domain/serpTracker/enitities/GoogleSearchLatestKeywordResult'

const KeywordDetails = ({ keywordData }: { keywordData: GoogleSearchLatestKeywordResult }) => {
  return (
    <Card>
      <CardTitle title='Keyword'>
        <TraficLight>
          <p>{keywordData.position}</p>
          <TraficLightIndicator maxValue={100} currentValue={keywordData.position} />
        </TraficLight>
      </CardTitle>
      <CardPlainRow value={keywordData.keywordName} />
      <CardRow label='Position' value={keywordData.position} fill />
      <CardRow label='Best Position' value={keywordData.bestPosition} />
      <CardRow label='First Position' value={keywordData.firstPosition} fill />
      <CardRow label='Latest Change' value={keywordData.latestChange} />
      <CardDateRow label='Created At' value={keywordData.createdAt} fill />
      <CardTagsRow label='Tags' tags={keywordData.tags} />
    </Card>
  )
}

export default KeywordDetails