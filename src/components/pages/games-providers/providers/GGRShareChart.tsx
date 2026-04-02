'use client'

import { useMemo } from 'react'
import { ApexOptions } from 'apexcharts'
import dynamic from 'next/dynamic'
import { formatNumber } from '@/lib/utils'
import { Card } from '@/components/ui/card'

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
})

interface GGRShareChartProps {
  ggrShare: Array<{
    provider: string
    code: string
    ggr: number
    percentage: number
  }>
}

export default function GGRShareChart({ ggrShare }: GGRShareChartProps) {
  const options: ApexOptions = useMemo(
    () => ({
      chart: {
        type: 'donut',
        fontFamily: 'Outfit, sans-serif',
      },
      labels: ggrShare.map((item) => item.provider),
      colors: ['#465FFF', '#33FF57', '#FF6B6B', '#FFD93D', '#9B59B6', '#E67E22', '#1ABC9C', '#E74C3C', '#3498DB', '#F39C12'],
      legend: { position: 'bottom' },
      dataLabels: {
        enabled: true,
        formatter: (val: number) => `${val.toFixed(1)}%`,
      },
      tooltip: {
        y: {
          formatter: (val: number, opts: any) => {
            const seriesIndex = opts.seriesIndex
            const item = ggrShare[seriesIndex]
            if (item) {
              return `${item.provider}: ${val.toFixed(1)}% (R$ ${formatNumber(item.ggr)})`
            }
            return `${val.toFixed(1)}%`
          },
        },
      },
    }),
    [ggrShare]
  )

  const series = useMemo(
    () => ggrShare.map((item) => item.percentage || 0),
    [ggrShare]
  )

  return (
    <Card>
      <h4 className='mb-4 text-sm font-medium text-gray-400'>GGR Share (Donut)</h4>
      {ggrShare && ggrShare.length > 0 ? (
        <ReactApexChart
          options={options}
          series={series}
          type='donut'
          height={300}
        />
      ) : (
        <p className='text-xs text-gray-500'>No GGR share data available</p>
      )}
    </Card>
  )
}

