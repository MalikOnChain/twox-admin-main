'use client'
import React, { useEffect, useState } from 'react'

import { getMetrics } from '@/api/metrics'

import { formatNumber } from '@/lib/utils'

import Loading from '@/components/common/Loading'

import { GiftIcon, GroupIcon } from '@/icons'

import { IMetrics } from '@/types/metrics'
export const AffiliateMetrics = () => {
  const [metrics, setMetrics] = useState<IMetrics>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    const fetchMetrics = async () => {
      const metrics = await getMetrics()
      setMetrics(metrics)
      setIsLoading(false)
    }
    fetchMetrics()
  }, [])
  return (
    <>
      {isLoading && <Loading />}
      {metrics && (
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6'>
          {/* <!-- Metric Item Start --> */}
          <div className='rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/[0.03]'>
            <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800'>
              <GroupIcon className='size-6 text-gray-800 dark:text-white/90' />
            </div>

            <div className='mt-5 flex items-end justify-between'>
              <div>
                <span className='text-sm text-gray-500 dark:text-gray-400'>
                  {metrics?.[0]?.key}
                </span>
                <h4 className='text-title-sm mt-2 font-bold text-gray-800 dark:text-white/90'>
                  {formatNumber(metrics?.[0]?.value || 0)}
                </h4>
              </div>
              {/* <Badge color='success'>
                <ArrowUpIcon />
                11.01%
              </Badge> */}
            </div>
          </div>
          {/* <!-- Metric Item End --> */}

          {/* <!-- Metric Item Start --> */}
          <div className='rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/[0.03]'>
            <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800'>
              <GiftIcon className='text-gray-800 dark:text-white/90' />
            </div>
            <div className='mt-5 flex items-end justify-between'>
              <div>
                <span className='text-sm text-gray-500 dark:text-gray-400'>
                  {metrics?.[1]?.key}
                </span>
                <h4 className='text-title-sm mt-2 font-bold text-gray-800 dark:text-white/90'>
                  {formatNumber(metrics?.[1]?.value || 0)}
                </h4>
              </div>

              {/* <Badge color='error'>
                <ArrowDownIcon className='text-error-500' />
                9.05%
              </Badge> */}
            </div>
          </div>
          {/* <!-- Metric Item End --> */}
        </div>
      )}
    </>
  )
}
