'use client'
import { ApexOptions } from 'apexcharts'
import dynamic from 'next/dynamic'
import { useMemo } from 'react'

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
})

interface TimeByGameChartProps {
  data: Array<{
    gameName: string
    time: number
  }>
}

export default function TimeByGameChart({ data }: TimeByGameChartProps) {
  const chartOptions: ApexOptions = useMemo(
    () => ({
      chart: {
        type: 'bar',
        horizontal: true,
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
        categories: data.map((g) => g.gameName),
      },
      yaxis: {
        title: { text: 'Time (min)' },
      },
    }),
    [data]
  )

  const chartSeries = useMemo(
    () => [
      {
        name: 'Play Time',
        data: data.map((g) => g.time),
      },
    ],
    [data]
  )

  return (
    <div className='mt-6'>
      <h3 className='mb-4 text-lg font-semibold text-gray-800 dark:text-white/90'>
        Time by Game/Category
      </h3>
      <ReactApexChart options={chartOptions} series={chartSeries} type='bar' height={300} />
    </div>
  )
}

