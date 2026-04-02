'use client'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { uploadUtmImage } from '@/api/utm-link'

import { getUtmSourceOptions } from '@/lib/utils'

import Input from '@/components/form/input/InputField'
import Label from '@/components/form/Label'
import Select from '@/components/form/Select'
import Button from '@/components/ui/button/Button'
import { Modal } from '@/components/ui/modal'

import { PencilIcon } from '@/icons'

import { IPromotionData } from '@/types/promotion'
import { UTMLink } from '@/types/utm-link'

const UTM_SOURCE_OPTIONS = getUtmSourceOptions()

type UTMLinkSettingModalProps = {
  isOpen: boolean
  promotions: IPromotionData[]
  closeModal: () => void
  onSubmit: (data: any) => Promise<boolean>
  editingUtmLink?: UTMLink | null
}

const UTMLinkSettingModal = ({
  isOpen,
  promotions,
  closeModal,
  onSubmit,
  editingUtmLink = null,
}: UTMLinkSettingModalProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [fileToUpload, setFileToUpload] = useState<File | null>(null)
  const imageRef = useRef<HTMLInputElement>(null)

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { isSubmitting, isDirty },
  } = useForm({
    defaultValues: {
      source: 'google',
      campaign: {
        id: '',
        name: '',
      },
      content: {
        title: '',
        description: '',
        image: '',
        redirectUrl: '/promotions',
      },
    },
  })

  // Reset form when modal opens/closes or when editing different UTM link
  useEffect(() => {
    if (isOpen) {
      if (editingUtmLink) {
        // Populate form with existing data for editing
        setValue('source', editingUtmLink.utm_source)
        setValue('campaign', {
          id: editingUtmLink.utm_campaign._id,
          name: editingUtmLink.utm_campaign.name,
        })
        setValue('content.title', editingUtmLink.utm_content.title)
        setValue('content.description', editingUtmLink.utm_content.description)
        setValue('content.image', editingUtmLink.utm_content.image)
        setValue('content.redirectUrl', editingUtmLink.utm_content.redirectUrl)

        setImageUrl(editingUtmLink.utm_content.image)
      } else {
        // Reset form for new UTM link creation
        reset({
          source: 'google',
          campaign: {
            id: '',
            name: '',
          },
          content: {
            title: '',
            description: '',
            image: '',
            redirectUrl: '/promotions',
          },
        })
        setImageUrl(null)
      }
      setFileToUpload(null)
    }
  }, [isOpen, editingUtmLink, setValue, reset])

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

  const handleFormSubmit = async (data: any) => {
    try {
      if (fileToUpload) {
        const formData = new FormData()
        formData.append('file', fileToUpload)
        const result = await uploadUtmImage(formData)
        data.content.image = result.url
      }
      const utm_campaign = promotions.find(
        (promotion) => promotion._id === data.campaign.id
      )
      if (utm_campaign) {
        data.campaign.name = utm_campaign.name
      }

      const success = await onSubmit(data)
      if (success) {
        closeModal()
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      toast.error('Failed to submit form')
    }
  }

  const handleClose = () => {
    setImageUrl(null)
    setFileToUpload(null)
    closeModal()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className='m-4 max-w-[700px]'>
      <div className='no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 lg:p-11 dark:bg-gray-900'>
        <div className='px-2 pr-14'>
          <h4 className='mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90'>
            {editingUtmLink ? 'Edit UTM Link' : 'Generate UTM Link'}
          </h4>
        </div>

        <form
          className='flex flex-col'
          onSubmit={handleSubmit(handleFormSubmit)}
        >
          <div className='custom-scrollbar h-[500px] overflow-y-auto px-2 pb-3'>
            <div className='mt-7'>
              <div className='grid grid-cols-1 gap-x-6 gap-y-5'>
                <div className='col-span-1'>
                  <Label htmlFor='source'>UTM Source</Label>
                  <Controller
                    name='source'
                    control={control}
                    render={({ field }) => (
                      <Select
                        options={UTM_SOURCE_OPTIONS}
                        placeholder='Select an option'
                        onChange={field.onChange}
                        defaultValue={field.value}
                        className='bg-gray-50 dark:bg-gray-800'
                      />
                    )}
                  />
                </div>

                <div className='col-span-1'>
                  <Label htmlFor='campaign'>UTM Campaign</Label>
                  <Controller
                    name='campaign'
                    control={control}
                    render={({ field }) => (
                      <Select
                        options={promotions.map((promotion) => ({
                          label: promotion.name,
                          value: promotion._id,
                        }))}
                        placeholder='Select an option'
                        onChange={(value) => {
                          const selectedPromotion = promotions.find(
                            (p) => p._id === value
                          )
                          if (selectedPromotion) {
                            field.onChange({
                              id: selectedPromotion._id,
                              name: selectedPromotion.name,
                            })

                            // Auto-fill title and description only if not editing
                            if (!editingUtmLink) {
                              setValue(
                                'content.title',
                                selectedPromotion.name ||
                                  'Special Promotion - twox.gg'
                              )
                              setValue(
                                'content.description',
                                selectedPromotion.description ||
                                  'Check out our latest promotions and bonuses!'
                              )
                            }
                          }
                        }}
                        defaultValue={field.value?.id || ''}
                        className='bg-gray-50 dark:bg-gray-800'
                      />
                    )}
                  />
                </div>

                <div className='col-span-1'>
                  <Label htmlFor='title'>Title</Label>
                  <Controller
                    name='content.title'
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id='content.title'
                        placeholder='Enter title for Open Graph'
                        className='bg-gray-50 dark:bg-gray-800'
                      />
                    )}
                  />
                </div>

                <div className='col-span-1'>
                  <Label htmlFor='description'>Description</Label>
                  <Controller
                    name='content.description'
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id='content.description'
                        placeholder='Enter description for Open Graph'
                        className='bg-gray-50 dark:bg-gray-800'
                      />
                    )}
                  />
                </div>

                <div className='col-span-1'>
                  <Label htmlFor='description'>Redirect URL</Label>
                  <Controller
                    name='content.redirectUrl'
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id='content.description'
                        placeholder='Enter description for Open Graph'
                        className='bg-gray-50 dark:bg-gray-800'
                      />
                    )}
                  />
                </div>

                <div className='col-span-1'>
                  <Label>UTM Image</Label>
                  <div className='m-auto my-2 flex h-auto flex-col rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]'>
                    <div className='relative flex flex-1 flex-col p-4 sm:p-6'>
                      <div className='flex h-[200px] flex-col items-center justify-center gap-2'>
                        <Image
                          src={imageUrl || '/images/preview.png'}
                          alt='UTM Image'
                          width={0}
                          height={0}
                          sizes='100vw'
                          className='h-full w-full rounded-lg object-contain'
                        />
                      </div>
                      <input
                        type='file'
                        onChange={handleOnChangeImage}
                        ref={imageRef}
                        className='hidden'
                        accept='image/*'
                      />
                      <div
                        className='absolute top-1 right-1 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white opacity-80 hover:bg-gray-100 dark:hover:bg-gray-800'
                        onClick={() => imageRef.current?.click()}
                      >
                        <PencilIcon className='h-5 w-5 text-gray-500 dark:text-gray-400' />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='mt-6 flex items-center gap-3 px-2 lg:justify-end'>
            <Button
              size='sm'
              variant='outline'
              type='button'
              onClick={handleClose}
            >
              Close
            </Button>
            <Button disabled={!isDirty || isSubmitting} size='sm' type='submit'>
              {editingUtmLink ? 'Update' : 'Generate'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  )
}

export default UTMLinkSettingModal
