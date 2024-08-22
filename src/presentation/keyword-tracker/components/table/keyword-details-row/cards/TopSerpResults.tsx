import React from 'react'

import { cn } from '@/presentation/components/utils'
import { getOrdinalSuffix } from '@/presentation/utils/numberUtils'

import useGoogleSearchTopTenResults from '@/presentation/keyword-tracker/hooks/fetching/useGoogleSearchTopTenResults'

import { Card, CardAccordion, CardAccordionContent, CardAccordionItem, CardAccordionTrigger, CardTitle } from '../Card'

const TopSerpResults = ({
  keywordId,
  userDomain
}: {
  keywordId: string
  userDomain: string
}) => {
  const { data } = useGoogleSearchTopTenResults(keywordId)

  if (!data?.data) return


  return (
    <Card>
      <CardTitle title='Top SERP Results' />
      <CardAccordion type='multiple'>
        {data.data
          .sort((a, b) => a.position - b.position)
          .map((result, index) => {
            const url = new URL(result.url);
            const domainName = url.hostname
              .replace("www.", "")
              .split(".")
              .slice(0, -1)
              .join(".");
            const domainUrl = url.hostname
            const { metaTitle, metaDescription } = result;
            const usersPosition = userDomain.includes(domainName)
            const suffix = getOrdinalSuffix(result.position)

            return (
              <CardAccordionItem key={index} value={result.url}>
                <CardAccordionTrigger >
                  <div className='flex gap-2'>
                    <div className='w-10 h-10 rounded-[4px] dark:bg-dark-bg-light  flex items-center justify-center'>{result.position}{suffix}</div>
                    <div className='text-left'>
                      <p className={cn(
                        'text-gray-800 dark:text-dark-text-light',
                        usersPosition && 'text-primary-500 dark:text-primary-300'
                      )}>{domainName}</p>
                      <p className='text-gray-500 dark:text-dark-text-dark'>{domainUrl}</p>
                    </div>
                  </div>
                </CardAccordionTrigger>
                <CardAccordionContent>
                  <p className='text-p-500 text-xl'>{metaTitle}</p>
                  <p className='text-gray-500 dark:text-dark-text-dark'>{metaDescription}</p>
                </CardAccordionContent>
              </CardAccordionItem>
            )
          })}
      </CardAccordion>
    </Card>
  )
}

export default TopSerpResults