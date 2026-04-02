'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { uploadTierIcon } from '@/api/tier'

import { tierFormSchema, TierFormValues } from '@/lib/tier'

import LoadingSpinner from '@/components/common/LoadingSpinner'
import Input from '@/components/form/input/InputField'
import Label from '@/components/form/Label'
import Button from '@/components/ui/button/Button'
import { Modal } from '@/components/ui/modal'

import { PencilIcon } from '@/icons'

import { ICON_UPLOAD_STATUS, ITierData } from '@/types/tier'

const TierDetailModal = ({
  isOpen,
  closeModal,
  detail,
  onSubmit,
}: {
  isOpen: boolean
  closeModal?: () => void
  detail?: ITierData
  onSubmit: (data: TierFormValues) => Promise<boolean>
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const tierIconRef = useRef<HTMLInputElement>(null)
  const [banner, setBanner] = useState<string | null>(null)
  const [detailInfo, setDetailInfo] = useState<ITierData | null>(null)
  const levelIconRefs = useRef<HTMLInputElement[]>([])
  const [levelIcons, setLevelIcons] = useState<string[]>([])
  const [filesToUpload, setFilesToUpload] = useState<
    Record<string, File | null>
  >({})
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    getValues,
    watch,
  } = useForm<TierFormValues>({
    resolver: zodResolver(tierFormSchema),
    defaultValues: {
      name: detail?.name || '',
      levels: detail?.levels || [],
      downgradePeriod: detail?.downgradePeriod || 0,
      icon: detail?.icon || '',
    },
  })

  const icon = watch('icon')
  const levels = watch('levels')

  useEffect(() => {
    if (isOpen) {
      setDetailInfo(detail)
      if (detail) {
        reset({
          name: detail.name,
          levels: detail.levels,
          downgradePeriod: detail.downgradePeriod,
          icon: detail.icon,
        })
        setLevelIcons(detail.levels.map((lvl) => lvl.icon))
        setFilesToUpload((prev) => ({
          ...prev,
          ...detail.levels.reduce((acc, lvl, index) => {
            acc[`level-${index}`] = null
            return acc
          }, {}),
        }))
      } else {
        reset({
          name: '',
          levels: [],
          downgradePeriod: 0,
          icon: '',
        })
        setFilesToUpload({})
        setLevelIcons([])
      }
    }
  }, [detail, isOpen, reset])

  // Upload tier icon and level icons
  const updateIcons = async () => {
    const updatedData = { ...getValues() }

    try {
      // Check if tier icon is selected
      if (!updatedData.icon && !filesToUpload.banner) {
        return {
          status: ICON_UPLOAD_STATUS.SELECT_TIER_ICON,
          data: null,
        }
      }

      const uploadPromises = []
      const fileToUploadKeySet = []

      Object.keys(filesToUpload).forEach((key) => {
        if (filesToUpload[key]) {
          const formData = new FormData()
          formData.append('file', filesToUpload[key])
          uploadPromises.push(uploadTierIcon(formData))
          fileToUploadKeySet.push(key)
        }
      })

      // Execute all uploads in parallel
      const results = await Promise.all(uploadPromises)

      // Process results
      results.forEach((result, index) => {
        if (
          fileToUploadKeySet[index] &&
          fileToUploadKeySet[index] === 'banner'
        ) {
          updatedData.icon = result.url
        } else {
          const key = fileToUploadKeySet[index]
          const levelIndex = key.split('-')[1]
          updatedData.levels[levelIndex].icon = result.url
        }
      })

      return {
        status: ICON_UPLOAD_STATUS.ICON_UPLOAD_SUCCESS,
        data: updatedData,
      }
    } catch (error) {
      console.error('Error updating game detail:', error)
      return {
        status:
          error instanceof Error
            ? error.message
            : ICON_UPLOAD_STATUS.ICON_UPLOAD_FAILED,
        data: null,
      }
    }
  }

  // Submit tier
  const handleOnSubmit = async () => {
    setIsLoading(true)
    try {
      const { status, data: updatedData } = await updateIcons()

      switch (status) {
        case ICON_UPLOAD_STATUS.ICON_UPLOAD_SUCCESS:
          if (updatedData) {
            const isSuccess = await onSubmit(updatedData)
            if (isSuccess) {
              reset()
              handleClose()
            }
          }
          return
        case ICON_UPLOAD_STATUS.ICON_UPLOAD_FAILED:
          toast.error(ICON_UPLOAD_STATUS.ICON_UPLOAD_FAILED)
          return
        case ICON_UPLOAD_STATUS.SELECT_TIER_ICON:
          toast.error(ICON_UPLOAD_STATUS.SELECT_TIER_ICON)
          return
        case ICON_UPLOAD_STATUS.SELECT_TIER_LEVEL_ICON:
          toast.error(ICON_UPLOAD_STATUS.SELECT_TIER_LEVEL_ICON)
          return
        case ICON_UPLOAD_STATUS.TIER_ICON_UPLOAD_FAILED:
          toast.error(ICON_UPLOAD_STATUS.TIER_ICON_UPLOAD_FAILED)
          return
        case ICON_UPLOAD_STATUS.TIER_LEVEL_ICON_UPLOAD_FAILED:
          toast.error(ICON_UPLOAD_STATUS.TIER_LEVEL_ICON_UPLOAD_FAILED)
          return
        default:
          toast.error(ICON_UPLOAD_STATUS.ICON_UPLOAD_FAILED)
          return
      }
    } catch (error) {
      console.error('Error submitting tier:', error)
      toast.error('Failed to save tier')
    } finally {
      setIsLoading(false)
    }
  }

  // Show preview of tier icon
  const handleOnChangeBanner = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      if (file.type.startsWith('image/')) {
        setFilesToUpload((prev) => ({
          ...prev,
          banner: file,
        }))
        setBanner(URL.createObjectURL(file))
      }
    } catch (error) {
      console.error('Error updating game detail:', error)
    }
  }

  // Show preview of level icon
  const handleOnChangeLevelIcon = (index: number, file: File) => {
    if (!file) return
    if (file.type.startsWith('image/')) {
      const newLevelIcons = {}
      Object.keys(filesToUpload).forEach((key) => {
        if (key.startsWith('level-')) {
          newLevelIcons[key] = file
        }
      })
      newLevelIcons[index] = file
      setLevelIcons((prev) => {
        prev[index] = URL.createObjectURL(file)
        return [...prev]
      })
      setFilesToUpload((prev) => ({
        ...prev,
        [`level-${index}`]: file,
      }))
    }
  }

  // Close modal
  const handleClose = () => {
    setBanner(null)
    setFilesToUpload({})
    setLevelIcons([])
    reset({
      name: '',
      levels: [],
      downgradePeriod: 0,
      icon: '',
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
                  {detailInfo?._id ? 'Update' : 'Add'} Tier
                </h4>
              </div>
              <div className='m-auto my-2 flex h-auto flex-col rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]'>
                <div className='relative flex flex-1 flex-col border-t border-gray-100 p-4 sm:p-6 dark:border-gray-800'>
                  <div className='flex flex-col items-center justify-center gap-2'>
                    <Image
                      src={banner || detailInfo?.icon || '/images/preview.png'}
                      alt={detailInfo?.name || ''}
                      width={200}
                      height={200}
                      className='h-24 w-24 rounded-lg object-contain'
                    />
                  </div>
                  <input
                    type='file'
                    onChange={handleOnChangeBanner}
                    ref={tierIconRef}
                    className='hidden'
                  />
                  <div
                    className='absolute top-1 right-1 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white opacity-80 hover:bg-gray-100 dark:hover:bg-gray-800'
                    onClick={() => tierIconRef.current?.click()}
                  >
                    <PencilIcon className='h-5 w-5 text-gray-500 dark:text-gray-400' />
                  </div>
                </div>
              </div>
              {!icon && errors.icon && (
                <p className='mt-1 text-xs text-red-500'>
                  {errors.icon?.message}
                </p>
              )}
              <div className='divide-y divide-gray-600'>
                {/* Common tier info */}
                <div className='grid grid-cols-1 gap-6 pb-4 sm:grid-cols-2'>
                  {/* Name */}
                  <div>
                    <Label>Name</Label>
                    <Controller
                      name='name'
                      control={control}
                      render={({ field }) => (
                        <Input
                          type='text'
                          placeholder='Name'
                          value={field.value}
                          onChange={field.onChange}
                          error={Boolean(errors.name?.message)}
                          errorMessage={errors.name?.message || ''}
                        />
                      )}
                    />
                  </div>

                  {/* Downgrade Period */}
                  <div>
                    <Label>Downgrade Period</Label>
                    <Controller
                      name='downgradePeriod'
                      control={control}
                      render={({ field }) => (
                        <Input
                          type='number'
                          min={0}
                          placeholder='Downgrade Period'
                          value={field.value}
                          onChange={(e) => {
                            field.onChange(Number(e.target.value))
                          }}
                          error={Boolean(errors.downgradePeriod?.message)}
                          errorMessage={errors.downgradePeriod?.message || ''}
                        />
                      )}
                    />
                  </div>
                </div>

                {/* Levels */}
                <div className='mt-4'>
                  <Label>
                    <span className='mr-2 text-lg'>Levels</span>
                    <Button
                      size='sm'
                      variant='outline'
                      type='button'
                      className='mr-2 !p-2 leading-1.5'
                      onClick={() => {
                        const newLevels = [
                          ...getValues('levels'),
                          {
                            level: 0,
                            minXP: 0,
                          },
                        ]
                        setValue('levels', newLevels, {
                          shouldDirty: true,
                        })
                        setFilesToUpload((prev) => ({
                          ...prev,
                          [`level-${newLevels.length - 1}`]: null,
                        }))
                      }}
                    >
                      +
                    </Button>
                    <Button
                      size='sm'
                      variant='outline'
                      type='button'
                      className='!p-2 leading-1.5'
                      onClick={() => {
                        if (getValues('levels').length > 1) {
                          const newLevels = getValues('levels').slice(0, -1)
                          setValue('levels', newLevels, {
                            shouldDirty: true,
                          })
                          setFilesToUpload((prev) => ({
                            ...prev,
                            [`level-${newLevels.length}`]: null,
                          }))
                        }
                      }}
                    >
                      -
                    </Button>
                  </Label>
                  {levels.length > 0 &&
                    levels.map((level, index) => (
                      <React.Fragment key={index}>
                        <div className='mt-2 flex gap-2'>
                          <div>
                            <Label>Icon</Label>
                            <Image
                              src={
                                levelIcons[index] ||
                                level.icon ||
                                '/images/preview.png'
                              }
                              alt={detailInfo?.name || ''}
                              width={200}
                              height={200}
                              className='h-11 w-11 cursor-pointer rounded-lg object-contain'
                              onClick={() =>
                                levelIconRefs.current[index]?.click()
                              }
                            />
                            <input
                              type='file'
                              onChange={(e) =>
                                handleOnChangeLevelIcon(
                                  index,
                                  e.target.files?.[0]
                                )
                              }
                              ref={(el) => {
                                levelIconRefs.current[index] = el
                              }}
                              className='hidden'
                            />
                            {errors.levels?.[index]?.icon && (
                              <p className='mt-1 text-xs text-red-500'>
                                {errors.levels?.[index]?.icon?.message}
                              </p>
                            )}
                          </div>
                          <div className='grid flex-1 grid-cols-3 gap-2'>
                            {/* order */}
                            <div>
                              <Label>Order</Label>
                              <Controller
                                name={`levels.${index}.level`}
                                control={control}
                                render={({ field }) => (
                                  <Input
                                    type='number'
                                    min={0}
                                    placeholder='Level'
                                    value={field.value}
                                    onChange={(e) => {
                                      field.onChange(Number(e.target.value))
                                    }}
                                    error={Boolean(
                                      errors.levels?.[index]?.level?.message
                                    )}
                                    errorMessage={
                                      errors.levels?.[index]?.level?.message ||
                                      ''
                                    }
                                  />
                                )}
                              />
                            </div>

                            {/* name */}
                            <div>
                              <Label>Name</Label>
                              <Controller
                                name={`levels.${index}.name`}
                                control={control}
                                render={({ field }) => (
                                  <Input
                                    type='text'
                                    placeholder='Name'
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={Boolean(
                                      errors.levels?.[index]?.name?.message
                                    )}
                                    errorMessage={
                                      errors.levels?.[index]?.name?.message ||
                                      ''
                                    }
                                  />
                                )}
                              />
                            </div>

                            {/* minXP */}
                            <div>
                              <Label>Min XP</Label>
                              <Controller
                                name={`levels.${index}.minXP`}
                                control={control}
                                render={({ field }) => (
                                  <Input
                                    type='number'
                                    min={0}
                                    placeholder='Min XP'
                                    value={field.value}
                                    onChange={(e) => {
                                      field.onChange(Number(e.target.value))
                                    }}
                                    error={Boolean(
                                      errors.levels?.[index]?.minXP?.message
                                    )}
                                    errorMessage={
                                      errors.levels?.[index]?.minXP?.message ||
                                      ''
                                    }
                                  />
                                )}
                              />
                            </div>
                          </div>
                        </div>
                      </React.Fragment>
                    ))}
                  {errors.levels && (
                    <p className='mt-1 text-sm text-red-500'>
                      {errors.levels.message}
                    </p>
                  )}
                </div>
              </div>
              <div className='mt-6 flex items-center gap-3 px-2 lg:justify-end'>
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

export default TierDetailModal
