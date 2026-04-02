'use client'
import { ApexOptions } from 'apexcharts'
import dynamic from 'next/dynamic'
import { useMemo } from 'react'

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
})

interface RetentionChartProps {
  data: Array<{
    period: string
    newUsers: number
    returningUsers: number
    retentionRate: number
  }>
}

export default function RetentionChart({ data }: RetentionChartProps) {
  const chartOptions: ApexOptions = useMemo(
    () => ({
      chart: {
        type: 'line',
        fontFamily: 'Outfit, sans-serif',
        toolbar: { show: false },
      },
      colors: ['#465FFF', '#9CB9FF', '#33FF57'],
      stroke: {
        curve: 'smooth',
        width: 2,
      },
      markers: {
        size: 4,
        hover: { size: 6 },
      },
      dataLabels: { enabled: false },
      xaxis: {
        categories: data.map((r) => r.period),
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: [
        {
          title: { text: 'User Count' },
          labels: {
            formatter: (val: number) => Math.round(val).toString(),
          },
        },
        {
          opposite: true,
          title: { text: 'Retention Rate (%)' },
          labels: {
            formatter: (val: number) => `${val.toFixed(1)}%`,
          },
        },
      ],
      legend: {
        show: true,
        position: 'top',
        horizontalAlign: 'right',
      },
      grid: {
        yaxis: { lines: { show: true } },
      },
      tooltip: {
        shared: true,
        intersect: false,
        y: {
          formatter: (val: number, opts: any) => {
            const seriesIndex = opts.seriesIndex
            if (seriesIndex === 2) {
              return `${val.toFixed(2)}%`
            }
            return Math.round(val).toString()
          },
        },
      },
    }),
    [data]
  )

  const chartSeries = useMemo(
    () => [
      {
        name: 'New Users',
        data: data.map((r) => r.newUsers),
      },
      {
        name: 'Returning Users',
        data: data.map((r) => r.returningUsers),
      },
      {
        name: 'Retention Rate',
        data: data.map((r) => r.retentionRate),
        yAxisIndex: 1,
      },
    ],
    [data]
  )

  return (
    <div className='rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/[0.03]'>
      <h3 className='mb-4 text-lg font-semibold text-gray-800 dark:text-white/90'>
        Retention 7/30/90 Days
      </h3>
      {data.length > 0 ? (
        <ReactApexChart
          options={chartOptions}
          series={chartSeries}
          type='line'
          height={300}
        />
      ) : (
        <div className='flex h-[300px] items-center justify-center text-gray-500 dark:text-gray-400'>
          No retention data available
        </div>
      )}
    </div>
  )
}

