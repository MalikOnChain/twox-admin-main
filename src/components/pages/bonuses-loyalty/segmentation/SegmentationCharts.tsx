'use client'

import dynamic from 'next/dynamic'
import { ISegmentationStats } from '@/api/bonus-segmentation'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

interface SegmentationChartsProps {
  stats: ISegmentationStats | null
}

export default function SegmentationCharts({ stats }: SegmentationChartsProps) {
  if (!stats) return null

  const countryChartOptions = stats.byCountry
    ? {
        chart: { type: 'bar' as const },
        xaxis: { categories: stats.byCountry.map((c) => c.name) },
        series: [
          {
            name: 'Users',
            data: stats.byCountry.map((c) => c.count),
          },
        ],
      }
    : null

  const vipChartOptions = stats.byVIP
    ? {
        chart: { type: 'donut' as const },
        labels: stats.byVIP.map((v) => v.name),
        series: stats.byVIP.map((v) => v.count),
      }
    : null

  const riskChartOptions = stats.byRisk
    ? {
        chart: { type: 'pie' as const },
        labels: stats.byRisk.map((r) => r.name.toUpperCase()),
        series: stats.byRisk.map((r) => r.count),
      }
    : null

  return (
    <div className='mb-6 grid grid-cols-1 gap-4 md:grid-cols-3'>
      {countryChartOptions && (
        <div className='rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-white/[0.03]'>
          <h4 className='mb-4 text-sm font-semibold text-gray-800 dark:text-white'>
            Users by Country
          </h4>
          <Chart
            options={countryChartOptions}
            series={countryChartOptions.series}
            type='bar'
            height={300}
          />
        </div>
      )}

      {vipChartOptions && (
        <div className='rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-white/[0.03]'>
          <h4 className='mb-4 text-sm font-semibold text-gray-800 dark:text-white'>
            Users by VIP Tier
          </h4>
          <Chart
            options={vipChartOptions}
            series={vipChartOptions.series}
            type='donut'
            height={300}
          />
        </div>
      )}

      {riskChartOptions && (
        <div className='rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-white/[0.03]'>
          <h4 className='mb-4 text-sm font-semibold text-gray-800 dark:text-white'>
            Users by Risk Level
          </h4>
          <Chart
            options={riskChartOptions}
            series={riskChartOptions.series}
            type='pie'
            height={300}
          />
        </div>
      )}
    </div>
  )
}

