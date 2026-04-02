import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'

import Input from '@/components/form/input/InputField'
import TextArea from '@/components/form/input/TextArea'
import Label from '@/components/form/Label'
import Select from '@/components/form/Select'
import Button from '@/components/ui/button/Button'
import { Modal } from '@/components/ui/modal'

import {
  ReferralUserReward,
  ReferralUserRewardFormSchema,
  ReferralUserRewardFormValues,
  RewardStatus,
  RewardStatusOptions,
} from '@/types/referral-reward'

const ReferralRewardSettingModal = ({
  isOpen,
  closeModal,
  onSubmit,
  selectedReferralUserReward,
}: {
  selectedReferralUserReward: ReferralUserReward
  isOpen: boolean
  closeModal: () => void
  onSubmit: (data: ReferralUserRewardFormValues) => Promise<boolean>
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
    reset,
  } = useForm<ReferralUserRewardFormValues>({
    resolver: zodResolver(ReferralUserRewardFormSchema),
    defaultValues: {
      name: selectedReferralUserReward?.name || '',
      amount: selectedReferralUserReward?.amount || 0,
      description: selectedReferralUserReward?.description || '',
      requiredReferralCount:
        selectedReferralUserReward?.requiredReferralCount || 5,
      status: selectedReferralUserReward?.status || RewardStatus.ACTIVE,
    },
  })

  const handleOnSubmit = async (data: ReferralUserRewardFormValues) => {
    const isSuccess = await onSubmit(data)
    if (isSuccess) {
      reset()
      closeModal()
    }
  }

  useEffect(() => {
    if (selectedReferralUserReward) {
      reset({
        name: selectedReferralUserReward.name,
        amount: selectedReferralUserReward.amount,
        description: selectedReferralUserReward.description,
        requiredReferralCount: selectedReferralUserReward.requiredReferralCount,
        status: selectedReferralUserReward.status,
      })
    } else {
      reset({
        name: '',
        amount: 0,
        description: '',
        requiredReferralCount: 0,
        status: RewardStatus.ACTIVE,
      })
    }
  }, [selectedReferralUserReward, reset])

  return (
    <Modal isOpen={isOpen} onClose={closeModal} className='m-4 max-w-[700px]'>
      <div className='no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 lg:p-11 dark:bg-gray-900'>
        <div className='px-2 pr-14'>
          <h4 className='mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90'>
            {selectedReferralUserReward ? 'Edit' : 'Add'} Reward
          </h4>
        </div>

        <form className='flex flex-col' onSubmit={handleSubmit(handleOnSubmit)}>
          <div className='custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3'>
            <div className='mt-7'>
              <div className='grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2'>
                {/* ReferralUserReward Name */}
                <div className='col-span-2'>
                  <Label>Reward Name</Label>
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
                <div className='col-span-2'>
                  <Label>Reward Amount</Label>
                  <Controller
                    name='amount'
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type='number'
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        error={Boolean(errors.amount?.message)}
                        errorMessage={errors.amount?.message || ''}
                      />
                    )}
                  />
                </div>
                {/* ReferralUserReward Description */}
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
                {/* requiredReferralCount */}
                <div className='col-span-2 lg:col-span-1'>
                  <Label>Count of Required Referral Users</Label>
                  <Controller
                    name='requiredReferralCount'
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type='number'
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        error={Boolean(errors.requiredReferralCount?.message)}
                        errorMessage={
                          errors.requiredReferralCount?.message || ''
                        }
                      />
                    )}
                  />
                </div>
                {/* Status */}
                <div className='col-span-2 lg:col-span-1'>
                  <Label>Status</Label>
                  <Controller
                    name='status'
                    control={control}
                    render={({ field }) => (
                      <Select
                        options={RewardStatusOptions.map((option) => ({
                          value: String(option.value),
                          label: option.label,
                        }))}
                        placeholder='Select status'
                        defaultValue={String(field.value)}
                        onChange={(value) => field.onChange(Number(value))}
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

export default ReferralRewardSettingModal
