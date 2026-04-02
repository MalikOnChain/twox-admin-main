'use client'

import { ApexOptions } from 'apexcharts'
import dynamic from 'next/dynamic'
import { useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { formatNumber } from '@/lib/utils'

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
})

interface CurrencyExposureChartProps {
  exposureData: {
    exposure: Array<{
      currency: string
      amount: number
      percentage: number
    }>
  } | null
  formatCurrency: (amount: number, currency: string) => string
}

export default function CurrencyExposureChart({
  exposureData,
  formatCurrency,
}: CurrencyExposureChartProps) {
  const chartOptions: ApexOptions = useMemo(
    () => ({
      chart: {
        type: 'pie',
        fontFamily: 'Outfit, sans-serif',
      },
      labels: exposureData?.exposure.map((e) => e.currency) || [],
      colors: ['#465FFF', '#33FF57', '#FF6B6B', '#FFD93D', '#9B59B6', '#E67E22'],
      legend: { position: 'bottom' },
      dataLabels: { enabled: true, formatter: (val: number) => `${val.toFixed(1)}%` },
    }),
    [exposureData]
  )

  const chartSeries = useMemo(
    () => exposureData?.exposure.map((e) => e.amount) || [],
    [exposureData]
  )

  return (
    <div className='mt-6'>
      <h3 className='text-lg font-semibold text-gray-800 dark:text-white/90'>Currency Exposure</h3>
      <div className='mt-4'>
        <Card>
          {exposureData && exposureData.exposure.length > 0 ? (
            <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
              <ReactApexChart options={chartOptions} series={chartSeries} type='pie' height={300} />
              <div className='space-y-2'>
                {exposureData.exposure.map((item) => (
                  <div
                    key={item.currency}
                    className='flex items-center justify-between rounded-lg border border-gray-100 p-3 dark:border-white/[0.05]'
                  >
                    <div>
                      <p className='font-semibold text-gray-800 dark:text-white/90'>{item.currency}</p>
                      <p className='text-xs text-gray-500 dark:text-gray-400'>
                        {formatCurrency(item.amount, item.currency)}
                      </p>
                    </div>
                    <div className='text-right'>
                      <p className='font-semibold text-gray-800 dark:text-white/90'>
                        {item.percentage.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className='text-xs text-gray-500 dark:text-gray-400'>No exposure data available</p>
          )}
        </Card>
      </div>
    </div>
  )
}

