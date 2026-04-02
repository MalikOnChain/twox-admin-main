'use client'
import { ApexOptions } from 'apexcharts'
import dynamic from 'next/dynamic'
import { useMemo } from 'react'

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
})

interface MigrationChartProps {
  data: Array<{
    tier: string
    count: number
  }>
}

export default function MigrationChart({ data }: MigrationChartProps) {
  const chartOptions: ApexOptions = useMemo(
    () => ({
      chart: {
        type: 'bar',
        stacked: true,
        fontFamily: 'Outfit, sans-serif',
        toolbar: { show: false },
      },
      colors: ['#465FFF', '#9CB9FF', '#33FF57', '#FF6B6B'],
      plotOptions: {
        bar: {
          borderRadius: 5,
        },
      },
      dataLabels: {
        enabled: true,
      },
      xaxis: {
        categories: data.map((m) => m.tier),
      },
      yaxis: {
        title: { text: 'User Count' },
      },
      legend: {
        show: true,
        position: 'top',
      },
      tooltip: {
        y: {
          formatter: (val: number) => val.toString(),
        },
      },
    }),
    [data]
  )

  const chartSeries = useMemo(
    () => [
      {
        name: 'Users',
        data: data.map((m) => m.count),
      },
    ],
    [data]
  )

  if (data.length === 0) {
    return null
  }

  return (
    <div>
      <h3 className='mb-4 text-lg font-semibold text-gray-800 dark:text-white/90'>
        Tier Migration
      </h3>
      <ReactApexChart
        options={chartOptions}
        series={chartSeries}
        type='bar'
        height={300}
      />
    </div>
  )
}

