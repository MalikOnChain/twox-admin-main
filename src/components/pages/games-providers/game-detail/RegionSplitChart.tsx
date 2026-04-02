'use client'

import { useMemo } from 'react'
import { ApexOptions } from 'apexcharts'
import dynamic from 'next/dynamic'
import { IGameDetail } from '@/api/games-providers'
import { Card } from '@/components/ui/card'

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
})

interface RegionSplitChartProps {
  regionSplit: IGameDetail['regionSplit']
}

export default function RegionSplitChart({
  regionSplit,
}: RegionSplitChartProps) {
  const options: ApexOptions = useMemo(
    () => ({
      chart: {
        type: 'bar',
        fontFamily: 'Outfit, sans-serif',
        toolbar: { show: false },
        stacked: true,
      },
      colors: ['#465FFF', '#33FF57', '#FF6B6B'],
      plotOptions: {
        bar: {
          borderRadius: 5,
          horizontal: true,
        },
      },
      xaxis: {
        categories: regionSplit.map((item) => item.region),
      },
      yaxis: {
        title: { text: 'Amount' },
      },
      legend: { position: 'top' },
      dataLabels: { enabled: true },
    }),
    [regionSplit]
  )

  const series = useMemo(
    () => [
      {
        name: 'Bets',
        data: regionSplit.map((item) => item.bets),
      },
      {
        name: 'Wins',
        data: regionSplit.map((item) => item.wins),
      },
      {
        name: 'GGR',
        data: regionSplit.map((item) => item.ggr),
      },
    ],
    [regionSplit]
  )

  return (
    <Card>
      <h4 className='mb-4 text-sm font-medium text-gray-400'>Region Split</h4>
      {regionSplit.length > 0 ? (
        <ReactApexChart options={options} series={series} type='bar' height={400} />
      ) : (
        <p className='text-xs text-gray-500'>No region split data available</p>
      )}
    </Card>
  )
}

