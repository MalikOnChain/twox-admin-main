'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { WheelBonus } from '@/api/wheelBonus'

import Input from '@/components/form/input/InputField'
import Label from '@/components/form/Label'
import Switch from '@/components/form/switch/Switch'
import Button from '@/components/ui/button/Button'
import { Modal } from '@/components/ui/modal'

const wheelBonusSchema = z.object({
  status: z.enum(['active', 'inactive']),
  wheelBonusAmounts: z.tuple([
    z.number().min(0, 'Amount must be positive'),
    z.number().min(0, 'Amount must be positive'),
    z.number().min(0, 'Amount must be positive'),
    z.number().min(0, 'Amount must be positive'),
    z.number().min(0, 'Amount must be positive'),
    z.number().min(0, 'Amount must be positive'),
    z.number().min(0, 'Amount must be positive'),
    z.number().min(0, 'Amount must be positive'),
  ]),
  wheelBonusWeights: z.tuple([
    z.number().min(0, 'Weight must be positive'),
    z.number().min(0, 'Weight must be positive'),
    z.number().min(0, 'Weight must be positive'),
    z.number().min(0, 'Weight must be positive'),
    z.number().min(0, 'Weight must be positive'),
    z.number().min(0, 'Weight must be positive'),
    z.number().min(0, 'Weight must be positive'),
    z.number().min(0, 'Weight must be positive'),
  ]),
  validFrom: z.string().min(1, 'Valid from date is required'),
  validTo: z.string().min(1, 'Valid to date is required'),
})

type WheelBonusFormValues = z.infer<typeof wheelBonusSchema>

type WheelBonusSettingModalProps = {
  isOpen: boolean
  closeModal: () => void
  selectedWheelBonus:
    | (Omit<WheelBonus, 'status'> & { status: 'active' | 'inactive' })
    | null
  onSubmit: (data: WheelBonusFormValues) => Promise<boolean>
}

export default function WheelBonusSettingModal({
  isOpen,
  closeModal,
  selectedWheelBonus,
  onSubmit,
}: WheelBonusSettingModalProps) {
  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<WheelBonusFormValues>({
    resolver: zodResolver(wheelBonusSchema),
    defaultValues: {
      status: selectedWheelBonus?.status ?? 'active',
      wheelBonusAmounts: selectedWheelBonus?.wheelBonusAmounts ?? [
        0, 0, 0, 0, 0, 0, 0, 0,
      ],
      wheelBonusWeights: selectedWheelBonus?.wheelBonusWeights ?? [
        0, 0, 0, 0, 0, 0, 0, 0,
      ],
      validFrom: selectedWheelBonus?.validFrom ?? new Date().toISOString(),
      validTo:
        selectedWheelBonus?.validTo ??
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
  })

  const handleFormSubmit = async (data: WheelBonusFormValues) => {
    const success = await onSubmit(data)
    if (success) {
      closeModal()
    }
  }

  const handleAmountChange = (index: number, value: string) => {
    const numValue = parseFloat(value) || 0
    setValue(`wheelBonusAmounts.${index}`, numValue)
  }

  const handleWeightChange = (index: number, value: string) => {
    const numValue = parseFloat(value) || 0
    setValue(`wheelBonusWeights.${index}`, numValue)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      className='max-w-[800px] p-6 lg:p-10'
    >
      <div className='mb-6'>
        <h4 className='text-2xl font-semibold text-gray-800 dark:text-white/90'>
          {selectedWheelBonus ? 'Edit Wheel Bonus' : 'Create Wheel Bonus'}
        </h4>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className='space-y-6'>
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
          <div className='flex items-center justify-end'>
            <Switch
              label={watch('status') === 'active' ? 'Active' : 'Inactive'}
              defaultChecked={watch('status') === 'active'}
              onChange={(checked) =>
                setValue('status', checked ? 'active' : 'inactive', {
                  shouldValidate: true,
                })
              }
            />
          </div>
        </div>

        <div className='space-y-4'>
          <h5 className='text-lg font-medium text-gray-700 dark:text-gray-200'>
            Bonus Amounts
          </h5>
          <div className='grid grid-cols-4 gap-4'>
            {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => (
              <div key={index}>
                <Label>Bonus {index + 1}</Label>
                <Input
                  type='number'
                  min='0'
                  value={String(watch(`wheelBonusAmounts.${index}`))}
                  onChange={(e) => handleAmountChange(index, e.target.value)}
                  error={Boolean(errors.wheelBonusAmounts?.[index])}
                  errorMessage={errors.wheelBonusAmounts?.[index]?.message}
                />
              </div>
            ))}
          </div>
        </div>

        <div className='space-y-4'>
          <h5 className='text-lg font-medium text-gray-700 dark:text-gray-200'>
            Bonus Weights
          </h5>
          <div className='grid grid-cols-4 gap-4'>
            {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => (
              <div key={index}>
                <Label>Weight {index + 1}</Label>
                <Input
                  type='number'
                  min='0'
                  step={0.01}
                  value={String(watch(`wheelBonusWeights.${index}`))}
                  onChange={(e) => handleWeightChange(index, e.target.value)}
                  error={Boolean(errors.wheelBonusWeights?.[index])}
                  errorMessage={errors.wheelBonusWeights?.[index]?.message}
                />
              </div>
            ))}
          </div>
        </div>

        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
          <div>
            <Label>Valid From</Label>
            <Input
              type='datetime-local'
              value={new Date(watch('validFrom')).toISOString().slice(0, 16)}
              onChange={(e) =>
                setValue('validFrom', new Date(e.target.value).toISOString())
              }
              error={Boolean(errors.validFrom)}
              errorMessage={errors.validFrom?.message}
            />
          </div>

          <div>
            <Label>Valid To</Label>
            <Input
              type='datetime-local'
              value={new Date(watch('validTo')).toISOString().slice(0, 16)}
              onChange={(e) =>
                setValue('validTo', new Date(e.target.value).toISOString())
              }
              error={Boolean(errors.validTo)}
              errorMessage={errors.validTo?.message}
            />
          </div>
        </div>

        <div className='mt-8 flex w-full items-center justify-end gap-3'>
          <Button
            type='button'
            size='sm'
            variant='outline'
            onClick={closeModal}
          >
            Cancel
          </Button>
          <Button type='submit' size='sm' disabled={isSubmitting}>
            {selectedWheelBonus ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
