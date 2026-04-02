'use client'

import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

import {
  getFeeAnalyticsSummary,
  getFeeBreakdown,
  getFeesByCurrency,
  getFeesByMethod,
  getFeesVsVolume,
  getThresholdAlerts,
} from '@/api/fee-analytics'

import ComponentCard from '@/components/common/ComponentCard'
import Loading from '@/components/common/Loading'

import FeeSummaryCards from './fee-analytics/FeeSummaryCards'
import FeeCharts from './fee-analytics/FeeCharts'
import FeeBreakdownTable from './fee-analytics/FeeBreakdownTable'
import ThresholdAlerts from './fee-analytics/ThresholdAlerts'

export default function FeeAnalyticsPage() {
  const [loading, setLoading] = useState(true)
  const [summary, setSummary] = useState<any>(null)
  const [feesByMethod, setFeesByMethod] = useState<any>(null)
  const [feesByCurrency, setFeesByCurrency] = useState<any>(null)
  const [feesVsVolume, setFeesVsVolume] = useState<any>(null)
  const [breakdown, setBreakdown] = useState<any[]>([])
  const [alerts, setAlerts] = useState<any[]>([])

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const [summaryData, methodData, currencyData, vsVolumeData, breakdownData, alertsData] =
        await Promise.all([
          getFeeAnalyticsSummary(),
          getFeesByMethod(),
          getFeesByCurrency(),
          getFeesVsVolume(undefined, undefined, 30),
          getFeeBreakdown(),
          getThresholdAlerts(1000),
        ])
      setSummary(summaryData.data)
      setFeesByMethod(methodData.data)
      setFeesByCurrency(currencyData.data)
      setFeesVsVolume(vsVolumeData.data)
      setBreakdown(breakdownData.data)
      setAlerts(alertsData.data)
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Error fetching fee analytics data')
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])


  if (loading) {
    return <Loading />
  }

  return (
    <div className='space-y-6'>
      <ComponentCard title='Fee Analytics'>
        {/* Cards */}
        <FeeSummaryCards summary={summary} />

        {/* Charts */}
        <FeeCharts
          feesByMethod={feesByMethod}
          feesByCurrency={feesByCurrency}
          feesVsVolume={feesVsVolume}
        />

        {/* Table */}
        <FeeBreakdownTable breakdown={breakdown} />

        {/* Alerts */}
        <ThresholdAlerts alerts={alerts} />
      </ComponentCard>
    </div>
  )
}

