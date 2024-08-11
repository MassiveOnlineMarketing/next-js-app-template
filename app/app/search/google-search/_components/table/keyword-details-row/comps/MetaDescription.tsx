import React from 'react'
import { Card, CardPlainRow, CardTitle } from '../Card'
import { TraficLight, TraficLightIndicator, TraficLightMinMaxValue } from './TraficLightIndicator'

const MetaDescription = ({ metaDescription }: { metaDescription: string | null }) => {
  if (!metaDescription) {
    return null
  }
  return (
    <Card>
      <CardTitle title='Meta Description'>
        <TraficLight>
          <TraficLightMinMaxValue maxValue={155} currentValue={metaDescription.length} />
          <TraficLightIndicator maxValue={155} currentValue={metaDescription.length} />
        </TraficLight>
      </CardTitle>
      <CardPlainRow value={metaDescription} className='dark:bg-p-1100' />
    </Card>
  )
}

export default MetaDescription