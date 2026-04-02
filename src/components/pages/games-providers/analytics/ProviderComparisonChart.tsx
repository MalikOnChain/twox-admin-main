'use client'

import { useMemo } from 'react'
import { ApexOptions } from 'apexcharts'
import dynamic from 'next/dynamic'
import { IAnalytics } from '@/api/games-providers'
import { Card } from '@/components/ui/card'

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
})

interface ProviderComparisonChartProps {
  providerComparison: IAnalytics['providerComparison']
}

export default function ProviderComparisonChart({
  providerComparison,
}: ProviderComparisonChartProps) {
  const options: ApexOptions = useMemo(
    () => ({
      chart: {
        type: 'bar',
        fontFamily: 'Outfit, sans-serif',
        toolbar: { show: false },
      },
      colors: ['#465FFF', '#33FF57'],
      plotOptions: {
        bar: {
          borderRadius: 5,
        },
      },
      xaxis: {
        categories: providerComparison.map((p) => p.provider),
      },
      yaxis: {
        title: { text: 'Amount' },
      },
      legend: { position: 'top' },
      dataLabels: { enabled: true },
    }),
    [providerComparison]
  )

  const series = useMemo(
    () => [
      {
        name: 'GGR',
        data: providerComparison.map((p) => p.ggr),
      },
      {
        name: 'Total Bets',
        data: providerComparison.map((p) => p.totalBets),
      },
    ],
    [providerComparison]
  )

  return (
    <Card>
      <h4 className='mb-4 text-sm font-medium text-gray-400'>Provider Comparison</h4>
      {providerComparison && providerComparison.length > 0 ? (
        <ReactApexChart
          options={options}
          series={series}
          type='bar'
          height={400}
        />
      ) : (
        <p className='text-xs text-gray-500'>No provider comparison data available</p>
      )}
    </Card>
  )
}

