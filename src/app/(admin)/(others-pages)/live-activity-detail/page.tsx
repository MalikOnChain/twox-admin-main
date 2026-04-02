'use client'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { getLiveActivity, ILiveActivity } from '@/api/metrics'

import { formatNumber } from '@/lib/utils'

import { Skeleton } from '@/components/common/Skeleton'
import Badge from '@/components/ui/badge/Badge'

export default function LiveActivityDetailPage() {
  const router = useRouter()
  const [liveActivity, setLiveActivity] = useState<ILiveActivity['data']>([])
  const [loading, setLoading] = useState(true)
  const [refreshInterval, setRefreshInterval] = useState(10) // seconds

  const fetchLiveActivity = async () => {
    try {
      const result = await getLiveActivity({ limit: 100 })
      setLiveActivity(result.data)
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Error fetching live activity')
      }
    }
  }

  useEffect(() => {
    fetchLiveActivity()
    setLoading(false)

    // Set up auto-refresh
    const interval = setInterval(() => {
      fetchLiveActivity()
    }, refreshInterval * 1000)

    return () => clearInterval(interval)
  }, [refreshInterval])

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'bet':
        return '🎲'
      case 'deposit':
        return '💰'
      case 'win':
        return '🎉'
      default:
        return '📊'
    }
  }

  const handleActivityClick = (activity: ILiveActivity['data'][0]) => {
    if (activity.type === 'bet' || activity.type === 'win') {
      router.push(`/game-providers/blueocean/${activity.gameId}`)
    } else if (activity.type === 'deposit') {
      router.push(`/transactions/deposit`)
    }
  }

  if (loading) {
    return <Skeleton className='h-[600px] rounded-2xl' />
  }

  return (
    <div className='grid grid-cols-12 gap-4 md:gap-6'>
      <div className='col-span-12'>
        <div className='rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/[0.03]'>
          <div className='mb-4 flex items-center justify-between'>
            <h2 className='text-xl font-semibold text-gray-800 dark:text-white/90'>
              Live Activity Detail
            </h2>
            <div className='flex items-center gap-2'>
              <label className='text-sm text-gray-500 dark:text-gray-400'>Refresh:</label>
              <select
                value={refreshInterval}
                onChange={(e) => setRefreshInterval(Number(e.target.value))}
                className='rounded-md border border-gray-300 bg-white px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-800'
              >
                <option value={5}>5s</option>
                <option value={10}>10s</option>
                <option value={15}>15s</option>
                <option value={30}>30s</option>
              </select>
            </div>
          </div>

          <div className='max-h-[800px] space-y-2 overflow-y-auto'>
            {liveActivity.length === 0 ? (
              <p className='py-8 text-center text-gray-500 dark:text-gray-400'>
                No recent activity
              </p>
            ) : (
              liveActivity.map((activity) => (
                <div
                  key={`${activity.type}-${activity.id}`}
                  onClick={() => handleActivityClick(activity)}
                  className='cursor-pointer rounded-lg border border-gray-200 bg-gray-50 p-4 transition-all hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800/50 dark:hover:bg-gray-800'
                >
                  <div className='flex items-center gap-4'>
                    <span className='text-2xl'>{getActivityIcon(activity.type)}</span>
                    <div className='flex-1'>
                      <div className='flex items-center gap-2 mb-1'>
                        <p className='text-sm font-medium text-gray-800 dark:text-white/90'>
                          {activity.username}
                        </p>
                        <Badge
                          color={
                            activity.type === 'win'
                              ? 'success'
                              : activity.type === 'deposit'
                                ? 'info'
                                : 'primary'
                          }
                          size='sm'
                        >
                          {activity.type}
                        </Badge>
                      </div>
                      {activity.gameName && (
                        <p className='text-sm text-gray-600 dark:text-gray-400 mb-1'>
                          Game: {activity.gameName}
                        </p>
                      )}
                      <p className='text-lg font-semibold text-gray-900 dark:text-white'>
                        ${formatNumber(activity.amount)}
                      </p>
                    </div>
                    <div className='text-right'>
                      <p className='text-sm text-gray-500 dark:text-gray-400'>
                        {moment(activity.timestamp).format('MMM DD, YYYY')}
                      </p>
                      <p className='text-xs text-gray-500 dark:text-gray-400'>
                        {moment(activity.timestamp).format('HH:mm:ss')}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

