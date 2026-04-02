'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

import { getConversionRates } from '@/api/metrics'

import Loading from '@/components/common/Loading'
import MetricsCard from '@/components/metrics/MetricsCard'

import { IConversionRates } from '@/types/metrics'

const ConversionRate = () => {
  const [conversionRates, setConversionRates] = useState<IConversionRates>(null)
  const [isLoading, setIsLoading] = useState(false)

  const fetchConversionRates = useCallback(async () => {
    try {
      const data = await getConversionRates()
      setConversionRates(data)
      setIsLoading(false)
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Error fetching conversion rates')
      }
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchConversionRates()
  }, [fetchConversionRates])

  if (isLoading || !conversionRates) return <Loading />

  return (
    <div className='space-y-6'>
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 xl:grid-cols-6'>
        <MetricsCard
          title='Registration Conversion Rate'
          value={`${conversionRates.registrationConversionRate}%`}
          tooltipText='The percentage of users who have registered for the first time'
        />
      </div>
    </div>
  )
}

export default ConversionRate
