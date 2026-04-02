import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'

import {
  operatingProviderFormSchema,
  OperatingProviderFormValues,
} from '@/lib/operating-provider'

import Input from '@/components/form/input/InputField'
import TextArea from '@/components/form/input/TextArea'
import Label from '@/components/form/Label'
import Button from '@/components/ui/button/Button'
import { Modal } from '@/components/ui/modal'

import { IOperatingProvider } from '@/types/operating-provider'

const ProviderSettingModal = ({
  isOpen,
  closeModal,
  onSubmit,
  selectedProvider,
}: {
  selectedProvider: IOperatingProvider
  isOpen: boolean
  closeModal: () => void
  onSubmit: (data: OperatingProviderFormValues) => Promise<boolean>
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
    reset,
  } = useForm<OperatingProviderFormValues>({
    resolver: zodResolver(operatingProviderFormSchema),
    defaultValues: {
      name: selectedProvider?.name || '',
      description: selectedProvider?.description || '',
    },
  })

  const handleOnSubmit = async (data: OperatingProviderFormValues) => {
    const isSuccess = await onSubmit(data)
    if (isSuccess) {
      reset()
      closeModal()
    }
  }

  useEffect(() => {
    if (selectedProvider) {
      reset({
        name: selectedProvider.name,
        description: selectedProvider.description,
      })
    } else {
      reset({
        name: '',
        description: '',
      })
    }
  }, [selectedProvider, reset])

  return (
    <Modal isOpen={isOpen} onClose={closeModal} className='m-4 max-w-[700px]'>
      <div className='no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 lg:p-11 dark:bg-gray-900'>
        <div className='px-2 pr-14'>
          <h4 className='mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90'>
            Add Provider
          </h4>
        </div>

        <form className='flex flex-col' onSubmit={handleSubmit(handleOnSubmit)}>
          <div className='custom-scrollbar overflow-y-auto px-2 pb-3'>
            <div className='mt-7'>
              <div className='grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2'>
                {/* Name */}
                <div className='col-span-2'>
                  <Label>Provider Name</Label>
                  <Controller
                    name='name'
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type='text'
                        error={Boolean(errors.name?.message)}
                        errorMessage={errors.name?.message || ''}
                      />
                    )}
                  />
                </div>
                {/* Description */}
                <div className='col-span-2'>
                  <Label>Description</Label>
                  <Controller
                    name='description'
                    control={control}
                    render={({ field }) => (
                      <TextArea
                        {...field}
                        error={Boolean(errors.description?.message)}
                        rows={3}
                        hint={errors.description?.message || ''}
                      />
                    )}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className='mt-6 flex items-center gap-3 px-2 lg:justify-end'>
            <Button
              size='sm'
              variant='outline'
              type='button'
              onClick={closeModal}
            >
              Close
            </Button>
            <Button disabled={!isDirty || isSubmitting} size='sm' type='submit'>
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  )
}

export default ProviderSettingModal
