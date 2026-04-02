'use client'

import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js'
import Image from 'next/image'
import React from 'react'
import { Bar, Doughnut, Line, Pie } from 'react-chartjs-2'

// Import Swiper styles
import { getUtmSourceOptions } from '@/lib/utils'

import { Skeleton } from '@/components/common/Skeleton'
import DatePickerGroup from '@/components/marketing/utm-tracking/DatePickerGroup'
import UTMTabs from '@/components/marketing/utm-tracking/UTMTabs'

import {
  GetUTMCampaignsResponse,
  GetUTMTrackingFilter,
  GetUTMTrackingResponse,
} from '@/types/utm-track'

interface UTMSummaryChartProps {
  utmTracking: GetUTMTrackingResponse | undefined
  campaigns: GetUTMCampaignsResponse | undefined
  isLoading?: boolean
  setFilter: (filter: GetUTMTrackingFilter) => void
  filter: GetUTMTrackingFilter
}

const UTM_SOURCE_OPTIONS = getUtmSourceOptions(true)

UTM_SOURCE_OPTIONS.unshift({
  label: 'All',
  value: 'all',
  icon: '/images/icons/user-group.png',
})

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

export const UTMSummaryChart = ({
  utmTracking,
  campaigns,
  isLoading = false,
  setFilter,
  filter,
}: UTMSummaryChartProps) => {
  // 1. Conversion Funnel Data
  const funnelData = {
    labels: [
      `Visitors ${utmTracking?.utmVisitors ?? 0}`,
      `Registered Users ${utmTracking?.registeredUsers ?? 0}`,
      `First Deposits ${utmTracking?.firstDeposits.count ?? 0}`,
      `Second Deposits ${utmTracking?.secondDeposits.count ?? 0}`,
    ],
    datasets: [
      {
        label: 'User Journey',
        data: [
          utmTracking?.utmVisitors ?? 0,
          utmTracking?.registeredUsers ?? 0,
          utmTracking?.firstDeposits.count ?? 0,
          utmTracking?.secondDeposits.count ?? 0,
        ],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
      },
    ],
  }

  // 2. Traffic Sources Distribution
  const sourceData = {
    labels: utmTracking?.sourceDistribution.map((item) => item.source) ?? [],
    datasets: [
      {
        data: utmTracking?.sourceDistribution.map((item) => item.count) ?? [],
        // 'diffenrent color for each source',
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
        ],
      },
    ],
  }

  // 3. Time Series Data
  const timeSeriesData = {
    labels: utmTracking?.timeSeriesData.map((item) => item.date) ?? [],
    datasets: [
      {
        label: 'Daily Visitors',
        data: utmTracking?.timeSeriesData.map((item) => item.visitors) ?? [],
        borderColor: '#FF6384',
        tension: 0.4,
        fill: false,
      },
    ],
  }

  // 4. Campaign Performance
  const campaignData = {
    labels: campaigns?.map((campaign) => campaign.name) ?? [],
    datasets: [
      {
        label: 'Visitors',
        data: campaigns?.map((campaign) => campaign.visitors) ?? [],
        backgroundColor: '#FF6384',
      },
      {
        label: 'Registrations',
        data: campaigns?.map((campaign) => campaign.registrations) ?? [],
        backgroundColor: '#36A2EB',
      },
      {
        label: 'First Deposits',
        data: campaigns?.map((campaign) => campaign.firstDeposits) ?? [],
        backgroundColor: '#FFCE56',
      },
    ],
  }

  // 5. Deposit Distribution
  const depositData = {
    labels: ['First Deposits', 'Second Deposits'],
    datasets: [
      {
        data: [
          utmTracking?.firstDeposits.amount ?? 0,
          utmTracking?.secondDeposits.amount ?? 0,
        ],
        backgroundColor: ['#36A2EB', '#FFCE56'],
      },
    ],
  }

  // Update chart options with dark mode text color
  const commonOptions = {
    plugins: {
      legend: {
        labels: {
          color: '#98a2b3',
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#98a2b3',
        },
        grid: {
          color: 'rgb(255 255 255 / 0.1)',
        },
      },
      x: {
        ticks: {
          color: '#98a2b3',
        },
        grid: {
          color: 'rgb(255 255 255 / 0.1)',
        },
      },
    },
  }

  return (
    <div className='mt-5 space-y-6 rounded-2xl border border-gray-200 bg-white px-5 pt-5 pb-5 sm:px-6 sm:pt-6 dark:border-gray-800 dark:bg-white/[0.03]'>
      <div className='flex flex-col gap-5 sm:flex-row sm:justify-between'>
        <div className='flex w-full flex-col items-center justify-between gap-4 sm:flex-row'>
          <div className='text-lg font-semibold text-gray-800 dark:text-white/90'>
            <div className='flex items-center gap-2'>
              <Image
                src={
                  UTM_SOURCE_OPTIONS.find(
                    (option) => option.value === filter.utm_source
                  )?.icon
                }
                alt='UTM Summary Chart'
                width={25}
                height={25}
              />
              <span className='mr-3 text-lg font-semibold whitespace-nowrap text-gray-800 dark:text-white/90'>
                UTM Summary Chart
              </span>
            </div>
          </div>
          <UTMTabs
            utmSource={filter.utm_source}
            onClick={(value) => setFilter({ ...filter, utm_source: value })}
            className='w-full'
          />
          <DatePickerGroup filter={filter} setFilter={setFilter} />
        </div>
      </div>

      {isLoading || !utmTracking || !campaigns ? (
        <div className='grid grid-cols-4 gap-6'>
          {/* Conversion Funnel loading skeleton (span 2) */}
          <div className='col-span-2 rounded-lg bg-white p-6 shadow-sm dark:bg-white/[0.03]'>
            <h3 className='mb-4 text-lg font-medium text-gray-900 dark:text-white/90'>
              Conversion Funnel
            </h3>
            <Skeleton className='h-[200px] rounded-2xl' />
          </div>

          {/* Traffic Sources */}
          <div className='rounded-lg bg-white p-6 shadow-sm dark:bg-white/[0.03]'>
            <h3 className='mb-4 text-lg font-medium text-gray-900 dark:text-white/90'>
              Traffic Sources
            </h3>
            <Skeleton className='h-[200px] rounded-2xl' />
          </div>

          {/* Deposit Distribution */}
          <div className='rounded-lg bg-white p-6 shadow-sm dark:bg-white/[0.03]'>
            <h3 className='mb-4 text-lg font-medium text-gray-900 dark:text-white/90'>
              Deposit Distribution
            </h3>
            <Skeleton className='h-[200px] rounded-2xl' />
          </div>

          {/* Daily Visitors Trend */}
          <div className='col-span-4 rounded-lg bg-white p-6 shadow-sm dark:bg-white/[0.03]'>
            <h3 className='mb-4 text-lg font-medium text-gray-900 dark:text-white/90'>
              Daily Visitors Trend
            </h3>
            <Skeleton className='h-[300px] rounded-2xl' />
          </div>

          {/* Campaign Performance */}
          <div className='col-span-4 rounded-lg bg-white p-6 shadow-sm dark:bg-white/[0.03]'>
            <h3 className='mb-4 text-lg font-medium text-gray-900 dark:text-white/90'>
              Campaign Performance
            </h3>
            <Skeleton className='h-[300px] rounded-2xl' />
          </div>
        </div>
      ) : (
        <div className='grid grid-cols-4 gap-6'>
          {/* Conversion Funnel (span 2) */}
          <div className='col-span-4 rounded-lg bg-white p-6 shadow-sm 2xl:col-span-2 dark:bg-white/[0.03]'>
            <h3 className='mb-4 text-lg font-medium text-gray-900 dark:text-white/90'>
              Conversion Funnel
            </h3>
            <div className='h-[200px]'>
              <Bar
                data={funnelData}
                options={{
                  ...commonOptions,
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    ...commonOptions.plugins,
                    legend: { display: false },
                    title: {
                      display: true,
                      text: 'User Journey',
                      color: 'rgb(255 255 255 / 0.9)',
                    },
                  },
                }}
              />
            </div>
          </div>

          {/* Traffic Sources */}
          <div className='col-span-4 rounded-lg bg-white p-6 shadow-sm md:col-span-2 2xl:col-span-1 dark:bg-white/[0.03]'>
            <h3 className='mb-4 text-lg font-medium text-gray-900 dark:text-white/90'>
              Traffic Sources
            </h3>
            <div className='h-[200px]'>
              <Pie
                data={sourceData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                      labels: {
                        color: 'rgb(255 255 255 / 0.9)',
                      },
                    },
                  },
                }}
              />
            </div>
          </div>

          {/* Deposit Distribution */}
          <div className='col-span-4 rounded-lg bg-white p-6 shadow-sm md:col-span-2 2xl:col-span-1 dark:bg-white/[0.03]'>
            <h3 className='mb-4 text-lg font-medium text-gray-900 dark:text-white/90'>
              Deposit Distribution
            </h3>
            <div className='h-[200px]'>
              <Doughnut
                data={depositData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                      labels: {
                        color: 'rgb(255 255 255 / 0.9)',
                      },
                    },
                  },
                }}
              />
            </div>
          </div>

          {/* Full width charts */}
          <div className='col-span-4 rounded-lg bg-white p-6 shadow-sm dark:bg-white/[0.03]'>
            <h3 className='mb-4 text-lg font-medium text-gray-900 dark:text-white/90'>
              Daily Visitors Trend
            </h3>
            <div className='h-[300px]'>
              <Line
                data={timeSeriesData}
                options={{
                  ...commonOptions,
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    ...commonOptions.plugins,
                    legend: {
                      position: 'top',
                      labels: {
                        color: 'rgb(255 255 255 / 0.9)',
                      },
                    },
                  },
                }}
              />
            </div>
          </div>

          <div className='col-span-4 rounded-lg bg-white p-6 shadow-sm dark:bg-white/[0.03]'>
            <h3 className='mb-4 text-lg font-medium text-gray-900 dark:text-white/90'>
              Campaign Performance
            </h3>
            <div className='h-[300px]'>
              <Bar
                data={campaignData}
                options={{
                  ...commonOptions,
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    ...commonOptions.plugins,
                    legend: {
                      position: 'top',
                      labels: {
                        color: 'rgb(255 255 255 / 0.9)',
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
