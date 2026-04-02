'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

import { uploadLogo } from '@/api/site-settings'

import ComponentCard from '@/components/common/ComponentCard'
import Input from '@/components/form/input/InputField'
import Label from '@/components/form/Label'
import Button from '@/components/ui/button/Button'

import { PencilIcon } from '@/icons'

import { SiteSettings } from '@/types/site-settings'

const LogoUploadStatus = {
  UPLOAD_SUCCESS: 'Logo upload success!',
  SELECT_LOGO: 'Select logo!',
  UPLOAD_FAILED: 'Logo upload failed',
}

// Define the form schema
const createFormSchema = () => {
  return z.object({
    socialMediaSetting: z.object({
      logo: z.string().optional(),
      logoSymbol: z.string().optional(),
      logoStyle: z.object({
        height: z.number(),
        top: z.number(),
        left: z.number(),
      }),
      logoSymbolStyle: z.object({
        height: z.number(),
        top: z.number(),
        left: z.number(),
      }),
      title: z.string(),
      slogan: z.string(),
      instagram: z.string().optional(),
      facebook: z.string().optional(),
      twitter: z.string().optional(),
      whatsapp: z.string().optional(),
      telegram: z.string().optional(),
      discord: z.string().optional(),
    }),
  })
}

type FormValues = z.infer<ReturnType<typeof createFormSchema>>

interface SocialMediaSettingsCardProps {
  settings: Pick<SiteSettings, 'socialMediaSetting'>
  onSubmit: (data: FormValues) => void
}

