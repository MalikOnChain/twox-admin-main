'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { uploadPromotionImage } from '@/api/promotion'

import { promotionFormSchema, PromotionFormValues } from '@/lib/promotion'

import LoadingSpinner from '@/components/common/LoadingSpinner'
import Button from '@/components/ui/button/Button'
import { Modal } from '@/components/ui/modal'

import PromotionFormFields from './PromotionFormFields'
import PromotionImageUpload from './PromotionImageUpload'
import { PromotionDetailModalProps } from './types'

import { IMAGE_UPLOAD_STATUS, IPromotionData } from '@/types/promotion'

const PromotionDetailModal = ({
  isOpen,
  closeModal,
  detail,
  onSubmit,
}: PromotionDetailModalProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const promotionImageRef = useRef<HTMLInputElement>(null)
  const [image, setImageUrl] = useState<string | null>(null)
  const [detailInfo, setDetailInfo] = useState<IPromotionData | null>(null)
  const [fileToUpload, setFileToUpload] = useState<File | null>(null)

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
  } = useForm<PromotionFormValues>({
    resolver: zodResolver(promotionFormSchema),
    defaultValues: {
      name: '',
      summary: '',
      description: '',
      image: '',
      badge: '',
      colorTheme: undefined,
      highlightText: '',
      buttons: [],
      isPublic: true,
      bonusId: '',
    },
  })

  useEffect(() => {
    if (isOpen) {
      setDetailInfo(detail)
      if (detail) {
        const formData = {
          name: detail.name || '',
          summary: detail.summary || '',
          description: detail.description || '',
          image: detail.image || '',
          badge: detail.badge || '',
          colorTheme: detail.colorTheme,
          highlightText: detail.highlightText || '',
          buttons: detail.buttons || [],
          isPublic: detail.isPublic ?? true,
          bonusId: detail.bonusId || '',
        }
        reset(formData)
        setImageUrl(detail.image || null)
      } else {
        const defaultData = {
          name: '',
          summary: '',
          description: '',
          image: '',
          badge: '',
          colorTheme: undefined,
          highlightText: '',
          buttons: [],
          isPublic: true,
          bonusId: '',
        }
        reset(defaultData)
        setImageUrl(null)
        setFileToUpload(null)
      }
    }
  }, [detail, isOpen, reset])

  const updateImage = async () => {
    const updatedData = { ...getValues() }

    try {
      if (!updatedData.image && !fileToUpload) {
        return {
          status: IMAGE_UPLOAD_STATUS.SELECT_PROMOTION_IMAGE,
          data: null,
        }
      }

      if (fileToUpload) {
        const formData = new FormData()
        formData.append('file', fileToUpload)
        const result = await uploadPromotionImage(formData)
        updatedData.image = result.url
      }

      return {
        status: IMAGE_UPLOAD_STATUS.IMAGE_UPLOAD_SUCCESS,
        data: updatedData,
      }
    } catch (error) {
      console.error('Error updating promotion image:', error)
      return {
        status:
          error instanceof Error
            ? error.message
            : IMAGE_UPLOAD_STATUS.IMAGE_UPLOAD_FAILED,
        data: null,
      }
    }
  }

  const handleOnSubmit = async () => {
    setIsLoading(true)

    try {
      const formData = getValues()

      // Validate required fields
      if (!formData.description?.trim()) {
        toast.error('Description is required')
        return
      }

      if (!formData.name?.trim()) {
        toast.error('Name is required')
        return
      }

      if (!formData.summary?.trim()) {
        toast.error('Summary is required')
        return
      }

      // Handle image upload
      const { status, data: updatedData } = await updateImage()

      switch (status) {
        case IMAGE_UPLOAD_STATUS.IMAGE_UPLOAD_SUCCESS:
          if (updatedData) {
            // Merge processed data with updated image
            const finalData = { ...formData, image: updatedData.image }

            const isSuccess = await onSubmit(finalData)
            if (isSuccess) {
              handleClose()
            }
          }
          break
        case IMAGE_UPLOAD_STATUS.IMAGE_UPLOAD_FAILED:
          toast.error('Failed to upload image')
          break
        case IMAGE_UPLOAD_STATUS.SELECT_PROMOTION_IMAGE:
          toast.error('Please select an image')
          break
        case IMAGE_UPLOAD_STATUS.PROMOTION_IMAGE_UPLOAD_FAILED:
          toast.error('Failed to upload promotion image')
          break
        default:
          toast.error('Image upload failed')
          break
      }
    } catch (error) {
      console.error('Error submitting promotion:', error)
      toast.error('Failed to save promotion')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOnChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      if (file.type.startsWith('image/')) {
        setFileToUpload(file)
        setImageUrl(URL.createObjectURL(file))
      } else {
        toast.error('Please select a valid image file')
      }
    } catch (error) {
      console.error('Error handling image change:', error)
      toast.error('Error processing image')
    }
  }

  const handleClose = () => {
    setImageUrl(null)
    setFileToUpload(null)
    reset({
      name: '',
      summary: '',
      description: '',
      image: '',
      badge: '',
      colorTheme: undefined,
      highlightText: '',
      buttons: [],
      isPublic: true,
      bonusId: '',
    })
    closeModal?.()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      showCloseButton={true}
      className='m-4 max-w-[700px]'
      position='start'
      isCloseWhenclickingBackground={false}
    >
      <div className='overflow-hidden rounded-3xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]'>
        <div className='max-w-full overflow-x-auto p-5'>
          <form
            onSubmit={(e) => {
              e.preventDefault()
            }}
            noValidate
          >
            <div>
              <div className='mb-5 px-2 pr-14'>
                <h4 className='text-2xl font-semibold text-gray-800 dark:text-white/90'>
                  {detailInfo?._id ? 'Update' : 'Add'} Promotion
                </h4>
              </div>

              <PromotionImageUpload
                image={image}
                detailInfo={detailInfo}
                onImageChange={handleOnChangeImage}
                imageRef={promotionImageRef}
              />

              <PromotionFormFields control={control} errors={errors} />

              <div className='mt-6 flex items-center gap-3 px-2 lg:justify-end'>
                <Button
                  className='mt-4 w-full'
                  size='sm'
                  disabled={isLoading}
                  type='button'
                  onClick={async () => {
                    try {
                      const formData = getValues()

                      // Validate required fields
                      if (!formData.description?.trim()) {
                        toast.error('Description is required')
                        return
                      }

                      if (!formData.name?.trim()) {
                        toast.error('Name is required')
                        return
                      }

                      if (!formData.summary?.trim()) {
                        toast.error('Summary is required')
                        return
                      }

                      setIsLoading(true)
                      await handleSubmit(handleOnSubmit)()
                    } catch (error) {
                      console.error('Submit error:', error)
                    } finally {
                      setIsLoading(false)
                    }
                  }}
                >
                  {isLoading ? (
                    <LoadingSpinner className='mx-auto size-5' />
                  ) : detailInfo?._id ? (
                    'Update'
                  ) : (
                    'Save'
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  )
}

export default PromotionDetailModal
