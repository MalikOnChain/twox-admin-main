'use client'
import { ApexOptions } from 'apexcharts'
import dynamic from 'next/dynamic'
import { useMemo } from 'react'

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
})

interface SessionTrendChartProps {
  data: Array<{
    date: string
    avgLength: number
  }>
}

export default function SessionTrendChart({ data }: SessionTrendChartProps) {
  const chartOptions: ApexOptions = useMemo(
    () => ({
      chart: {
        type: 'line',
        fontFamily: 'Outfit, sans-serif',
        toolbar: { show: false },
      },
      colors: ['#465FFF'],
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
        categories: data.map((s) => s.date),
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: {
        title: { text: 'Avg Length (min)' },
      },
      tooltip: {
        y: {
          formatter: (val: number) => `${val.toFixed(1)} min`,
        },
      },
    }),
    [data]
  )

  const chartSeries = useMemo(
    () => [
      {
        name: 'Avg Session Length',
        data: data.map((s) => s.avgLength),
      },
    ],
    [data]
  )

  return (
    <div>
      <h3 className='mb-4 text-lg font-semibold text-gray-800 dark:text-white/90'>
        Session Length Trend
      </h3>
      <ReactApexChart options={chartOptions} series={chartSeries} type='line' height={250} />
    </div>
  )
}

