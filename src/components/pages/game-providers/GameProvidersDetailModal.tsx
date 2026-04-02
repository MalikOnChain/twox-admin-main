'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { uploadPromotionImage } from '@/api/promotion'

import {
  gameProviderFormSchema,
  GameProviderFormValues,
} from '@/lib/game-provider'

import LoadingSpinner from '@/components/common/LoadingSpinner'
import Button from '@/components/ui/button/Button'
import { Modal } from '@/components/ui/modal'

import { PencilIcon } from '@/icons'

import { GameProvider, IMAGE_UPLOAD_STATUS } from '@/types/game-provider'

const GameProvidersDetailModal = ({
  isOpen,
  closeModal,
  detail,
  onSubmit,
}: {
  isOpen: boolean
  closeModal?: () => void
  detail?: GameProvider
  onSubmit: (data: GameProviderFormValues) => Promise<boolean>
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const gameProviderImageRef = useRef<HTMLInputElement>(null)
  const [image, setImageUrl] = useState<string | null>(null)
  const [detailInfo, setDetailInfo] = useState<GameProvider | null>(null)
  const [fileToUpload, setFileToUpload] = useState<File | null>(null)
  const { handleSubmit, reset, getValues } = useForm<GameProviderFormValues>({
    resolver: zodResolver(gameProviderFormSchema),
    defaultValues: {
      banner: detail?.banner || '',
    },
  })

  useEffect(() => {
    if (isOpen) {
      setDetailInfo(detail)
      if (detail) {
        reset({
          banner: detail?.banner || '',
        })
      } else {
        reset({
          banner: '',
        })
        setFileToUpload(null)
      }
    }
  }, [detail, isOpen, reset])

  // Upload tier icon and level icons
  const updateImage = async () => {
    const updatedData = { ...getValues() }

    try {
      // Check if tier icon is selected
      if (!updatedData.banner && !fileToUpload) {
        return {
          status: IMAGE_UPLOAD_STATUS.SELECT_GAMEPROVIDER_IMAGE,
          data: null,
        }
      }
      if (fileToUpload) {
        const formData = new FormData()
        formData.append('file', fileToUpload)
        const result = await uploadPromotionImage(formData)
        updatedData.banner = result.url
      }

      return {
        status: IMAGE_UPLOAD_STATUS.IMAGE_UPLOAD_SUCCESS,
        data: updatedData,
      }
    } catch (error) {
      console.error('Error updating game detail:', error)
      return {
        status:
          error instanceof Error
            ? error.message
            : IMAGE_UPLOAD_STATUS.GAMEPROVIDER_IMAGE_UPLOAD_FAILED,
        data: null,
      }
    }
  }
  // Submit tier
  const handleOnSubmit = async () => {
    setIsLoading(true)
    try {
      const { status, data: updatedData } = await updateImage()

      switch (status) {
        case IMAGE_UPLOAD_STATUS.IMAGE_UPLOAD_SUCCESS:
          if (updatedData) {
            const isSuccess = await onSubmit(updatedData)
            if (isSuccess) {
              reset()
              handleClose()
            }
          }
          return
        case IMAGE_UPLOAD_STATUS.SELECT_GAMEPROVIDER_IMAGE:
          toast.error(IMAGE_UPLOAD_STATUS.SELECT_GAMEPROVIDER_IMAGE)
          return
        default:
          toast.error(IMAGE_UPLOAD_STATUS.GAMEPROVIDER_IMAGE_UPLOAD_FAILED)
          return
      }
    } catch (error) {
      console.error('Error submitting promotion:', error)
      toast.error('Failed to save promotion')
    } finally {
      setIsLoading(false)
    }
  }

  // Show preview of tier icon
  const handleOnChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      if (file.type.startsWith('image/')) {
        setFileToUpload(file)
        setImageUrl(URL.createObjectURL(file))
      }
    } catch (error) {
      console.error('Error updating game detail:', error)
    }
  }

  // Close modal
  const handleClose = () => {
    setImageUrl(null)
    setFileToUpload(null)
    reset({
      banner: '',
    })
    closeModal()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      showCloseButton={true}
      className='m-4 max-w-[700px]'
      position='start'
    >
      <div className='overflow-hidden rounded-3xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]'>
        <div className='max-w-full overflow-x-auto p-5'>
          <form onSubmit={handleSubmit(handleOnSubmit)}>
            <div>
              <div className='mb-5 px-2 pr-14'>
                <h4 className='text-2xl font-semibold text-gray-800 dark:text-white/90'>
                  Update Game Provider Banner
                </h4>
              </div>
              <div className='m-auto my-2 flex h-auto flex-col rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]'>
                <div className='relative flex flex-1 flex-col p-4 sm:p-6'>
                  <div className='flex h-[200px] flex-col items-center justify-center gap-2'>
                    <Image
                      src={image || detailInfo?.banner || '/images/preview.png'}
                      alt={detailInfo?.name || ''}
                      width={0}
                      height={0}
                      sizes='100vw'
                      className='h-full w-full rounded-lg object-cover'
                    />
                  </div>
                  <input
                    type='file'
                    onChange={handleOnChangeImage}
                    ref={gameProviderImageRef}
                    className='hidden'
                  />
                  <div
                    className='absolute top-1 right-1 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white opacity-80 hover:bg-gray-100 dark:hover:bg-gray-800'
                    onClick={() => gameProviderImageRef.current?.click()}
                  >
                    <PencilIcon className='h-5 w-5 text-gray-500 dark:text-gray-400' />
                  </div>
                  <div className='flex items-center gap-3 px-2 lg:justify-end'>
                    <Button
                      className='mt-4 w-full'
                      size='sm'
                      disabled={isLoading}
                      type='submit'
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
              </div>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  )
}

export default GameProvidersDetailModal
