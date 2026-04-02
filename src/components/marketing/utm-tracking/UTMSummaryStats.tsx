'use client'
import { ApexOptions } from 'apexcharts'
import cn from 'classnames'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

import { formatNumber } from '@/lib/utils'
import { getUtmSourceOptions } from '@/lib/utils'

import Loading from '@/components/common/Loading'

import { UTMTrackingTotalRow } from '@/types/utm-track'

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
})

const UTM_SOURCE_OPTIONS = getUtmSourceOptions(true)

UTM_SOURCE_OPTIONS.unshift({
  label: 'All',
  value: 'all',
  icon: '/images/icons/user-group.png',
})

interface UTMSummaryStatsProps {
  data: UTMTrackingTotalRow[]
}

const UTMSummaryStats = ({ data }: UTMSummaryStatsProps) => {
  const optionsOne: ApexOptions = {
    grid: {
      show: false,
    },
    colors: ['#12B76A'],
    fill: {
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
      },
    },
    legend: {
      show: false,
    },
    chart: {
      fontFamily: 'Outfit, sans-serif',
      height: 70,
      type: 'area',
      parentHeightOffset: 0,

      toolbar: {
        show: false,
      },
    },
    tooltip: {
      enabled: false,
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
      width: 1,
    },
    xaxis: {
      type: 'datetime',
      categories: [
        '2018-09-19T00:00:00.000Z',
        '2018-09-19T01:30:00.000Z',
        '2018-09-19T02:30:00.000Z',
        '2018-09-19T03:30:00.000Z',
        '2018-09-19T04:30:00.000Z',
        '2018-09-19T05:30:00.000Z',
        '2018-09-19T06:30:00.000Z',
        '2018-09-19T07:30:00.000Z',
        '2018-09-19T08:30:00.000Z',
        '2018-09-19T09:30:00.000Z',
        '2018-09-19T10:30:00.000Z',
        '2018-09-19T11:30:00.000Z',
        '2018-09-19T12:30:00.000Z',
      ],
      labels: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    yaxis: {
      labels: {
        show: false,
      },
    },
  }

  const series = [
    {
      name: 'New Sales',
      data: [300, 350, 310, 370, 248, 187, 295, 191, 269, 201, 185, 252, 151],
    },
  ]

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (data) {
      setIsLoading(false)
    }
  }, [data])

  return (
    <>
      {isLoading && <Loading />}
      {!isLoading && data && (
        <div
          className={cn(
            'mb-5 grid grid-cols-1 gap-4 md:gap-6',
            'xl:grid-cols-3',
            'md:grid-cols-2',
            'sm:grid-cols-1'
          )}
        >
          {UTM_SOURCE_OPTIONS.map((option) => (
            <div
              key={option.value}
              className={cn(
                'flex flex-col justify-between rounded-2xl',
                'border border-gray-200 bg-white p-5 md:pt-6 md:pr-4 md:pb-1 md:pl-4 dark:border-gray-800 dark:bg-white/[0.03]'
              )}
            >
              <div className='flex items-center gap-3'>
                <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800'>
                  <Image
                    src={option.icon}
                    alt={option.label}
                    width={35}
                    height={35}
                  />
                </div>
                <div className='text-sm font-bold'>
                  <span className='block text-lg text-white'>
                    {option.label}
                  </span>
                  <span className='block text-xs font-light text-gray-500 dark:text-gray-400'>
                    Visitors | Registrations
                  </span>
                </div>
              </div>

              <div className='flex h-full items-center justify-between'>
                <div className='flex h-full items-center text-2xl font-bold text-gray-800 dark:text-white/90'>
                  {formatNumber(
                    data.find((row) => row.source === option.value)?.visitors ??
                      0
                  )}{' '}
                  |{' '}
                  {formatNumber(
                    data.find((row) => row.source === option.value)
                      ?.registeredUsers ?? 0
                  )}
                </div>
                <div className='w-full max-w-[150px]'>
                  <div className='chartNine chartNine-01'>
                    <ReactApexChart
                      options={optionsOne}
                      series={series}
                      type='area'
                      height={70}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

export default UTMSummaryStats
