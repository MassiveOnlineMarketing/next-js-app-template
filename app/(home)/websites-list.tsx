import { getAllWebsites } from '@/application/useCases/website/getAllWebsites'
import React from 'react'

const WebsitesList = async () => {

  const res = await getAllWebsites()
  return (
    <div className='py-10'>
      <h1>Websites List</h1>
      <div className='grid grid-cols-4 gap-4'>
        {
          res.map((website) => {
            return (
              <div key={website.id} className='bg-gray-50 rounded-2xl'>
                <h1>{website.websiteName}</h1>
                <p>{website.domainUrl}</p>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default WebsitesList