import React from 'react'
import { Card, CardPlainRow, CardTitle } from '../Card'
import { TraficLight, TraficLightIndicator, TraficLightMinMaxValue } from './TraficLightIndicator'


const MetaTitle = ({ metaTitle }: { metaTitle: string | null }) => {
  if (!metaTitle) {
    return null
  }

  return (
    <Card>
      <CardTitle title='Meta Title' >
        <TraficLight>
          <TraficLightMinMaxValue maxValue={60} currentValue={metaTitle.length} />
          <TraficLightIndicator maxValue={60} currentValue={metaTitle.length} />
        </TraficLight>
      </CardTitle>
      <CardPlainRow value={metaTitle} className='dark:bg-p-1100' />
    </Card>
  )
}

export default MetaTitle