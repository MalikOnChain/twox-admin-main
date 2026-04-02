'use client'
import { ApexOptions } from 'apexcharts'
import dynamic from 'next/dynamic'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

import { getBotStats } from '@/api/user-management'

import Loading from '@/components/common/Loading'

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
})

interface BotStatsData {
  labels: string[]
  bets: number[]
  wagers: number[]
}

export default function BotCharts() {
  const [data, setData] = useState<BotStatsData>({ labels: [], bets: [], wagers: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    const loadData = async () => {
      try {
        setLoading(true)
        const response = await getBotStats()
        if (mounted && response?.data) {
          setData(response.data)
        }
      } catch (error) {
        if (mounted) {
          toast.error(error instanceof Error ? error.message : 'Failed to load bot stats')
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }
    loadData()
    return () => {
      mounted = false
    }
  }, [])

  const betsOptions: ApexOptions = useMemo(
    () => ({
      chart: {
        type: 'line',
        fontFamily: 'Outfit, sans-serif',
        toolbar: { show: false },
      },
      colors: ['#465FFF'],
      stroke: {
        curve: 'smooth',
        width: 2,
      },
      xaxis: {
        categories: data.labels,
      },
      yaxis: {
        title: { text: 'Bets' },
      },
    }),
    [data.labels]
  )

  const betsSeries = useMemo(
    () => [
      {
        name: 'Bets',
        data: data.bets,
      },
    ],
    [data.bets]
  )

  const wagersOptions: ApexOptions = useMemo(
    () => ({
      chart: {
        type: 'line',
        fontFamily: 'Outfit, sans-serif',
        toolbar: { show: false },
      },
      colors: ['#10B981'],
      stroke: {
        curve: 'smooth',
        width: 2,
      },
      xaxis: {
        categories: data.labels,
      },
      yaxis: {
        title: { text: 'Total Wager' },
      },
    }),
    [data.labels]
  )

  const wagersSeries = useMemo(
    () => [
      {
        name: 'Total Wager',
        data: data.wagers,
      },
    ],
    [data.wagers]
  )

  if (loading) {
    return <Loading />
  }

  if (!data.labels.length) {
    return (
      <div className='mt-6 rounded-2xl border border-dashed border-gray-200 p-6 text-center text-gray-500 dark:border-gray-700 dark:text-gray-400'>
        No bot activity recorded for the selected range.
      </div>
    )
  }

  return (
    <div className='mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2'>
      <div>
        <h3 className='mb-4 text-lg font-semibold text-gray-800 dark:text-white/90'>Bets Over Time</h3>
        <ReactApexChart options={betsOptions} series={betsSeries} type='line' height={250} />
      </div>
      <div>
        <h3 className='mb-4 text-lg font-semibold text-gray-800 dark:text-white/90'>
          Total Wager Volume
        </h3>
        <ReactApexChart options={wagersOptions} series={wagersSeries} type='line' height={250} />
      </div>
    </div>
  )
}

