'use client'

import { useMemo } from 'react'
import { ApexOptions } from 'apexcharts'
import dynamic from 'next/dynamic'
import { IGameDetail } from '@/api/games-providers'
import { Card } from '@/components/ui/card'

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
})

interface BetHistogramChartProps {
  betHistogram: IGameDetail['betHistogram']
}

export default function BetHistogramChart({
  betHistogram,
}: BetHistogramChartProps) {
  const options: ApexOptions = useMemo(
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
          horizontal: false,
        },
      },
      xaxis: {
        categories: betHistogram.map((item) => item.range),
      },
      yaxis: {
        title: { text: 'Count' },
      },
      dataLabels: { enabled: true },
    }),
    [betHistogram]
  )

  const series = useMemo(
    () => [
      {
        name: 'Bets',
        data: betHistogram.map((item) => item.count),
      },
    ],
    [betHistogram]
  )

  return (
    <Card>
      <h4 className='mb-4 text-sm font-medium text-gray-400'>Bet Histogram</h4>
      {betHistogram.length > 0 ? (
        <ReactApexChart options={options} series={series} type='bar' height={300} />
      ) : (
        <p className='text-xs text-gray-500'>No bet histogram data available</p>
      )}
    </Card>
  )
}

