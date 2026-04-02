'use client'

import { useMemo } from 'react'
import { ApexOptions } from 'apexcharts'
import dynamic from 'next/dynamic'
import { IGameDetail } from '@/api/games-providers'
import { Card } from '@/components/ui/card'

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
})

interface RTPTrendChartProps {
  rtpTrend: IGameDetail['rtpTrend']
}

export default function RTPTrendChart({ rtpTrend }: RTPTrendChartProps) {
  const options: ApexOptions = useMemo(
    () => ({
      chart: {
        type: 'line',
        fontFamily: 'Outfit, sans-serif',
        toolbar: { show: false },
      },
      colors: ['#465FFF'],
      stroke: { curve: 'smooth', width: 2 },
      xaxis: {
        categories: rtpTrend.map((item) => item.date),
      },
      yaxis: {
        title: { text: 'RTP %' },
        min: 0,
        max: 100,
      },
      dataLabels: { enabled: false },
      legend: { show: false },
    }),
    [rtpTrend]
  )

  const series = useMemo(
    () => [
      {
        name: 'RTP',
        data: rtpTrend.map((item) => item.rtp),
      },
    ],
    [rtpTrend]
  )

  return (
    <Card>
      <h4 className='mb-4 text-sm font-medium text-gray-400'>RTP Trend</h4>
      {rtpTrend.length > 0 ? (
        <ReactApexChart options={options} series={series} type='line' height={300} />
      ) : (
        <p className='text-xs text-gray-500'>No RTP trend data available</p>
      )}
    </Card>
  )
}

