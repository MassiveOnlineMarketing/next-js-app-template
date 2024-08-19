import React from 'react'
import { Card, CardPlainRow, CardTitle } from '../Card'
import { Link1Icon, Link2Icon } from '@radix-ui/react-icons'
import { Link } from 'lucide-react'
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'

const Url = ({ url, domainUrl }: { url: string | null, domainUrl: string }) => {
  if (!url) {
    return null
  }

  const displayUrl = url.replace(domainUrl, '')

  const copyUrlToClipboard = (url: string | null) => {
    if (!url) return;

    navigator.clipboard.writeText(url);
  }

  return (
    <Card>
      <CardTitle title='Url' >
        <button onClick={() => copyUrlToClipboard(url)}>
          <Link className='w-4 h-4 text-gray-500 dark:text-dark-text-dark' />
        </button>
        <div>
          <a href={url} target='_blank'>
            <ArrowTopRightOnSquareIcon className='w-4 h-4 text-gray-500 dark:text-dark-text-dark' />
          </a>
        </div>
      </CardTitle>
      <CardPlainRow paragraphStyles='truncate' value={displayUrl} className='dark:bg-p-1100  bg-primary-50' />
    </Card>
  )
}

export default Url