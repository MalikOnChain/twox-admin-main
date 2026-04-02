'use client'
import { ApexOptions } from 'apexcharts'
import dynamic from 'next/dynamic'
import { useMemo } from 'react'

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
})

interface TopCountriesChartProps {
  data: Array<{
    country: string
    count: number
  }>
}

export default function TopCountriesChart({ data }: TopCountriesChartProps) {
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
      dataLabels: {
        enabled: true,
        formatter: (val: number) => val.toString(),
      },
      xaxis: {
        categories: data.map((c) => c.country),
      },
      yaxis: {
        title: { text: 'Countries' },
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
        name: 'Players',
        data: data.map((c) => c.count),
      },
    ],
    [data]
  )

  return (
    <div className='rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/[0.03]'>
      <h3 className='mb-4 text-lg font-semibold text-gray-800 dark:text-white/90'>
        Top Countries
      </h3>
      {data.length > 0 ? (
        <ReactApexChart
          options={chartOptions}
          series={chartSeries}
          type='bar'
          height={300}
        />
      ) : (
        <div className='flex h-[300px] items-center justify-center text-gray-500 dark:text-gray-400'>
          No country data available
        </div>
      )}
    </div>
  )
}

