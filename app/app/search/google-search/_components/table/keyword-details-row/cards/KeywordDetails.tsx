import React from 'react'
import { Card, CardDateRow, CardPlainRow, CardRow, CardTagsRow, CardTitle } from '../Card'
import { TraficLight, TraficLightIndicator } from '../comps/TraficLightIndicator'
import { GoogleSearchLatestKeywordResult } from '@/domain/serpTracker/enitities/GoogleSearchLatestKeywordResult'
import { getOrdinalSuffix } from '@/presentation/utils/numberUtils'

const KeywordDetails = ({ keywordData }: { keywordData: GoogleSearchLatestKeywordResult }) => {
  return (
    <Card>
      <CardTitle title='Keyword'>
        <TraficLight>
          <div className='text-p-800 dark:text-dark-text-light font-semibold mr-3'>
            {getPositionSvg(keywordData.position)}
          </div>
          <TraficLightIndicator maxValue={10} currentValue={keywordData.position} flip />
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


const getPositionSvg = (position: number | null) => {
  if (position === null) {
    return (
      <p className="text-sm">
        N/A
      </p>
    );
  }

  const suffix = getOrdinalSuffix(position);

  return (
    <p className='text-sm'>
      {position}
      <span className='text-[10px]'>{suffix}</span>
    </p>
  );
};

export default KeywordDetails