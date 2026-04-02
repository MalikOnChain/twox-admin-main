'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import {
  getCountries,
  getSiteSettings,
  updateSiteSettings,
} from '@/api/site-settings'

import Loading from '@/components/common/Loading'
import ClientGeoIPCard from '@/components/site-settings/ClientGeoIPCard'
import GEOIPSettingsCard from '@/components/site-settings/GEOIPSettingsCard'

import { CountryProps, SiteSettings } from '@/types/site-settings'

const IPPage = () => {
  const [isLoading, setLoading] = useState(true)
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null)
  const [countries, setCountries] = useState<CountryProps[] | null>(null)
  const fetchSiteSettings = async () => {
    try {
      const settings = await getSiteSettings()
      setSiteSettings(settings)
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || 'An error occurred')
      } else {
        toast.error('An error occurred')
      }
    }
    setLoading(false)
  }

  const fetchCountries = async () => {
    try {
      const countryList = await getCountries()
      setCountries(countryList)
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || 'An error occurred')
      } else {
        toast.error('An error occurred')
      }
    }
    setLoading(false)
  }

  useEffect(() => {
    const fetchData = async () => {
      await fetchSiteSettings()
      await fetchCountries()
    }
    fetchData()
  }, [])

  if (isLoading) {
    return <Loading />
  }

  const handleSubmit = async (data: any) => {
    try {
      await updateSiteSettings(data)
      setSiteSettings((prev) => ({ ...prev, ...data }))
      toast.success('Settings updated successfully')
      fetchSiteSettings()
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || 'Failed to update settings')
      } else {
        toast.error('Failed to update settings')
      }
    }
  }

  if (!siteSettings || !countries || isLoading) {
    return <Loading />
  }
  return (
    <div className='grid grid-cols-1 gap-6 xl:grid-cols-1'>
      <GEOIPSettingsCard
        countries={countries}
        settings={siteSettings}
        onSubmit={handleSubmit}
      />
      <ClientGeoIPCard />
    </div>
  )
}

export default IPPage
