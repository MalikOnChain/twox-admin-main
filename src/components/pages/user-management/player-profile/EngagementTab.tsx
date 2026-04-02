'use client'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

import { getEngagementData, IEngagementData } from '@/api/user-management'

import Loading from '@/components/common/Loading'

import EngagementCards from '../engagement/EngagementCards'
import SessionDistributionChart from '../engagement/SessionDistributionChart'
import SessionTrendChart from '../engagement/SessionTrendChart'
import TimeByGameChart from '../engagement/TimeByGameChart'

interface EngagementTabProps {
  userId: string
}

export default function EngagementTab({ userId }: EngagementTabProps) {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<IEngagementData['data'] | null>(null)
  const [days, setDays] = useState(30)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const response = await getEngagementData(userId, days)
      setData(response.data)
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Error fetching engagement data')
      }
    } finally {
      setLoading(false)
    }
  }, [userId, days])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  if (loading) {
    return <Loading />
  }

  if (!data) {
    return (
      <div className='rounded-lg border border-gray-200 p-4 dark:border-gray-700'>
        <p className='text-sm text-gray-500 dark:text-gray-400'>No engagement data found</p>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h3 className='text-lg font-semibold text-gray-800 dark:text-white/90'>
          Engagement & Play-Time
        </h3>
        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className='w-32 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
        >
          <option value={7}>Last 7 Days</option>
          <option value={14}>Last 14 Days</option>
          <option value={30}>Last 30 Days</option>
          <option value={60}>Last 60 Days</option>
          <option value={90}>Last 90 Days</option>
        </select>
      </div>

      {/* Cards */}
      <EngagementCards cards={data.cards} />

      {/* Charts */}
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
        <SessionTrendChart data={data.charts.sessionLengthTrend} />
        <SessionDistributionChart data={data.charts.distribution} />
      </div>

      <TimeByGameChart data={data.charts.timeByGame} />
    </div>
  )
}