const SocialMediaSettingsCard = ({
  settings,
  onSubmit,
}: SocialMediaSettingsCardProps) => {
  // Create schema with initial values
  const formSchema = React.useMemo(() => createFormSchema(), [])
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [logoUrlSymbol, setLogoUrlSymbol] = useState<string | null>(null)
  const logoImageRef = useRef<HTMLInputElement>(null)
  const logoSymbolRef = useRef<HTMLInputElement>(null)
  const [fileToUpload, setFileToUpload] = useState<File | null>(null)
  const [fileToUploadSymbol, setFileToUploadSymbol] = useState<File | null>(
    null
  )
  const [isDirtyImage, setIsDirtyImage] = useState<boolean>(false)
  const [isDirtyImageSymbol, setIsDirtyImageSymbol] = useState<boolean>(false)

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      socialMediaSetting: settings.socialMediaSetting,
    },
    mode: 'onChange',
  })

  const handleOnChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      if (file.type.startsWith('image/')) {
        setFileToUpload(file)
        setLogoUrl(URL.createObjectURL(file))
        setIsDirtyImage(true)
      }
    } catch (error) {
      console.error('Error updating game detail:', error)
    }
  }

  const handleOnChangeImageSymbol = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      if (file.type.startsWith('image/')) {
        setFileToUploadSymbol(file)
        setLogoUrlSymbol(URL.createObjectURL(file))
        setIsDirtyImageSymbol(true)
      }
    } catch (error) {
      console.error('Error updating game detail:', error)
    }
  }

  const updateImage = async () => {
    const updatedData = { ...getValues() }

    try {
      if (fileToUpload) {
        const formData = new FormData()
        formData.append('file', fileToUpload)
        const result = await uploadLogo(formData)
        updatedData.socialMediaSetting.logo = result.url
        setIsDirtyImage(false)
        setLogoUrl(result.url)
        setFileToUpload(null)
      }

      if (fileToUploadSymbol) {
        const formData = new FormData()
        formData.append('file', fileToUploadSymbol)
        const result = await uploadLogo(formData)
        updatedData.socialMediaSetting.logoSymbol = result.url
        setIsDirtyImageSymbol(false)
        setLogoUrlSymbol(result.url)
        setFileToUploadSymbol(null)
      }

      return {
        status: LogoUploadStatus.UPLOAD_SUCCESS,
        data: updatedData,
      }
    } catch (error) {
      console.error('Error updating game detail:', error)
      return {
        status:
          error instanceof Error
            ? error.message
            : LogoUploadStatus.UPLOAD_FAILED,
        data: null,
      }
    }
  }

  const onFormSubmit = handleSubmit(async () => {
    const { status, data: updatedData } = await updateImage()
    switch (status) {
      case LogoUploadStatus.UPLOAD_SUCCESS:
        if (updatedData) {
          await onSubmit(updatedData)
          reset()
        }
        return
      case LogoUploadStatus.SELECT_LOGO:
        toast.error(LogoUploadStatus.SELECT_LOGO)
        return
      default:
        toast.error(LogoUploadStatus.UPLOAD_FAILED)
        return
    }
  })

  useEffect(() => {
    reset(settings)
  }, [settings, reset])

  return (
    <ComponentCard title='Logo & Social Media Settings'>
      <form onSubmit={onFormSubmit} className='space-y-6'>
        <div className='grid grid-cols-1 gap-6'>
          <div className='grid grid-cols-1 gap-2 md:grid-cols-2'>
            <div className='relative flex flex-1 flex-col'>
              <Label>Logo</Label>
              <div className='flex flex-col items-center justify-center gap-2'>
                <Image
                  src={
                    logoUrl ||
                    settings?.socialMediaSetting?.logo ||
                    '/images/preview.png'
                  }
                  alt='Site logo'
                  width={0}
                  height={0}
                  sizes='100vw'
                  className='h-[120px] w-full rounded-lg object-contain'
                />
              </div>
              <input
                type='file'
                onChange={handleOnChangeImage}
                ref={logoImageRef}
                className='hidden'
              />
              <div
                className='absolute top-1 right-1 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white opacity-80 hover:bg-gray-100 dark:hover:bg-gray-800'
                onClick={() => logoImageRef.current?.click()}
              >
                <PencilIcon className='h-5 w-5 text-gray-500 dark:text-gray-400' />
              </div>
              <div className='mt-2 grid grid-cols-1 gap-2 lg:grid-cols-3'>
                <div>
                  <Label htmlFor='logo-height'>Height</Label>
                  <Controller
                    name='socialMediaSetting.logoStyle.height'
                    control={control}
                    render={({ field }) => (
                      <Input
                        id='logo-height'
                        type='number'
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(Number(e.target.value))
                        }}
                        error={Boolean(
                          errors.socialMediaSetting?.logoStyle?.height?.message
                        )}
                        errorMessage={
                          errors.socialMediaSetting?.logoStyle?.height?.message
                        }
                      />
                    )}
                  />
                </div>
                <div>
                  <Label htmlFor='logo-top'>Top</Label>
                  <Controller
                    name='socialMediaSetting.logoStyle.top'
                    control={control}
                    render={({ field }) => (
                      <Input
                        id='logo-top'
                        type='number'
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(Number(e.target.value))
                        }}
                        error={Boolean(
                          errors.socialMediaSetting?.logoStyle?.top?.message
                        )}
                        errorMessage={
                          errors.socialMediaSetting?.logoStyle?.top?.message
                        }
                      />
                    )}
                  />
                </div>
                <div>
                  <Label htmlFor='logo-left'>Left</Label>
                  <Controller
                    name='socialMediaSetting.logoStyle.left'
                    control={control}
                    render={({ field }) => (
                      <Input
                        id='logo-left'
                        type='number'
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(Number(e.target.value))
                        }}
                        error={Boolean(
                          errors.socialMediaSetting?.logoStyle?.left?.message
                        )}
                        errorMessage={
                          errors.socialMediaSetting?.logoStyle?.left?.message
                        }
                      />
                    )}
                  />
                </div>
              </div>
            </div>

            <div className='relative flex flex-1 flex-col'>
              <Label>Logo Symbol</Label>
              <div className='flex flex-col items-center justify-center gap-2'>
                <Image
                  src={
                    logoUrlSymbol ||
                    settings?.socialMediaSetting?.logoSymbol ||
                    '/images/preview.png'
                  }
                  alt='Site logo'
                  width={0}
                  height={0}
                  sizes='100vw'
                  className='h-[120px] w-full rounded-lg object-contain'
                />
              </div>
              <input
                type='file'
                onChange={handleOnChangeImageSymbol}
                ref={logoSymbolRef}
                className='hidden'
              />
              <div
                className='absolute top-1 right-1 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white opacity-80 hover:bg-gray-100 dark:hover:bg-gray-800'
                onClick={() => logoSymbolRef.current?.click()}
              >
                <PencilIcon className='h-5 w-5 text-gray-500 dark:text-gray-400' />
              </div>
              <div className='mt-2 grid grid-cols-1 gap-2 lg:grid-cols-3'>
                <div>
                  <Label htmlFor='logo-symbol-height'>Height</Label>
                  <Controller
                    name='socialMediaSetting.logoSymbolStyle.height'
                    control={control}
                    render={({ field }) => (
                      <Input
                        id='logo-symbol-height'
                        type='number'
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(Number(e.target.value))
                        }}
                        error={Boolean(
                          errors.socialMediaSetting?.logoSymbolStyle?.height
                            ?.message
                        )}
                        errorMessage={
                          errors.socialMediaSetting?.logoSymbolStyle?.height
                            ?.message
                        }
                      />
                    )}
                  />
                </div>
                <div>
                  <Label htmlFor='logo-symbol-top'>Top</Label>
                  <Controller
                    name='socialMediaSetting.logoSymbolStyle.top'
                    control={control}
                    render={({ field }) => (
                      <Input
                        id='logo-symbol-top'
                        type='number'
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(Number(e.target.value))
                        }}
                        error={Boolean(
                          errors.socialMediaSetting?.logoSymbolStyle?.top
                            ?.message
                        )}
                        errorMessage={
                          errors.socialMediaSetting?.logoSymbolStyle?.top
                            ?.message
                        }
                      />
                    )}
                  />
                </div>
                <div>
                  <Label htmlFor='logo-symbol-left'>Left</Label>
                  <Controller
                    name='socialMediaSetting.logoSymbolStyle.left'
                    control={control}
                    render={({ field }) => (
                      <Input
                        id='logo-symbol-left'
                        type='number'
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(Number(e.target.value))
                        }}
                        error={Boolean(
                          errors.socialMediaSetting?.logoSymbolStyle?.left
                            ?.message
                        )}
                        errorMessage={
                          errors.socialMediaSetting?.logoSymbolStyle?.left
                            ?.message
                        }
                      />
                    )}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className='grid grid-cols-1 gap-2 md:grid-cols-2'>
            <div>
              <Label htmlFor='title'>Title</Label>
              <Controller
                name='socialMediaSetting.title'
                control={control}
                render={({ field }) => (
                  <Input
                    id='title'
                    type='text'
                    value={field.value}
                    onChange={(e) => {
                      field.onChange(e.target.value)
                    }}
                    onBlur={field.onBlur}
                    error={Boolean(errors.socialMediaSetting?.title?.message)}
                    errorMessage={errors.socialMediaSetting?.title?.message}
                  />
                )}
              />
            </div>
            <div>
              <Label htmlFor='slogan'>Slogan</Label>
              <Controller
                name='socialMediaSetting.slogan'
                control={control}
                render={({ field }) => (
                  <Input
                    id='slogan'
                    type='text'
                    value={field.value}
                    onChange={(e) => {
                      field.onChange(e.target.value)
                    }}
                    onBlur={field.onBlur}
                    error={Boolean(errors.socialMediaSetting?.slogan?.message)}
                    errorMessage={errors.socialMediaSetting?.slogan?.message}
                  />
                )}
              />
            </div>
            <div>
              <Label htmlFor='instagram'>Instagram</Label>
              <Controller
                name='socialMediaSetting.instagram'
                control={control}
                render={({ field }) => (
                  <Input
                    id='instagram'
                    type='text'
                    value={field.value}
                    onChange={(e) => {
                      field.onChange(e.target.value)
                    }}
                    onBlur={field.onBlur}
                    error={Boolean(
                      errors.socialMediaSetting?.instagram?.message
                    )}
                    errorMessage={errors.socialMediaSetting?.instagram?.message}
                  />
                )}
              />
            </div>
            <div>
              <Label htmlFor='facebook'>Facebook</Label>
              <Controller
                name='socialMediaSetting.facebook'
                control={control}
                render={({ field }) => (
                  <Input
                    id='facebook'
                    type='text'
                    value={field.value}
                    onChange={(e) => {
                      field.onChange(e.target.value)
                    }}
                    onBlur={field.onBlur}
                    error={Boolean(
                      errors.socialMediaSetting?.facebook?.message
                    )}
                    errorMessage={errors.socialMediaSetting?.facebook?.message}
                  />
                )}
              />
            </div>
            <div>
              <Label htmlFor='twitter'>Twitter</Label>
              <Controller
                name='socialMediaSetting.twitter'
                control={control}
                render={({ field }) => (
                  <Input
                    id='twitter'
                    type='text'
                    value={field.value}
                    onChange={(e) => {
                      field.onChange(e.target.value)
                    }}
                    onBlur={field.onBlur}
                    error={Boolean(errors.socialMediaSetting?.twitter?.message)}
                    errorMessage={errors.socialMediaSetting?.twitter?.message}
                  />
                )}
              />
            </div>
            <div>
              <Label htmlFor='whatsapp'>Whatsapp</Label>
              <Controller
                name='socialMediaSetting.whatsapp'
                control={control}
                render={({ field }) => (
                  <Input
                    id='whatsapp'
                    type='text'
                    value={field.value}
                    onChange={(e) => {
                      field.onChange(e.target.value)
                    }}
                    onBlur={field.onBlur}
                    error={Boolean(
                      errors.socialMediaSetting?.whatsapp?.message
                    )}
                    errorMessage={errors.socialMediaSetting?.whatsapp?.message}
                  />
                )}
              />
            </div>
            <div>
              <Label htmlFor='telegram'>Telegram</Label>
              <Controller
                name='socialMediaSetting.telegram'
                control={control}
                render={({ field }) => (
                  <Input
                    id='telegram'
                    type='text'
                    value={field.value}
                    onChange={(e) => {
                      field.onChange(e.target.value)
                    }}
                    onBlur={field.onBlur}
                    error={Boolean(
                      errors.socialMediaSetting?.telegram?.message
                    )}
                    errorMessage={errors.socialMediaSetting?.telegram?.message}
                  />
                )}
              />
            </div>
            <div>
              <Label htmlFor='discord'>Discord</Label>
              <Controller
                name='socialMediaSetting.discord'
                control={control}
                render={({ field }) => (
                  <Input
                    id='discord'
                    type='text'
                    value={field.value}
                    onChange={(e) => {
                      field.onChange(e.target.value)
                    }}
                    onBlur={field.onBlur}
                    error={Boolean(errors.socialMediaSetting?.discord?.message)}
                    errorMessage={errors.socialMediaSetting?.discord?.message}
                  />
                )}
              />
            </div>
          </div>
        </div>
        <div className='flex justify-end'>
          <Button
            type='submit'
            size='sm'
            disabled={
              (!isDirty && !isDirtyImage && !isDirtyImageSymbol) || isSubmitting
            }
          >
            {isSubmitting ? 'Updating...' : 'Update'}
          </Button>
        </div>
      </form>
    </ComponentCard>
  )
}

export default SocialMediaSettingsCard
