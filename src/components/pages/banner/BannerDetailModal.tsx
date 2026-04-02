'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { uploadBannerImage } from '@/api/banner'

import {
  bannerFormSchema,
  BannerFormValues,
  deviceOptions,
  languageOptions,
  sectionOptions,
} from '@/lib/banner'

import LoadingSpinner from '@/components/common/LoadingSpinner'
import Input from '@/components/form/input/InputField'
import Label from '@/components/form/Label'
import Select from '@/components/form/Select'
import Button from '@/components/ui/button/Button'
import { Modal } from '@/components/ui/modal'

import { PencilIcon } from '@/icons'

import { IBannerData, IMAGE_UPLOAD_STATUS } from '@/types/banner'

const BannerDetailModal = ({
  isOpen,
  closeModal,
  detail,
  onSubmit,
}: {
  isOpen: boolean
  closeModal?: () => void
  detail?: IBannerData
  onSubmit: (data: BannerFormValues) => Promise<boolean>
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const bannerImageRef = useRef<HTMLInputElement>(null)
  const [image, setImageUrl] = useState<string | null>(null)
  const [detailInfo, setDetailInfo] = useState<IBannerData | null>(null)
  const [fileToUpload, setFileToUpload] = useState<File | null>(null)
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
    watch,
  } = useForm<BannerFormValues>({
    resolver: zodResolver(bannerFormSchema),
    defaultValues: {
      title: detail?.title || '',
      position: detail?.position || '',
      image: detail?.image || '',
      language: {
        code: detail?.language.code,
        name: detail?.language.name,
      },
      device: detail?.device,
      section: detail?.section,
      bannerData: detail?.bannerData || {
        title: '',
        subtitle: '',
        highlight: '',
        features: [],
      },
    },
  })

  const currentSection = watch('section')
  const isBonusesSection = currentSection === 'bonuses'

  useEffect(() => {
    if (isOpen) {
      setDetailInfo(detail)
      if (detail) {
        reset({
          title: detail?.title || '',
          position: detail?.position || '',
          image: detail?.image || '',
          language: {
            code: detail?.language.code,
            name: detail?.language.name,
          },
          device: detail?.device,
          section: detail?.section,
          bannerData: detail?.bannerData || {
            title: '',
            subtitle: '',
            highlight: '',
            features: [],
          },
        })
      } else {
        reset({
          title: '',
          position: '',
          image: '',
          language: {
            code: 'en',
            name: 'English',
          },
          device: 'desktop',
          section: 'home',
          bannerData: {
            title: '',
            subtitle: '',
            highlight: '',
            features: [],
          },
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
      if (!updatedData.image && !fileToUpload) {
        return {
          status: IMAGE_UPLOAD_STATUS.SELECT_BANNER_IMAGE,
          data: null,
        }
      }
      if (fileToUpload) {
        const formData = new FormData()
        formData.append('file', fileToUpload)
        const result = await uploadBannerImage(formData)
        updatedData.image = result.url
      }

      // Only include bannerData if section is "bonuses"
      if (updatedData.section !== 'bonuses') {
        delete updatedData.bannerData
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
            : IMAGE_UPLOAD_STATUS.BANNER_IMAGE_UPLOAD_FAILED,
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
        case IMAGE_UPLOAD_STATUS.SELECT_BANNER_IMAGE:
          toast.error(IMAGE_UPLOAD_STATUS.SELECT_BANNER_IMAGE)
          return
        default:
          toast.error(IMAGE_UPLOAD_STATUS.BANNER_IMAGE_UPLOAD_FAILED)
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
      title: '',
      position: '',
      image: '',
      language: {
        code: 'en',
        name: 'English',
      },
      device: 'desktop',
      section: 'home',
      bannerData: {
        title: '',
        subtitle: '',
        highlight: '',
        features: [],
      },
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
                  {detailInfo?._id ? 'Update' : 'Add'} Banner
                </h4>
              </div>
              <div className='m-auto my-2 flex h-auto flex-col rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]'>
                <div className='relative flex flex-1 flex-col p-4 sm:p-6'>
                  <div className='flex h-[200px] flex-col items-center justify-center gap-2'>
                    <Image
                      src={image || detailInfo?.image || '/images/preview.png'}
                      alt={detailInfo?.title || ''}
                      width={0}
                      height={0}
                      sizes='100vw'
                      className='h-full w-full rounded-lg object-cover'
                    />
                  </div>
                  <input
                    type='file'
                    onChange={handleOnChangeImage}
                    ref={bannerImageRef}
                    className='hidden'
                  />
                  <div
                    className='absolute top-1 right-1 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white opacity-80 hover:bg-gray-100 dark:hover:bg-gray-800'
                    onClick={() => bannerImageRef.current?.click()}
                  >
                    <PencilIcon className='h-5 w-5 text-gray-500 dark:text-gray-400' />
                  </div>
                </div>
              </div>
              <div className='divide-y divide-gray-600'>
                {/* Common tier info */}
                <div className='grid grid-cols-1 space-y-1 pb-4'>
                  {/* Title */}
                  <div>
                    <Label>Title</Label>
                    <Controller
                      name='title'
                      control={control}
                      render={({ field }) => (
                        <Input
                          type='text'
                          placeholder='Name'
                          value={field.value}
                          onChange={field.onChange}
                          error={Boolean(errors.title?.message)}
                          errorMessage={errors.title?.message || ''}
                        />
                      )}
                    />
                  </div>
                  {/* Position */}
                  <div>
                    <Label>Position</Label>
                    <Controller
                      name='position'
                      control={control}
                      render={({ field }) => (
                        <Input
                          type='text'
                          placeholder='Name'
                          value={field.value}
                          onChange={field.onChange}
                          error={Boolean(errors.position?.message)}
                          errorMessage={errors.position?.message || ''}
                        />
                      )}
                    />
                  </div>
                  {/* Language */}
                  <div>
                    <Label>Language</Label>
                    <Controller
                      name='language'
                      control={control}
                      render={({ field }) => {
                        const selectedOption = languageOptions.find(
                          (option) => option.code === field.value?.code
                        )

                        return (
                          <Select
                            options={languageOptions.map(({ code, name }) => ({
                              value: code, // language code as value
                              label: name, // language name as label
                            }))}
                            defaultValue={
                              selectedOption ? selectedOption.code : ''
                            }
                            onChange={(selectedCode) => {
                              const selectedLanguage = languageOptions.find(
                                (option) => option.code === selectedCode
                              )
                              field.onChange(selectedLanguage || null)
                            }}
                            error={Boolean(errors.language?.message)}
                            errorMessage={errors.language?.message || ''}
                          />
                        )
                      }}
                    />
                  </div>
                  {/* Device */}
                  <div>
                    <Label>Device</Label>
                    <Controller
                      name='device'
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          defaultValue={field.value || ''}
                          options={deviceOptions}
                          error={Boolean(errors.device?.message)}
                          errorMessage={errors.device?.message || ''}
                        />
                      )}
                    />
                  </div>

                  {/* Section */}
                  <div>
                    <Label>Section</Label>
                    <Controller
                      name='section'
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          defaultValue={field.value || ''}
                          options={sectionOptions}
                          error={Boolean(errors.section?.message)}
                          errorMessage={errors.section?.message || ''}
                        />
                      )}
                    />
                  </div>

                  {/* Banner Data - Only show when section is "bonuses" */}
                  {isBonusesSection && (
                    <>
                      <div className='mt-4 border-t border-gray-200 pt-4 dark:border-gray-700'>
                        <h5 className='mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300'>
                          Banner Data (Bonuses Section)
                        </h5>
                      </div>
                      {/* Banner Data Title */}
                      <div>
                        <Label>Banner Title</Label>
                        <Controller
                          name='bannerData.title'
                          control={control}
                          render={({ field }) => (
                            <Input
                              type='text'
                              placeholder='Enter banner title'
                              value={field.value || ''}
                              onChange={field.onChange}
                              error={Boolean(errors.bannerData?.title?.message)}
                              errorMessage={errors.bannerData?.title?.message || ''}
                            />
                          )}
                        />
                      </div>
                      {/* Banner Data Subtitle */}
                      <div>
                        <Label>Banner Subtitle</Label>
                        <Controller
                          name='bannerData.subtitle'
                          control={control}
                          render={({ field }) => (
                            <Input
                              type='text'
                              placeholder='Enter banner subtitle'
                              value={field.value || ''}
                              onChange={field.onChange}
                              error={Boolean(errors.bannerData?.subtitle?.message)}
                              errorMessage={errors.bannerData?.subtitle?.message || ''}
                            />
                          )}
                        />
                      </div>
                      {/* Banner Data Highlight */}
                      <div>
                        <Label>Banner Highlight</Label>
                        <Controller
                          name='bannerData.highlight'
                          control={control}
                          render={({ field }) => (
                            <Input
                              type='text'
                              placeholder='Enter banner highlight'
                              value={field.value || ''}
                              onChange={field.onChange}
                              error={Boolean(errors.bannerData?.highlight?.message)}
                              errorMessage={errors.bannerData?.highlight?.message || ''}
                            />
                          )}
                        />
                      </div>
                      {/* Banner Data Features */}
                      <div>
                        <Label>Features (one per line)</Label>
                        <Controller
                          name='bannerData.features'
                          control={control}
                          render={({ field }) => (
                            <textarea
                              rows={4}
                              placeholder='Enter features, one per line'
                              value={field.value?.join('\n') || ''}
                              onChange={(e) => {
                                const features = e.target.value
                                  .split('\n')
                                  .map((f) => f.trim())
                                  .filter((f) => f.length > 0)
                                field.onChange(features)
                              }}
                              className='mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
                            />
                          )}
                        />
                      </div>
                    </>
                  )}
                </div>
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
          </form>
        </div>
      </div>
    </Modal>
  )
}

export default BannerDetailModal
