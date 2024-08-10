import React from 'react'
import { Card, CardPlainRow, CardTitle } from '../Card'
import TraficLightIndicator from './TraficLightIndicator'

const MetaTitle = ({ metaTitle }: { metaTitle: string | null }) => {
  if (!metaTitle) {
    return null
  }

  return (
    <Card>
      <CardTitle title='Meta Title' >
        <TraficLightIndicator maxValue={60} currentValue={metaTitle.length} />
      </CardTitle>
      <CardPlainRow value={metaTitle} className='dark:bg-p-1100' />
    </Card>
  )
}

export default MetaTitle