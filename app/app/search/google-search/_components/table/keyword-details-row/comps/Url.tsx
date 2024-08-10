import React from 'react'
import { Card, CardPlainRow, CardTitle } from '../Card'
import TraficLightIndicator from './TraficLightIndicator'

const Url = ({ url }: { url: string | null }) => {
  if (!url) {
    return null
  }

  return (
    <Card>
      <CardTitle title='Url' />
      <CardPlainRow value={url} fill />
    </Card>
  )
}

export default Url