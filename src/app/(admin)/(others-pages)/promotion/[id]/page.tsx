'use client'

import Image from 'next/image'
import { useParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

import {
  deletePromotion,
  getPromotionDetail,
  updatePromotion,
} from '@/api/promotion'

import { PromotionFormValues } from '@/lib/promotion'
import { useModal } from '@/hooks/useModal'

import ComponentCard from '@/components/common/ComponentCard'
import ConfirmModal from '@/components/common/ConfirmModal'
import PromotionDetailModal from '@/components/pages/promotion/promotionDetailModal'
import Button from '@/components/ui/button/Button'

import { PencilIcon, TrashBinIcon } from '@/icons'

import { IPromotionData } from '@/types/promotion'

export default function PromotionDetailPage() {
  const { id } = useParams()
  const router = useRouter()

  const [promotionDetailData, setPromotionDetailData] =
    useState<IPromotionData>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [openConfirm, setOpenConfirm] = useState<boolean>(false)
  const handleClose = useCallback(() => setOpenConfirm(false), [])
  const CreatePromotionModal = useModal()

  const handleDelete = async () => {
    if (isLoading || !id) return
    try {
      setIsLoading(true)
      const res = await deletePromotion(id as string)
      if (res.success) {
        toast.success('Promotion deleted successfully')
        router.push('/promotion')
      }
    } catch (error) {
      console.error('Error deleting promotion:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchPromotionDetail = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await getPromotionDetail(id as string)
      if (response.success) {
        setPromotionDetailData(response.promotion)
      }
    } catch (error) {
      console.error('Error fetching promotions:', error)
    } finally {
      setIsLoading(false)
    }
  }, [id])

  const handleOnSubmit = async (data: PromotionFormValues) => {
    if (promotionDetailData && data.image === '') {
      toast.error('Please upload promotion image')
      return false
    }
    try {
      const res = await updatePromotion(
        promotionDetailData._id,
        data as IPromotionData
      )
      if (res.success) {
        toast.success('Promotion updated successfully')
      } else {
        toast.error(res.message)
      }

      fetchPromotionDetail()
      return true
    } catch (error) {
      console.error('Error updating promotion detail:', error)
      return false
    }
  }

  const handleModalClose = () => {
    CreatePromotionModal.closeModal()
  }

  useEffect(() => {
    fetchPromotionDetail()
  }, [fetchPromotionDetail])

  if (!promotionDetailData) return

  return (
    <div>
      <div className='space-y-6'>
        <ComponentCard
          title='Promotion Detail'
          backUrl='/promotion'
          action={
            <>
              <Button onClick={CreatePromotionModal.openModal} size='xs'>
                <PencilIcon />
                Edit
              </Button>
              <Button
                onClick={() => setOpenConfirm(true)}
                size='xs'
                className='bg-warning-600'
              >
                <TrashBinIcon />
                Delete
              </Button>
            </>
          }
        >
          <div className='flex flex-col items-center'>
            <div className='w-full max-w-[1000px]'>
              <div className='flex h-64 justify-center'>
                <Image
                  src={promotionDetailData?.image}
                  alt={
                    promotionDetailData?.name
                      ? promotionDetailData?.name
                      : 'alternative text for promotion'
                  }
                  width={0}
                  height={0}
                  sizes='100vw'
                  className='mb-6 h-full w-auto rounded-xl object-cover'
                />
              </div>
              <h2 className='mb-8 text-4xl text-black dark:text-white'>
                {promotionDetailData?.name}
              </h2>
              <p
                className='text-black dark:text-white'
                dangerouslySetInnerHTML={{
                  __html: promotionDetailData?.description || '',
                }}
              ></p>
            </div>
          </div>
        </ComponentCard>
        <PromotionDetailModal
          isOpen={CreatePromotionModal.isOpen}
          closeModal={handleModalClose}
          detail={promotionDetailData}
          onSubmit={handleOnSubmit}
        />
        <ConfirmModal
          open={openConfirm}
          title='Are you Sure?'
          description='You can not restore deleted record.'
          handleConfirm={() => {
            handleDelete()
          }}
          handleClose={handleClose}
        />
      </div>
    </div>
  )
}
