'use client'

import { ApexOptions } from 'apexcharts'
import dynamic from 'next/dynamic'
import { useMemo } from 'react'
import { Card } from '@/components/ui/card'

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
})

interface LiquidityTrendChartProps {
  liquidityData: {
    labels: string[]
    deposits: number[]
    withdrawals: number[]
    netLiquidity: number[]
  } | null
}

export default function LiquidityTrendChart({ liquidityData }: LiquidityTrendChartProps) {
  const chartOptions: ApexOptions = useMemo(
    () => ({
      chart: {
        type: 'line',
        fontFamily: 'Outfit, sans-serif',
        toolbar: { show: false },
      },
      colors: ['#465FFF', '#FF6B6B', '#33FF57'],
      stroke: { curve: 'smooth', width: 2 },
      xaxis: { categories: liquidityData?.labels || [] },
      yaxis: { title: { text: 'Amount' } },
      legend: { position: 'top' },
      dataLabels: { enabled: false },
    }),
    [liquidityData]
  )

  const chartSeries = useMemo(
    () => [
      {
        name: 'Deposits',
        data: liquidityData?.deposits || [],
      },
      {
        name: 'Withdrawals',
        data: liquidityData?.withdrawals || [],
      },
      {
        name: 'Net Liquidity',
        data: liquidityData?.netLiquidity || [],
      },
    ],
    [liquidityData]
  )

  return (
    <div className='mt-6'>
      <h3 className='text-lg font-semibold text-gray-800 dark:text-white/90'>Liquidity Trend</h3>
      <div className='mt-4'>
        <Card>
          {liquidityData && liquidityData.labels.length > 0 ? (
            <ReactApexChart
              options={chartOptions}
              series={chartSeries}
              type='line'
              height={300}
            />
          ) : (
            <p className='text-xs text-gray-500 dark:text-gray-400'>No liquidity data available</p>
          )}
        </Card>
      </div>
    </div>
  )
}

