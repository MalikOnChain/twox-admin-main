'use client'

import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { getSiteSettings, updateSiteSettings } from '@/api/site-settings'

import Loading from '@/components/common/Loading'
import DepositWithdrawSettingsCard from '@/components/site-settings/DepositWithdrawSettingsCard'
import SocialMediaSettingsCard from '@/components/site-settings/SocialMediaSettingsCard'
import XpSettingsCard from '@/components/site-settings/XpSettings'

import { SiteSettings } from '@/types/site-settings'

const SiteSettingsPage = () => {
  const [isLoading, setLoading] = useState(true)
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null)
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

  useEffect(() => {
    const fetchData = async () => {
      await fetchSiteSettings()
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

  if (!siteSettings || isLoading) {
    return <Loading />
  }

  return (
    <div className='grid grid-cols-1 gap-6 xl:grid-cols-1'>
      <SocialMediaSettingsCard
        settings={siteSettings}
        onSubmit={handleSubmit}
      />
      <DepositWithdrawSettingsCard
        settings={siteSettings}
        onSubmit={handleSubmit}
      />
      <XpSettingsCard settings={siteSettings} onSubmit={handleSubmit} />
    </div>
  )
}

export default SiteSettingsPage
