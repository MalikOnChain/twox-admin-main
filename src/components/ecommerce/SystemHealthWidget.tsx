'use client'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { getLiveActivity, getSystemHealth, ILiveActivity, ISystemHealth } from '@/api/metrics'

import { formatNumber } from '@/lib/utils'

import { Skeleton } from '@/components/common/Skeleton'
import Badge from '@/components/ui/badge/Badge'

export default function SystemHealthWidget() {
  const router = useRouter()
  const [systemHealth, setSystemHealth] = useState<ISystemHealth['data'] | null>(null)
  const [liveActivity, setLiveActivity] = useState<ILiveActivity['data']>([])
  const [loading, setLoading] = useState(true)
  const [refreshInterval, setRefreshInterval] = useState(10) // seconds

  const fetchSystemHealth = async () => {
    try {
      const result = await getSystemHealth()
      setSystemHealth(result.data)
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Error fetching system health')
      }
    }
  }

  const fetchLiveActivity = async () => {
    try {
      const result = await getLiveActivity({ limit: 20 })
      setLiveActivity(result.data)
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Error fetching live activity')
      }
    }
  }

  const fetchAll = async () => {
    setLoading(true)
    await Promise.all([fetchSystemHealth(), fetchLiveActivity()])
    setLoading(false)
  }

  useEffect(() => {
    fetchAll()

    // Set up auto-refresh
    const interval = setInterval(() => {
      fetchAll()
    }, refreshInterval * 1000)

    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshInterval])

  const getLatencyColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'success'
      case 'warning':
        return 'warning'
      case 'critical':
        return 'error'
      default:
        return 'primary'
    }
  }

  const getProviderStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'success'
      case 'error':
        return 'error'
      case 'inactive':
        return 'warning'
      default:
        return 'primary'
    }
  }

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

  if (loading && !systemHealth) {
    return <Skeleton className='h-[600px] rounded-2xl' />
  }

  return (
    <div className='grid grid-cols-12 gap-4 md:gap-6'>
      {/* System Health Section */}
      <div className='col-span-12 lg:col-span-6'>
        <div className='rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/[0.03]'>
          <div className='mb-4 flex items-center justify-between'>
            <h3 className='text-lg font-semibold text-gray-800 dark:text-white/90'>
              System Health
            </h3>
            <button
              onClick={() => router.push('/system-health-detail')}
              className='text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400'
            >
              View Details →
            </button>
          </div>

          {systemHealth && (
            <div className='space-y-4'>
              {/* API Latency */}
              <div className='rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>API Latency</p>
                    <p className='text-2xl font-bold text-gray-800 dark:text-white/90'>
                      {systemHealth.apiLatency.average} {systemHealth.apiLatency.unit}
                    </p>
                  </div>
                  <Badge color={getLatencyColor(systemHealth.apiLatency.status)}>
                    {systemHealth.apiLatency.status}
                  </Badge>
                </div>
              </div>

              {/* Provider Status */}
              <div>
                <p className='mb-2 text-sm font-medium text-gray-700 dark:text-gray-300'>
                  Provider Status
                </p>
                <div className='space-y-2'>
                  {systemHealth.providers.slice(0, 5).map((provider) => (
                    <div
                      key={provider.provider}
                      className='flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800/50'
                    >
                      <div className='flex-1'>
                        <p className='text-sm font-medium text-gray-800 dark:text-white/90'>
                          {provider.provider}
                        </p>
                        {provider.errorCount > 0 && (
                          <p className='text-xs text-gray-500 dark:text-gray-400'>
                            {provider.errorCount} errors
                          </p>
                        )}
                      </div>
                      <Badge color={getProviderStatusColor(provider.status)} size='sm'>
                        {provider.status}
                      </Badge>
                    </div>
                  ))}
                </div>
                {systemHealth.totalErrors > 0 && (
                  <p className='mt-2 text-sm text-red-600 dark:text-red-400'>
                    Total Errors: {systemHealth.totalErrors}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Live Activity Section */}
      <div className='col-span-12 lg:col-span-6'>
        <div className='rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/[0.03]'>
          <div className='mb-4 flex items-center justify-between'>
            <h3 className='text-lg font-semibold text-gray-800 dark:text-white/90'>
              Live Activity
            </h3>
            <div className='flex items-center gap-2'>
              <select
                value={refreshInterval}
                onChange={(e) => setRefreshInterval(Number(e.target.value))}
                className='rounded-md border border-gray-300 bg-white px-2 py-1 text-xs text-white dark:border-gray-600 dark:bg-gray-800'
              >
                <option value={5}>5s</option>
                <option value={10}>10s</option>
                <option value={15}>15s</option>
                <option value={30}>30s</option>
              </select>
              <button
                onClick={() => router.push('/live-activity-detail')}
                className='text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400'
              >
                View Details →
              </button>
            </div>
          </div>

          <div className='max-h-[500px] space-y-2 overflow-y-auto'>
            {liveActivity.length === 0 ? (
              <p className='py-8 text-center text-gray-500 dark:text-gray-400'>
                No recent activity
              </p>
            ) : (
              liveActivity.map((activity) => (
                <div
                  key={`${activity.type}-${activity.id}`}
                  onClick={() => handleActivityClick(activity)}
                  className='cursor-pointer rounded-lg border border-gray-200 bg-gray-50 p-3 transition-all hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800/50 dark:hover:bg-gray-800'
                >
                  <div className='flex items-center gap-3'>
                    <span className='text-xl'>{getActivityIcon(activity.type)}</span>
                    <div className='flex-1'>
                      <div className='flex items-center gap-2'>
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
                        <p className='text-xs text-gray-500 dark:text-gray-400'>
                          {activity.gameName}
                        </p>
                      )}
                      <p className='text-sm font-semibold text-gray-700 dark:text-gray-300'>
                        ${formatNumber(activity.amount)}
                      </p>
                    </div>
                    <p className='text-xs text-gray-500 dark:text-gray-400'>
                      {moment(activity.timestamp).fromNow()}
                    </p>
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

