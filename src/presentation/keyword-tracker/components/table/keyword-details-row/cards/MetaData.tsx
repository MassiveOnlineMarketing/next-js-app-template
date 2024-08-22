import React from 'react'

import { Card, CardPlainRow, CardTitle } from '../Card'
import { TraficLight, TraficLightIndicator, TraficLightMinMaxValue } from '../comps/TraficLightIndicator'


const MetaData = ({ metaTitle, metaDescription }: { metaTitle: string | null, metaDescription: string | null }) => {
  if (!metaTitle || !metaDescription) {
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
      <CardPlainRow value={metaTitle} className=' bg-primary-50 dark:bg-p-1100 pb-8' />
      <CardTitle title='Meta Description'>
        <TraficLight>
          <TraficLightMinMaxValue maxValue={155} currentValue={metaDescription.length} />
          <TraficLightIndicator maxValue={155} currentValue={metaDescription.length} />
        </TraficLight>
      </CardTitle>
      <CardPlainRow value={metaDescription} className=' bg-primary-50 dark:bg-p-1100 pb-8' />
    </Card>
  )
}

export default MetaData