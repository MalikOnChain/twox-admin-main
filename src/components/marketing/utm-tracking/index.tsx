'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

import {
  getTotalUTMTracking,
  getUTMCampaigns,
  getUTMTracking,
} from '@/api/utm-tracking'

import UTMRegisteredUsers from '@/components/marketing/utm-tracking/UTMRegisteredUsers'

import { UTMSummaryChart } from './UTMSummaryChart'
import UTMSummaryStats from './UTMSummaryStats'

import {
  GetUTMCampaignsResponse,
  GetUTMTrackingFilter,
  GetUTMTrackingResponse,
  UTMTrackingTotalRow,
} from '@/types/utm-track'

const UTMTrackingDashboard = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [utmTracking, setUtmTracking] = useState<GetUTMTrackingResponse | null>(
    null
  )
  const [filter, setFilter] = useState<GetUTMTrackingFilter>({
    utm_source: 'all',
    utm_campaign: 'all',
    date_from: '',
    date_to: '',
  })
  const [campaigns, setCampaigns] = useState<GetUTMCampaignsResponse>([])
  const utmRegisteredUsersReloadRef = useRef<() => void>(() => {})
  const reloadRef = useRef<() => void>(() => {})
  const [totalUTMTracking, setTotalUTMTracking] = useState<
    UTMTrackingTotalRow[]
  >([])

  const fetchUTMTracking = useCallback(async () => {
    try {
      setIsLoading(true)

      const [summary, campaigns] = await Promise.all([
        getUTMTracking({
          filter,
        }),
        getUTMCampaigns({
          filter,
        }),
      ])

      setUtmTracking(summary)
      setCampaigns(campaigns)
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Error fetching UTM tracking')
      }
    } finally {
      setIsLoading(false)
    }
  }, [filter])

  const fetchTotalUTMTracking = useCallback(async () => {
    try {
      const response = await getTotalUTMTracking()
      setTotalUTMTracking(response.rows)
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Error fetching total UTM tracking')
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUTMTracking()
  }, [filter, fetchUTMTracking])

  useEffect(() => {
    fetchTotalUTMTracking()
  }, [fetchTotalUTMTracking])

  useEffect(() => {
    reloadRef.current = fetchUTMTracking
  }, [fetchUTMTracking, reloadRef])

  return (
    <>
      <div className='col-span-12'>
        <UTMSummaryStats data={totalUTMTracking} />

        <UTMSummaryChart
          isLoading={isLoading}
          utmTracking={utmTracking}
          campaigns={campaigns}
          setFilter={setFilter}
          filter={filter}
        />
        <UTMRegisteredUsers
          filter={filter}
          reloadRef={utmRegisteredUsersReloadRef}
        />
      </div>
    </>
  )
}

export default UTMTrackingDashboard
