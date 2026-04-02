'use client'
import { ArrowDownIcon } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { getMetrics } from '@/api/metrics'

import { formatNumber } from '@/lib/utils'

import Loading from '@/components/common/Loading'
import Badge from '@/components/ui/badge/Badge'

import { ArrowUpIcon } from '@/icons'

import PixIcon from '../../../public/images/icons/pix.svg'

import { IMetrics } from '@/types/metrics'

export const EcommerceMetrics = () => {
  const [metrics, setMetrics] = useState<IMetrics>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchMetrics = async () => {
    try {
      const metrics = await getMetrics()
      setMetrics(metrics)
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Error fetching metrics')
      }
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchMetrics()
  }, [])

  const renderMetricCard = (metric: any, index: number, isCurrency = false, currencySymbol = 'R$') => {
    if (!metric) return null;

    const getIcon = () => {
      const iconMap: Record<string, React.ReactNode> = {
        'Users': (
              <Image
                src='/images/icons/user-group.png'
                alt='User Group'
                className='text-gray-800 dark:text-white/90'
                width={48}
                height={48}
                priority
              />
        ),
        'Total Users Deposits': <PixIcon className='text-gray-800 dark:text-white/90' />,
        'Total Users Bet Amount': (
          <Image
            src='/images/icons/commission.png'
            alt='Bet Amount'
            className='text-gray-800 dark:text-white/90'
            width={48}
            height={48}
            priority
          />
        ),
        'Total GGR': (
          <Image
            src='/images/icons/commission.png'
            alt='GGR'
            className='text-gray-800 dark:text-white/90'
            width={48}
            height={48}
            priority
          />
        ),
        'Active Players': (
          <Image
            src='/images/icons/user-group.png'
            alt='Active Players'
            className='text-gray-800 dark:text-white/90'
            width={48}
            height={48}
            priority
          />
        ),
        'Pending Withdrawals': <PixIcon className='text-gray-800 dark:text-white/90' />,
        'Platform Fees': (
              <Image
                src='/images/icons/commission.png'
            alt='Platform Fees'
            className='text-gray-800 dark:text-white/90'
            width={48}
            height={48}
            priority
          />
        ),
        'Online Users': (
          <Image
            src='/images/icons/user-group.png'
            alt='Online Users'
            className='text-gray-800 dark:text-white/90'
            width={48}
            height={48}
            priority
          />
        ),
      };
      return iconMap[metric.key] || (
        <Image
          src='/images/icons/user-group.png'
          alt={metric.key}
                className='text-gray-800 dark:text-white/90'
                width={48}
                height={48}
                priority
              />
      );
    };

    return (
      <div key={index} className='rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/[0.03]'>
        <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800'>
          {getIcon()}
            </div>

            <div className='mt-5 flex items-end justify-between'>
              <div>
                <span className='text-sm text-gray-500 dark:text-gray-400'>
              {metric.key}
                </span>
                <h4 className='text-title-sm mt-2 font-bold text-gray-800 dark:text-white/90'>
              {isCurrency
                ? `${currencySymbol} ${formatNumber(metric.value || 0)}`
                : formatNumber(metric.value || 0)}
                </h4>
              </div>

          {metric.upgradingPercentage !== 0 && (
              <div className='flex items-center gap-2 text-gray-500 dark:text-gray-400'>
                <Badge
                color={metric.upgradingPercentage > 0 ? 'success' : 'error'}
                >
                {metric.upgradingPercentage > 0 ? (
                    <ArrowUpIcon />
                  ) : (
                    <ArrowDownIcon />
                  )}
                {metric.upgradingPercentage}%
                </Badge>{' '}
                VS last month
              </div>
          )}
            </div>
          </div>
    );
  };

  return (
    <>
      {isLoading && <Loading />}
      {metrics && (
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4'>
          {metrics.map((metric, index) => {
            // Determine if currency formatting is needed
            const isCurrency = [
              'Total Users Deposits',
              'Total GGR',
              'Pending Withdrawals',
              'Platform Fees',
            ].includes(metric.key);
            
            // Use $ for Total GGR, R$ for others
            const currencySymbol = metric.key === 'Total GGR' ? '$' : 'R$';
            
            return renderMetricCard(metric, index, isCurrency, currencySymbol);
          })}
        </div>
      )}
    </>
  )
}
