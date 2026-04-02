'use client'

import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

import {
  getBonusOverview,
  getBonusTypePerformance,
  getClaimTrend,
  getCostVsNGR,
  getRegionSplit,
  IBonusTypePerformance,
  IClaimTrend,
  ICostVsNGR,
  IRegionSplit,
} from '@/api/bonuses-loyalty'

import ComponentCard from '@/components/common/ComponentCard'
import Loading from '@/components/common/Loading'
import BonusOverviewSummaryCards from './bonus-overview/BonusOverviewSummaryCards'
import BonusOverviewCharts from './bonus-overview/BonusOverviewCharts'
import DateRangeFilter from './bonus-overview/DateRangeFilter'

export default function BonusOverviewPage() {
  const [loading, setLoading] = useState(true)
  const [overview, setOverview] = useState<any>(null)
  const [typePerformance, setTypePerformance] = useState<IBonusTypePerformance[]>([])
  const [claimTrend, setClaimTrend] = useState<IClaimTrend[]>([])
  const [costVsNGR, setCostVsNGR] = useState<ICostVsNGR[]>([])
  const [regionSplit, setRegionSplit] = useState<IRegionSplit[]>([])
  const [days, setDays] = useState(30)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      // Use Promise.allSettled to allow partial success
      const results = await Promise.allSettled([
        getBonusOverview(days),
        getBonusTypePerformance(days),
        getClaimTrend(days),
        getCostVsNGR(days),
        getRegionSplit(days),
      ])

      // Handle overview
      if (results[0].status === 'fulfilled') {
        setOverview(results[0].value.data)
      } else {
        console.error('Error fetching overview:', results[0].reason)
        toast.error('Failed to fetch bonus overview')
      }

      // Handle type performance
      if (results[1].status === 'fulfilled') {
        setTypePerformance(results[1].value.data)
      } else {
        console.error('Error fetching type performance:', results[1].reason)
        toast.error('Failed to fetch type performance data')
      }

      // Handle claim trend
      if (results[2].status === 'fulfilled') {
        setClaimTrend(results[2].value.data)
      } else {
        console.error('Error fetching claim trend:', results[2].reason)
        toast.error('Failed to fetch claim trend data')
      }

      // Handle cost vs NGR
      if (results[3].status === 'fulfilled') {
        setCostVsNGR(results[3].value.data)
      } else {
        console.error('Error fetching cost vs NGR:', results[3].reason)
        toast.error('Failed to fetch cost vs NGR data')
      }

      // Handle region split
      if (results[4].status === 'fulfilled') {
        setRegionSplit(results[4].value.data)
      } else {
        console.error('Error fetching region split:', results[4].reason)
        toast.error('Failed to fetch region split data')
      }
    } catch (error) {
      console.error('Unexpected error:', error)
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Error fetching bonus overview data')
      }
    } finally {
      setLoading(false)
    }
  }, [days])

  useEffect(() => {
    fetchData()
  }, [fetchData])


  if (loading) {
    return <Loading />
  }

  return (
    <div className='space-y-6'>
      <ComponentCard title='Bonus Overview'>
        <DateRangeFilter days={days} onDaysChange={setDays} />
        <BonusOverviewSummaryCards overview={overview} />
        <BonusOverviewCharts
          typePerformance={typePerformance}
          claimTrend={claimTrend}
          costVsNGR={costVsNGR}
          regionSplit={regionSplit}
        />
      </ComponentCard>
    </div>
  )
}

