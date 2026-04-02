'use client'
import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

import { getAnalytics } from '@/api/metrics'

import { formatNumber } from '@/lib/utils'

import Loading from '@/components/common/Loading'

import CountryMap from './CountryMap'
import countryLatLng from '@/lib/country_latlng.json'

import { IAnalytics } from '@/types/metrics'

/**
 * Maps full country names to the shorter names used in country_latlng.json
 */
const normalizeCountryName = (countryName: string): string => {
  // Direct mappings for common variations
  const countryMap: Record<string, string> = {
    'United Kingdom of Great Britain and Northern Ireland': 'United Kingdom',
    'United States of America': 'United States',
    'Netherlands (Kingdom of the)': 'Netherlands',
    'The United States of America': 'United States',
    'The United Kingdom': 'United Kingdom',
    'UK': 'United Kingdom',
    'USA': 'United States',
    'US': 'United States',
  }

  // Check if there's a direct mapping
  if (countryMap[countryName]) {
    return countryMap[countryName]
  }

  // Check if the country name exists exactly in the JSON file
  if (countryLatLng[countryName as keyof typeof countryLatLng]) {
    return countryName
  }

  // Try to find a match by checking if any JSON key is contained in the country name
  // This handles cases like "United Kingdom" in "United Kingdom of Great Britain..."
  // Sort by length (longest first) to match more specific country names first
  const jsonKeys = Object.keys(countryLatLng).sort((a, b) => b.length - a.length)
  
  for (const key of jsonKeys) {
    // Check if the JSON key is contained in the country name (case-insensitive)
    // This handles cases like "United Kingdom" in "United Kingdom of Great Britain..."
    if (countryName.toLowerCase().includes(key.toLowerCase())) {
      return key
    }
    // Also check reverse (for cases where the country name is shorter)
    if (key.toLowerCase().includes(countryName.toLowerCase())) {
      return key
    }
  }

  // Return original if no mapping found
  return countryName
}

const DemographicCard = () => {
  const [analytics, setAnalytics] = useState<IAnalytics[]>(null)
  const [isLoading, setIsLoading] = useState(false)
  const visitorCount = useMemo(() => {
    return analytics?.reduce(
      (acc: number, row: IAnalytics) => acc + Number(row.metricValues[0].value),
      0
    )
  }, [analytics])

  const fetchAnalytics = async () => {
    try {
      const analytics = await getAnalytics()
      setAnalytics(analytics)
      setIsLoading(false)
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Error fetching analytics')
      }
      setIsLoading(false)
    }
  }

  const getPercent = (value: string): number => {
    const total = analytics.reduce(
      (acc: number, row: any) => acc + Number(row.metricValues[0].value),
      0
    )
    return Number((Number(value) / total) * 100)
  }

  useEffect(() => {
    setIsLoading(true)

    fetchAnalytics()
  }, [])

  return (
    <>
      {isLoading && <Loading />}
      {analytics && (
        <div className='rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 dark:border-gray-800 dark:bg-white/[0.03]'>
          <div className='flex justify-between'>
            <div>
              <h3 className='text-lg font-semibold text-gray-800 dark:text-white/90'>
                {`Visitors Demographic (${visitorCount})`}
              </h3>
              <p className='text-theme-sm mt-1 text-gray-500 dark:text-gray-400'>
                Number of visitors based on country
              </p>
            </div>
          </div>
          <div className='grid grid-cols-6 gap-4 2xl:grid-cols-12'>
            <div className='col-span-6 my-6 overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 px-4 py-6 sm:px-6 dark:border-gray-800 dark:bg-gray-900'>
              <div
                id='mapOne'
                className='mapOne map-btn 2xsm:w-[427px] xsm:w-[488px] -mx-4 -my-6 h-[320px] w-[360px] sm:-mx-6 md:w-[798px] lg:w-[764px] xl:w-[523px] 2xl:w-[684px]'
              >
                <CountryMap
                  geoLocations={analytics.map((row) =>
                    normalizeCountryName(row.dimensionValues[0].value)
                  )}
                />
              </div>
            </div>
            <div className='col-span-6 my-6 space-y-5'>
              <div className='max-h-[320px] space-y-5 overflow-y-auto px-4'>
                {analytics.map((row: IAnalytics, i: number) => (
                  <div key={i} className='flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                      <div className='w-full max-w-8 items-center rounded-full'>
                        <Image
                          width={48}
                          height={48}
                          src={`https://flagpedia.net/data/flags/w40/${row.dimensionValues[1].value.toLowerCase()}.png`}
                          alt={row.dimensionValues[0].value}
                          className='w-full'
                        />
                      </div>
                      <div className='flex-1'>
                        <p className='text-theme-sm font-semibold text-gray-800 dark:text-white/90'>
                          {row.dimensionValues[0].value}
                        </p>
                        <span className='text-theme-xs block text-gray-500 dark:text-gray-400'>
                          {formatNumber(Number(row.metricValues[0].value))}{' '}
                          Visitors
                        </span>
                      </div>
                    </div>

                    <div className='flex w-full max-w-[140px] items-center gap-3'>
                      <div className='relative block h-2 w-full max-w-[100px] rounded-sm bg-gray-200 dark:bg-gray-800'>
                        <div
                          className='bg-brand-500 absolute top-0 left-0 flex h-full items-center justify-center rounded-sm text-xs font-medium text-white'
                          style={{
                            width: `${getPercent(row.metricValues[0].value)}%`,
                          }}
                        ></div>
                      </div>
                      <p className='text-theme-sm font-medium text-gray-800 dark:text-white/90'>
                        {getPercent(row.metricValues[0].value).toFixed(2)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
export default DemographicCard
