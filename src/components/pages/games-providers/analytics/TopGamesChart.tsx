'use client'

import { useMemo } from 'react'
import { ApexOptions } from 'apexcharts'
import dynamic from 'next/dynamic'
import { IAnalytics } from '@/api/games-providers'
import { formatNumber } from '@/lib/utils'
import { Card } from '@/components/ui/card'

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
})

interface TopGamesChartProps {
  topGames: IAnalytics['topGames']
}

export default function TopGamesChart({ topGames }: TopGamesChartProps) {
  const topGamesCategories = useMemo(
    () => {
      if (!topGames || topGames.length === 0) return []
      return [...topGames].reverse().map((game) => game.name)
    },
    [topGames]
  )

  const topGamesSeries = useMemo(
    () => {
      if (!topGames || topGames.length === 0) return []
      const sortedGames = [...topGames].reverse()
      return [
        {
          name: 'GGR',
          data: sortedGames.map((game) => game.ggr),
        },
      ]
    },
    [topGames]
  )

  const options: ApexOptions = useMemo(
    () => ({
      chart: {
        type: 'bar',
        fontFamily: 'Outfit, sans-serif',
        toolbar: { show: false },
        horizontal: true,
      },
      colors: ['#465FFF'],
      plotOptions: {
        bar: {
          borderRadius: 5,
          horizontal: true,
        },
      },
      xaxis: {
        categories: topGamesCategories,
      },
      yaxis: {
        title: { text: 'GGR (R$)' },
      },
      dataLabels: { enabled: true },
      tooltip: {
        y: {
          formatter: (val: number) => `R$ ${formatNumber(val)}`,
        },
      },
    }),
    [topGamesCategories]
  )

  return (
    <Card>
      <h4 className='mb-4 text-sm font-medium text-gray-400'>Top Games (H-Bar)</h4>
      {topGames && topGames.length > 0 ? (
        <ReactApexChart
          options={options}
          series={topGamesSeries}
          type='bar'
          height={400}
        />
      ) : (
        <p className='text-xs text-gray-500'>No top games data available</p>
      )}
    </Card>
  )
}

