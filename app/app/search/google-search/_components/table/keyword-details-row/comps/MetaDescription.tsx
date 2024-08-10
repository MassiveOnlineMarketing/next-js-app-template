import React from 'react'
import { Card, CardPlainRow, CardTitle } from '../Card'
import TraficLightIndicator from './TraficLightIndicator'

const MetaDescription = ({ metaDescription }: { metaDescription: string | null }) => {
  if (!metaDescription) {
    return null
  }
  return (
    <Card>
      <CardTitle title='Meta Description'>
        <TraficLightIndicator maxValue={155} currentValue={metaDescription.length} />
      </CardTitle>
      <CardPlainRow value={metaDescription} className='dark:bg-p-1100' />
    </Card>
  )
}

export default MetaDescription