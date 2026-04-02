'use client'

import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

import { getAnalytics, IAnalytics } from '@/api/games-providers'

import ComponentCard from '@/components/common/ComponentCard'
import Loading from '@/components/common/Loading'
import AnalyticsFilters from './analytics/AnalyticsFilters'
import TopGamesChart from './analytics/TopGamesChart'
import ProviderComparisonChart from './analytics/ProviderComparisonChart'
import RTPDeviationTable from './analytics/RTPDeviationTable'

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true)
  const [analytics, setAnalytics] = useState<IAnalytics | null>(null)
  const [days, setDays] = useState(30)
  const [limit, setLimit] = useState(10)

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true)
      const response = await getAnalytics(days, limit)
      setAnalytics(response.data)
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Error fetching analytics')
      }
    } finally {
      setLoading(false)
    }
  }, [days, limit])

  useEffect(() => {
    fetchAnalytics()
  }, [fetchAnalytics])

  if (loading) {
    return <Loading />
  }

  return (
    <div className='space-y-6'>
      <ComponentCard title='Analytics'>
        <AnalyticsFilters
          days={days}
          limit={limit}
          onDaysChange={setDays}
          onLimitChange={setLimit}
        />
        <div className='mb-6 space-y-6'>
          {analytics && <TopGamesChart topGames={analytics.topGames} />}
          {analytics && <ProviderComparisonChart providerComparison={analytics.providerComparison} />}
        </div>
        {analytics && <RTPDeviationTable rtpDeviation={analytics.rtpDeviation} />}
      </ComponentCard>
    </div>
  )
}

