'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { useAuth } from '@/context/AuthContext'

import { apikeyFormSchema, ApikeyFormValues } from '@/lib/apikey'

import LoadingSpinner from '@/components/common/LoadingSpinner'
import DatePicker from '@/components/form/date-picker'
import Input from '@/components/form/input/InputField'
import Label from '@/components/form/Label'
import Select from '@/components/form/Select'
import Switch from '@/components/form/switch/Switch'
import Button from '@/components/ui/button/Button'
import { Modal } from '@/components/ui/modal'

import {
  APIKeysFilterOptions,
  IApikeyData,
  scopeFilterOptions,
} from '@/types/apikey'

const ApikeyDetailModal = ({
  isOpen,
  closeModal,
  detail,
  onSubmit,
}: {
  isOpen: boolean
  closeModal?: () => void
  detail?: IApikeyData
  onSubmit: (data: ApikeyFormValues) => Promise<boolean>
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [detailInfo, setDetailInfo] = useState<IApikeyData | null>(null)
  const { user } = useAuth()
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ApikeyFormValues>({
    resolver: zodResolver(apikeyFormSchema),
    defaultValues: {
      name: detail?.name || '',
      label: detail?.label || '',
      apiKey: detail?.apiKey || '',
      status: detail?.status || true,
      expiryDate: detail?.expiryDate || new Date(),
      scope: detail?.scope || APIKeysFilterOptions.MainFrontEnd,
      createdBy: detail?.createdBy || user._id,
    },
  })

  useEffect(() => {
    if (isOpen) {
      setDetailInfo(detail)
      if (detail) {
        reset({
          name: detail?.name,
          label: detail?.label,
          apiKey: detail?.apiKey,
          scope: detail?.scope,
          status: detail?.status,
          expiryDate: detail?.expiryDate
            ? new Date(detail.expiryDate)
            : new Date(),
          createdBy: detail?.createdBy,
        })
      } else {
        reset({
          name: '',
          label: '',
          apiKey: '',
          status: true,
          expiryDate: new Date(),
          scope: APIKeysFilterOptions.MainFrontEnd,
          createdBy: detail?.createdBy || '',
        })
      }
    }
  }, [detail, isOpen, reset])

  // Submit API Key
  const handleOnSubmit = async (data: IApikeyData) => {
    setIsLoading(true)
    try {
      const isSuccess = await onSubmit(data)
      if (isSuccess) {
        reset()
        handleClose()
      }
    } catch (error) {
      console.error('Error submitting API Key:', error)
      toast.error('Failed to save API Key')
    } finally {
      setIsLoading(false)
    }
  }

  // Close modal
  const handleClose = () => {
    reset({
      name: '',
      label: '',
      apiKey: '',
      status: true,
      expiryDate: new Date(),
      createdBy: detail?.createdBy || '',
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
                  {detailInfo?._id ? 'Update' : 'Add'} API Key
                </h4>
              </div>
              <div className='divide-y divide-gray-600'>
                {/* Common API keys info */}
                <div className='grid grid-cols-1 gap-6 pb-4'>
                  {/* Expiry Date */}
                  <div>
                    <Label>Expiry Date</Label>
                    <Controller
                      name='expiryDate'
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          id='date-from'
                          placeholder='Expiry Date'
                          defaultDate={field.value}
                          onChange={(value) => {
                            const selectedDate = Array.isArray(value)
                              ? value[0]
                              : value
                            field.onChange(selectedDate)
                          }}
                        />
                      )}
                    />
                  </div>
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
                          onChange={(e) => {
                            field.onChange(e.target.value)
                            setValue('createdBy', user._id)
                          }}
                          error={Boolean(errors.name?.message)}
                          errorMessage={errors.name?.message || ''}
                        />
                      )}
                    />
                  </div>

                  {/* Label */}
                  <div>
                    <Label>Label</Label>
                    <Controller
                      name='label'
                      control={control}
                      render={({ field }) => (
                        <Input
                          type='text'
                          placeholder='Label'
                          value={field.value}
                          onChange={field.onChange}
                          error={Boolean(errors.label?.message)}
                          errorMessage={errors.label?.message || ''}
                        />
                      )}
                    />
                  </div>
                  {/* API Key */}
                  <div>
                    <Label>API Key</Label>
                    <Controller
                      name='apiKey'
                      control={control}
                      render={({ field }) => (
                        <Input
                          type='text'
                          min={0}
                          placeholder='API Key'
                          value={field.value}
                          onChange={field.onChange}
                          error={Boolean(errors.apiKey?.message)}
                          errorMessage={errors.apiKey?.message || ''}
                        />
                      )}
                    />
                  </div>
                  {/* Status */}
                  <div className='flex gap-8'>
                    <Label>Status</Label>
                    <Controller
                      name='status'
                      control={control}
                      render={({ field }) => (
                        <Switch
                          label=''
                          defaultChecked={field.value}
                          onChange={(value) => {
                            field.onChange(value)
                          }}
                        />
                      )}
                    />
                  </div>
                  {/* Scope */}
                  <div>
                    <Label>Scope</Label>
                    <Controller
                      name='scope'
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          defaultValue={field.value || ''}
                          options={scopeFilterOptions}
                          error={Boolean(errors.scope?.message)}
                          errorMessage={errors.scope?.message || ''}
                        />
                      )}
                    />
                  </div>
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

export default ApikeyDetailModal
