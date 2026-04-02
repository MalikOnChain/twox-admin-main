'use client'

import React, { useCallback, useState } from 'react'
import { toast } from 'sonner'

import {
  createPromotion,
  getPromotions,
  updatePromotion,
} from '@/api/promotion'

import { PromotionFormValues } from '@/lib/promotion'
import { useModal } from '@/hooks/useModal'

import ComponentCard from '@/components/common/ComponentCard'
import PromotionDetailModal from '@/components/pages/promotion/promotionDetailModal'
import PromotionList from '@/components/pages/promotion/PromotionList'
import Button from '@/components/ui/button/Button'

import { PlusIcon } from '@/icons'

import { IPromotionData } from '@/types/promotion'

export default function PromotionListPage() {
  const [promotionData, setPromotionData] = useState<IPromotionData[]>([])
  const [page, setPage] = useState<number>(1)
  const [limit] = useState<number>(10)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [selectedPromotion, setSelectedPromotion] =
    useState<IPromotionData>(null)
  const CreatePromotionModal = useModal()

  const fetchPromotions = useCallback(
    async (filter?: string) => {
      try {
        setIsLoading(true)
        const response = await getPromotions({
          page,
          limit,
          filter: filter || '',
        })
        if (response.success) {
          setPromotionData(response.rows)
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

  const handleOnSubmit = async (data: PromotionFormValues) => {
    if (selectedPromotion && data.image === '') {
      toast.error('Please upload promotion icon')
      return false
    }
    try {
      if (selectedPromotion) {
        const res = await updatePromotion(
          selectedPromotion._id,
          data as IPromotionData
        )
        if (res.success) {
          toast.success('Promotion updated successfully')
        } else {
          toast.error(res.message)
        }
      } else {
        const res = await createPromotion(data as IPromotionData)
        if (res.success) {
          toast.success('Promotion created successfully')
        } else {
          toast.error(res.message)
        }
      }
      fetchPromotions()
      return true
    } catch (error) {
      console.error('Error updating promotion detail:', error)
      return false
    }
  }

  const handleModalClose = () => {
    CreatePromotionModal.closeModal()
    if (selectedPromotion) {
      setSelectedPromotion(null)
    }
  }

  return (
    <div>
      <div className='space-y-6'>
        <ComponentCard
          title='Promotions'
          action={
            <Button onClick={CreatePromotionModal.openModal} size='xs'>
              <PlusIcon />
              Add Promotion
            </Button>
          }
        >
          <PromotionList
            promotionData={promotionData}
            totalPages={totalPages}
            page={page}
            setPage={setPage}
            isLoading={isLoading}
            fetchPromotions={fetchPromotions}
          />
          <PromotionDetailModal
            isOpen={CreatePromotionModal.isOpen}
            closeModal={handleModalClose}
            detail={selectedPromotion}
            onSubmit={handleOnSubmit}
          />
        </ComponentCard>
      </div>
    </div>
  )
}
