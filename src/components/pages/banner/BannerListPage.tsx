'use client'

import React, { useCallback, useState } from 'react'
import { toast } from 'sonner'

import { createBanner, getBanners, updateBanner } from '@/api/banner'

import { BannerFormValues, sectionOptions } from '@/lib/banner'
import { useModal } from '@/hooks/useModal'

import ComponentCard from '@/components/common/ComponentCard'
import Select from '@/components/form/Select'
import BannerDetailModal from '@/components/pages/banner/BannerDetailModal'
import BannerTable from '@/components/pages/banner/BannerTable'
import Button from '@/components/ui/button/Button'

import { PlusIcon } from '@/icons'

import { IBannerData } from '@/types/banner'

export default function BannerListPage() {
  const [bannerData, setBannerData] = useState<IBannerData[]>([])
  const [page, setPage] = useState<number>(1)
  const [limit] = useState<number>(10)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [selectedBanner, setSelectedBanner] = useState<IBannerData>(null)
  const CreateBannerModal = useModal()

  const handleEdit = (tier: IBannerData) => {
    setSelectedBanner(tier)
    CreateBannerModal.openModal()
  }

  const fetchBanners = useCallback(
    async (section?: string) => {
      try {
        setIsLoading(true)
        const response = await getBanners({
          page,
          limit,
          filter: '',
          ...(section !== 'all' && { section }),
        })

        if (response.success) {
          setBannerData(response.rows)
          setTotalPages(response.pagination.totalPages)
          setPage(response.pagination.currentPage)
        }
      } catch (error) {
        console.error('Error fetching promotions:', error)
      } finally {
        setIsLoading(false)
      }
    },
    [page, limit]
  )

  const handleOnSubmit = async (data: BannerFormValues) => {
    if (selectedBanner && data.image === '') {
      toast.error('Please upload promotion icon')
      return false
    }
    try {
      if (selectedBanner) {
        const res = await updateBanner(selectedBanner._id, data as IBannerData)
        if (res.success) {
          toast.success('Promotion updated successfully')
        } else {
          toast.error(res.message)
        }
      } else {
        const res = await createBanner(data as IBannerData)
        if (res.success) {
          toast.success('Promotion created successfully')
        } else {
          toast.error(res.message)
        }
      }
      fetchBanners()
      return true
    } catch (error) {
      console.error('Error updating promotion detail:', error)
      return false
    }
  }

  const handleModalClose = () => {
    CreateBannerModal.closeModal()
    if (selectedBanner) {
      setSelectedBanner(null)
    }
  }

  return (
    <div>
      <div className='space-y-6'>
        <ComponentCard
          title='Banners'
          inputSearchElement={
            <Select
              options={[{ value: 'all', label: 'all' }, ...sectionOptions]}
              placeholder='Select section'
              onChange={fetchBanners}
            />
          }
          action={
            <Button onClick={CreateBannerModal.openModal} size='xs'>
              <PlusIcon />
              Add Banner
            </Button>
          }
        >
          <BannerTable
            bannerData={bannerData}
            totalPages={totalPages}
            page={page}
            setPage={setPage}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            fetchBanners={fetchBanners}
            onEdit={handleEdit}
          />
          <BannerDetailModal
            isOpen={CreateBannerModal.isOpen}
            closeModal={handleModalClose}
            detail={selectedBanner}
            onSubmit={handleOnSubmit}
          />
        </ComponentCard>
      </div>
    </div>
  )
}
