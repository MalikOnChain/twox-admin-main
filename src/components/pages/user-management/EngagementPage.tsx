'use client'
import { useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

import {
  getEngagementData,
  getEngagementUsersList,
  IEngagementData,
} from '@/api/user-management'

import Loading from '@/components/common/Loading'
import Button from '@/components/ui/button/Button'

import EngagementCards from './engagement/EngagementCards'
import EngagementUsersTable from './engagement/EngagementUsersTable'
import SessionDistributionChart from './engagement/SessionDistributionChart'
import SessionTrendChart from './engagement/SessionTrendChart'
import TimeByGameChart from './engagement/TimeByGameChart'

export default function EngagementPage() {
  const searchParams = useSearchParams()
  const userId = searchParams.get('userId') || ''
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<IEngagementData['data'] | null>(null)
  const [usersData, setUsersData] = useState<any>(null)
  const [usersPage, setUsersPage] = useState(1)
  const [days, setDays] = useState(30)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      if (userId) {
        // Fetch data for specific user
        const response = await getEngagementData(userId, days)
        setData(response.data)
        setUsersData(null)
      } else {
        // Fetch aggregated data for all users
        const response = await getEngagementData(undefined, days)
        setData(response.data)
        
        // Fetch users list for table
        const usersResponse = await getEngagementUsersList(usersPage, 20, days)
        setUsersData(usersResponse)
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Error fetching engagement data')
      }
    } finally {
      setLoading(false)
    }
  }, [userId, days, usersPage])

  // Reset users page when userId changes
  useEffect(() => {
    if (!userId) {
      setUsersPage(1)
    }
  }, [userId])

  useEffect(() => {
    fetchData()
  }, [fetchData])


  if (loading) {
    return <Loading />
  }

  if (!data) {
    return (
      <div className='rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/[0.03]'>
        <p className='text-gray-500 dark:text-gray-400'>No engagement data found</p>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      <div className='rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/[0.03]'>
        <div className='mb-4 flex items-center justify-between'>
          <h2 className='text-xl font-semibold text-gray-800 dark:text-white/90'>
            Engagement & Play-Time{userId ? ` - User: ${userId}` : ' - All Users'}
          </h2>
          <div className='flex gap-2'>
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
            <Button
              size='sm'
              variant='outline'
              onClick={() => toast.info('Flag for reactivation functionality to be implemented')}
            >
              Flag for Reactivation
            </Button>
            <Button
              size='sm'
              variant='outline'
              onClick={() => toast.info('Export functionality to be implemented')}
            >
              Export
            </Button>
          </div>
        </div>

        {/* Cards */}
        <EngagementCards cards={data.cards} />

        {/* Charts */}
        <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
          <SessionTrendChart data={data.charts.sessionLengthTrend} />
          <SessionDistributionChart data={data.charts.distribution} />
        </div>

        <TimeByGameChart data={data.charts.timeByGame} />

        {/* Users Table - Only show when no userId is specified */}
        {!userId && usersData && (
          <EngagementUsersTable
            users={usersData.data}
            currentPage={usersData.pagination.currentPage}
            totalPages={usersData.pagination.totalPages}
            onPageChange={setUsersPage}
          />
        )}
      </div>
    </div>
  )
}
