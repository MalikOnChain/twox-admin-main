'use client'
import { ApexOptions } from 'apexcharts'
import dynamic from 'next/dynamic'
import { useMemo } from 'react'

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
})

interface SessionDistributionChartProps {
  data: Array<{
    range: string
    count: number
  }>
}

export default function SessionDistributionChart({ data }: SessionDistributionChartProps) {
  const chartOptions: ApexOptions = useMemo(
    () => ({
      chart: {
        type: 'bar',
        fontFamily: 'Outfit, sans-serif',
        toolbar: { show: false },
      },
      colors: ['#465FFF'],
      plotOptions: {
        bar: {
          borderRadius: 5,
        },
      },
      dataLabels: { enabled: true },
      xaxis: {
        categories: data.map((d) => d.range),
      },
      yaxis: {
        title: { text: 'Count' },
      },
    }),
    [data]
  )

  const chartSeries = useMemo(
    () => [
      {
        name: 'Sessions',
        data: data.map((d) => d.count),
      },
    ],
    [data]
  )

  return (
    <div>
      <h3 className='mb-4 text-lg font-semibold text-gray-800 dark:text-white/90'>
        Session Distribution
      </h3>
      <ReactApexChart options={chartOptions} series={chartSeries} type='bar' height={250} />
    </div>
  )
}

