'use client'
import { ApexOptions } from 'apexcharts'
import dynamic from 'next/dynamic'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

import { getTopGames, ITopGames } from '@/api/metrics'

import { formatNumber } from '@/lib/utils'

import { Skeleton } from '@/components/common/Skeleton'

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
})

interface TopGamesChartProps {
  startDate: string
  endDate: string
  limit?: number
}

export default function TopGamesChart({ startDate, endDate, limit = 10 }: TopGamesChartProps) {
  const [data, setData] = useState<ITopGames | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const result = await getTopGames({ startDate, endDate, limit })
        setData(result)
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message)
        } else {
          toast.error('Error fetching top games data')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [startDate, endDate, limit])

  const options: ApexOptions = useMemo(
    () => ({
      chart: {
        type: 'bar',
        horizontal: true,
        fontFamily: 'Outfit, sans-serif',
        toolbar: {
          show: false,
        },
      },
      colors: ['#465FFF'],
      plotOptions: {
        bar: {
          borderRadius: 5,
          dataLabels: {
            position: 'top',
          },
        },
      },
      dataLabels: {
        enabled: true,
        formatter: (val: number) => `$${formatNumber(val)}`,
        offsetX: 10,
      },
      xaxis: {
        categories: data?.games.map((g) => g.gameName) || [],
        labels: {
          formatter: (val: string) => `$${formatNumber(parseFloat(val))}`,
        },
      },
      yaxis: {
        title: {
          text: 'Games',
        },
      },
      tooltip: {
        y: {
          formatter: (val: number) => `$${formatNumber(val)}`,
        },
      },
    }),
    [data]
  )

  const series = useMemo(() => {
    if (!data) return []
    return [
      {
        name: 'Total Bet Amount',
        data: data.games.map((g) => g.totalBetAmount),
      },
    ]
  }, [data])

  if (loading) {
    return <Skeleton className='h-[400px] rounded-2xl' />
  }

  return (
    <div className='rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/[0.03]'>
      <h3 className='text-lg font-semibold text-gray-800 dark:text-white/90 mb-4'>
        Top Games
      </h3>
      <ReactApexChart options={options} series={series} type='bar' height={400} />
    </div>
  )
}

