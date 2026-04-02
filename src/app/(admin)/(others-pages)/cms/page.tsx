'use client'

import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { getSiteSettings, updateSiteSettings } from '@/api/site-settings'

import AboutCard from '@/components/cms/AboutCard'
import PrivacyPolicyCard from '@/components/cms/PrivacyPolicyCard'
import TermsConditionCard from '@/components/cms/TermsConditionCard'
import ContentSectionCard from '@/components/cms/ContentSectionCard'
import WinnersFeedCard from '@/components/cms/WinnersFeedCard'
import Loading from '@/components/common/Loading'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { SiteSettings } from '@/types/site-settings'

const CMSPage = () => {
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
      <Tabs defaultValue='terms'>
        <TabsList>
          <TabsTrigger value='terms'>
            <span className='text-lg font-bold text-black dark:text-white'>
              Terms & Conditions Settings
            </span>
          </TabsTrigger>
          <TabsTrigger value='privacy'>
            <span className='text-lg font-bold text-black dark:text-white'>
              Privacy & Policy Settings
            </span>
          </TabsTrigger>
          <TabsTrigger value='about'>
            <span className='text-lg font-bold text-black dark:text-white'>
              About Settings
            </span>
          </TabsTrigger>
          <TabsTrigger value='content-section'>
            <span className='text-lg font-bold text-black dark:text-white'>
              Content Section
            </span>
          </TabsTrigger>
          <TabsTrigger value='winners-feed'>
            <span className='text-lg font-bold text-black dark:text-white'>
              Winners Feed
            </span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value='terms'>
          <TermsConditionCard settings={siteSettings} onSubmit={handleSubmit} />
        </TabsContent>
        <TabsContent value='privacy'>
          <PrivacyPolicyCard settings={siteSettings} onSubmit={handleSubmit} />
        </TabsContent>
        <TabsContent value='about'>
          <AboutCard settings={siteSettings} onSubmit={handleSubmit} />
        </TabsContent>
        <TabsContent value='content-section'>
          <ContentSectionCard />
        </TabsContent>
        <TabsContent value='winners-feed'>
          <WinnersFeedCard />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default CMSPage
