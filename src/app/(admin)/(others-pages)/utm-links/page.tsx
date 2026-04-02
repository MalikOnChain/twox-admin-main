'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

import { getPromotions } from '@/api/promotion'
import { createUtmLink, getUtmLinks, updateUtmLink } from '@/api/utm-link'

import ComponentCard from '@/components/common/ComponentCard'
import Loading from '@/components/common/Loading'
import UTMLinksTable from '@/components/pages/utm-links/UTMLinksTable'
import Button from '@/components/ui/button/Button'
import UTMLinkSettingModal from '@/components/utm-link/UTMLinkSettingModal'

import { PlusIcon } from '@/icons'

import { IPromotionData } from '@/types/promotion'
import { UTMLink } from '@/types/utm-link'

export interface UTMLinkFormData {
  source: string
  campaign: {
    id: string
    name: string
  }
  content: {
    title: string
    description: string
    image: string
    redirectUrl: string
  }
}

const UTMLinkPage = () => {
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [promotions, setPromotions] = useState<IPromotionData[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [page, setPage] = useState<number>(1)
  const [limit] = useState<number>(10)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [utmLinks, setUtmLinks] = useState<UTMLink[]>([])
  const [utmSource, setUtmSource] = useState('all')
  const [editingUtmLink, setEditingUtmLink] = useState<UTMLink | null>(null)

  const handleOpenModal = useCallback(() => {
    setEditingUtmLink(null)
    setOpenModal(true)
  }, [])

  const handleCloseModal = useCallback(() => {
    setEditingUtmLink(null)
    setOpenModal(false)
  }, [])

  const fetchUtmLinks = useCallback(async () => {
    try {
      const response = await getUtmLinks({
        page,
        limit,
        filter: '',
        source: utmSource,
      })
      setTotalPages(response.pagination.totalPages)
      setPage(response.pagination.currentPage)
      setUtmLinks(response.rows)
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Error fetching UTM links')
      }
    }
  }, [page, limit, utmSource])

  const fetchPromotions = useCallback(async () => {
    try {
      const response = await getPromotions({
        page: 1,
        limit: -1,
        filter: '',
      })
      setPromotions(response.rows)
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Error fetching promotions')
      }
    }
  }, [])

  const initialLoading = useCallback(async () => {
    await Promise.all([fetchPromotions(), fetchUtmLinks()])
    setIsLoading(false)
  }, [fetchPromotions, fetchUtmLinks])

  const handleOnSubmit = async (data: UTMLinkFormData) => {
    if (!data.source || !data.campaign.id) {
      toast.error('Please select a source and campaign')
      return false
    }

    if (
      !data.content.title ||
      !data.content.description ||
      !data.content.image
    ) {
      toast.error('Please provide title, description, and image')
      return false
    }

    try {
      // Create the content object for encoding
      const contentObject = {
        title: data.content.title,
        description: data.content.description,
        image: data.content.image,
        redirectUrl: data.content.redirectUrl || '',
      }

      // Encode the content object: JSON → URL encode → Base64 encode
      const jsonString = JSON.stringify(contentObject)
      const urlEncoded = encodeURIComponent(jsonString)
      const base64Encoded = btoa(urlEncoded)

      // Create UTM parameters
      const params = new URLSearchParams({
        utm_source: data.source,
        utm_campaign: data.campaign.name,
        utm_id: data.campaign.id,
        utm_content: data.content.title, // Use title as utm_content for tracking
      })

      // Generate the final URL: https://twox.gg/utm/<encoded-content>?utm_params
      const link = `https://twox.gg/utm/${base64Encoded}?${params.toString()}`

      if (editingUtmLink) {
        // Update existing UTM link
        await updateUtmLink(editingUtmLink._id, {
          link,
          utm_source: data.source,
          utm_campaign: data.campaign.id,
          utm_content: contentObject,
          encoded_content: base64Encoded,
        })
        toast.success('UTM Link updated successfully')
      } else {
        // Create new UTM link
        await createUtmLink({
          link,
          utm_source: data.source,
          utm_campaign: data.campaign.id,
          utm_content: contentObject,
          encoded_content: base64Encoded,
        })
        toast.success('UTM Link created successfully')
      }

      fetchUtmLinks()
      return true
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error(
          editingUtmLink ? 'Error updating UTM link' : 'Error creating UTM link'
        )
      }
      return false
    }
  }

  const handleEdit = useCallback((utmLink: UTMLink) => {
    setEditingUtmLink(utmLink)
    setOpenModal(true)
  }, [])

  useEffect(() => {
    initialLoading()
  }, [initialLoading])

  if (isLoading) {
    return <Loading />
  }

  return (
    <ComponentCard
      title='UTM Links'
      action={
        <Button onClick={handleOpenModal} size='xs'>
          <PlusIcon />
          Generate UTM Link
        </Button>
      }
    >
      <UTMLinkSettingModal
        promotions={promotions}
        isOpen={openModal}
        closeModal={handleCloseModal}
        onSubmit={handleOnSubmit}
        editingUtmLink={editingUtmLink}
      />
      <UTMLinksTable
        utmSource={utmSource}
        setUtmSource={setUtmSource}
        utmLinks={utmLinks}
        totalPages={totalPages}
        page={page}
        setPage={setPage}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        fetchUtmLinks={fetchUtmLinks}
        onEdit={handleEdit}
      />
    </ComponentCard>
  )
}

export default UTMLinkPage
