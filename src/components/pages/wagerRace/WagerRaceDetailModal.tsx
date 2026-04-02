import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { generateReferralCode } from '@/api/tier-affiliate'

import { formatDate } from '@/lib/utils'
import {
  delayTypeOptions,
  eligibleGamesOptions,
  participantTypeOptions,
  payoutTypeOptions,
  prizeTypeOptions,
  statusOptions,
  wagerRaceFormSchema,
  WagerRaceFormValues,
} from '@/lib/wager-race'

import Input from '@/components/form/input/InputField'
import TextArea from '@/components/form/input/TextArea'
import Label from '@/components/form/Label'
import MultiSelect from '@/components/form/MultiSelect'
import Select from '@/components/form/Select'
import Button from '@/components/ui/button/Button'
import { Modal } from '@/components/ui/modal'

import { ITierData } from '@/types/tier'
import {
  DELAY_TYPE,
  IWagerRace,
  PARTICIPANT_TYPE,
  PAYOUT_TYPE,
  PRIZE_TYPE,
  WAGER_RACE_STATUS,
} from '@/types/wagerRace'

const WagerRaceDetailModal = ({
  isOpen,
  closeModal,
  selectedWagerRace,
  onSubmit,
  options,
}: {
  selectedWagerRace: IWagerRace | null
  isOpen: boolean
  closeModal: () => void
  onSubmit: (data: WagerRaceFormValues) => Promise<boolean>
  options: {
    tiers: ITierData[]
  }
}) => {
  const [tiersOptions, setTiersOptions] = useState([])
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isDirty, isSubmitting },
    reset,
    setValue,
    getValues,
    setError,
  } = useForm<WagerRaceFormValues>({
    resolver: zodResolver(wagerRaceFormSchema),
    defaultValues: {
      title: selectedWagerRace?.title || '',
      description: selectedWagerRace?.description || '',
      minWager: selectedWagerRace?.minWager || 0,
      eligibleGames: selectedWagerRace?.eligibleGames || [],
      prize: selectedWagerRace?.prize || {
        type: PRIZE_TYPE.FIXED,
        amounts: [0],
      },
      status: selectedWagerRace?.status || WAGER_RACE_STATUS.SCHEDULED,
      participants: selectedWagerRace?.participants || {
        type: PARTICIPANT_TYPE.ALL,
        code: '',
        tiers: [],
      },
      period: selectedWagerRace?.period || {
        start: '',
        end: '',
      },
      payoutType: selectedWagerRace?.payoutType || PAYOUT_TYPE.AUTO,
      delay: selectedWagerRace?.delay || {
        type: DELAY_TYPE.HOUR,
        value: 0,
      },
    },
  })

  const participants = watch('participants.type')
  const payoutType = watch('payoutType')

  useEffect(() => {
    if (isOpen) {
      setTiersOptions(
        options?.tiers.map((tier: ITierData) => ({
          value: tier._id,
          text: tier.name,
        })) || []
      )
      if (selectedWagerRace) {
        reset({
          title: selectedWagerRace.title,
          description: selectedWagerRace.description,
          minWager: selectedWagerRace.minWager,
          eligibleGames: selectedWagerRace.eligibleGames,
          prize: selectedWagerRace.prize,
          status: selectedWagerRace.status,
          participants: selectedWagerRace.participants,
          period: selectedWagerRace.period || {
            start: '',
            end: '',
          },
          payoutType: selectedWagerRace.payoutType || PAYOUT_TYPE.AUTO,
          delay: selectedWagerRace.delay || {
            type: DELAY_TYPE.HOUR,
            value: 0,
          },
        })
      } else {
        reset({
          title: '',
          description: '',
          minWager: 0,
          eligibleGames: [],
          prize: {
            type: PRIZE_TYPE.FIXED,
            amounts: [0],
          },
          status: WAGER_RACE_STATUS.SCHEDULED,
          participants: {
            type: PARTICIPANT_TYPE.ALL,
            code: '',
            tiers: [],
          },
          period: {
            start: '',
            end: '',
          },
          payoutType: PAYOUT_TYPE.AUTO,
          delay: {
            type: DELAY_TYPE.HOUR,
            value: 0,
          },
        })
      }
    }
  }, [selectedWagerRace, reset, isOpen, options])

  // console.log('errors', errors)
  // console.log('watch', watch())

  const handleOnSubmit = async (data: WagerRaceFormValues) => {
    if (!selectedWagerRace) {
      if (data.status === WAGER_RACE_STATUS.COMPLETED) {
        setError(
          'status',
          {
            message: 'Newly created wager race cannot be set as completed',
          },
          { shouldFocus: true }
        )
        return
      }
    }

    if (data.period.start < new Date().toISOString().split('T')[0]) {
      setError(
        'period.start',
        { message: 'Valid from cannot be in the past' },
        { shouldFocus: true }
      )
      return
    }

    const isSuccess = await onSubmit(data)
    if (isSuccess) {
      reset()
      closeModal()
    }
  }

  const handleGenerateReferralCode = async () => {
    try {
      const code = await generateReferralCode()
      setValue('participants.code', code, { shouldDirty: true })
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message)
      } else {
        toast.error('Error generating referral code')
      }
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={closeModal} className='m-4 max-w-[700px]'>
      <div className='no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 lg:p-11 dark:bg-gray-900'>
        <div className='px-2 pr-14'>
          <h4 className='mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90'>
            {selectedWagerRace ? 'Update' : 'Add'} Wager Race
          </h4>
        </div>

        <form className='flex flex-col' onSubmit={handleSubmit(handleOnSubmit)}>
          <div className='custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3'>
            <div className='mt-7'>
              <div className='grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2'>
                {/* Bonus Name */}
                <div className='col-span-2'>
                  <Label>Title</Label>
                  <Controller
                    name='title'
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type='text'
                        error={Boolean(errors.title?.message)}
                        errorMessage={errors.title?.message || ''}
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

                {/* Min Wager */}
                <div className='col-span-2'>
                  <Label>Min Wager</Label>
                  <Controller
                    name='minWager'
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type='number'
                        min={0}
                        error={Boolean(errors.minWager?.message)}
                        errorMessage={errors.minWager?.message || ''}
                        onChange={(e) => {
                          field.onChange(Number(e.target.value))
                        }}
                      />
                    )}
                  />
                </div>

                {/* Prize */}
                <div className='col-span-2'>
                  <Label>Prize Type</Label>
                  <Controller
                    name='prize.type'
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={prizeTypeOptions}
                        defaultValue={field.value}
                        onChange={(e) => {
                          field.onChange(e)
                          setValue('prize.amounts', [0])
                        }}
                      />
                    )}
                  />
                  {errors.prize?.type && (
                    <p className='mt-1 text-xs text-red-500'>
                      {errors.prize.message}
                    </p>
                  )}
                </div>

                <div className='col-span-2'>
                  <Label>
                    <span className='mr-2'>Prize Amounts</span>
                    <Button
                      size='sm'
                      variant='outline'
                      type='button'
                      className='mr-2 !p-2 leading-1.5'
                      onClick={() => {
                        const newPrizeAmounts = [
                          ...getValues('prize.amounts'),
                          0,
                        ]
                        setValue('prize.amounts', newPrizeAmounts, {
                          shouldDirty: true,
                        })
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
                        if (getValues('prize.amounts').length > 1) {
                          const newPrizeAmounts = getValues(
                            'prize.amounts'
                          ).slice(0, -1)
                          setValue('prize.amounts', newPrizeAmounts, {
                            shouldDirty: true,
                          })
                        }
                      }}
                    >
                      -
                    </Button>
                  </Label>
                  <Controller
                    name='prize.amounts'
                    control={control}
                    render={({ field }) => (
                      <div className='flex w-full flex-col gap-1'>
                        {getValues('prize.amounts').map((_, index) => {
                          return (
                            <div
                              key={index}
                              className='flex w-full items-center gap-2'
                            >
                              <Label className='!m-0'>{index + 1}.</Label>
                              <Input
                                type='number'
                                min={0}
                                rootClassName='w-full'
                                value={field.value[index] || 0}
                                onChange={(e) => {
                                  const newPrizeAmounts = [
                                    ...getValues('prize.amounts'),
                                  ]
                                  newPrizeAmounts[index] = Number(
                                    e.target.value
                                  )
                                  field.onChange(newPrizeAmounts)
                                }}
                                error={Boolean(
                                  errors.prize?.amounts?.[index]?.message
                                )}
                                errorMessage={
                                  errors.prize?.amounts?.[index]?.message || ''
                                }
                              />
                            </div>
                          )
                        })}
                      </div>
                    )}
                  />
                  {errors.prize?.amounts && (
                    <p className='mt-1 text-xs text-red-500'>
                      {errors.prize.amounts.message}
                    </p>
                  )}
                </div>

                {/* Eligible Games */}
                <div className='col-span-2'>
                  <Controller
                    name='eligibleGames'
                    control={control}
                    render={({ field }) => (
                      <MultiSelect
                        className='z-[22]'
                        label='Eligible Games'
                        options={eligibleGamesOptions.map((option) => ({
                          value: option.value,
                          text: option.label,
                          selected:
                            field.value?.includes(option.value) || false,
                        }))}
                        defaultSelected={field.value.map((option) =>
                          option.toString()
                        )}
                        onChange={(selected) => {
                          field.onChange(selected)
                        }}
                      />
                    )}
                  />
                  {errors.eligibleGames && (
                    <p className='mt-1 text-xs text-red-500'>
                      {errors.eligibleGames.message}
                    </p>
                  )}
                </div>

                {/* Participants */}
                <div className='col-span-2'>
                  <Label>Participants</Label>
                  <Controller
                    name='participants'
                    control={control}
                    render={({ field }) => (
                      <Select
                        options={participantTypeOptions}
                        defaultValue={field.value.type}
                        onChange={(e) => {
                          setValue('participants.type', e, {
                            shouldDirty: true,
                          })
                          setValue('participants.tiers', [])
                          setValue('participants.code', '')
                        }}
                      />
                    )}
                  />
                </div>
                {participants !== PARTICIPANT_TYPE.ALL && (
                  <div className='col-span-2'>
                    {participants === PARTICIPANT_TYPE.RANK && (
                      <>
                        <Controller
                          name='participants.tiers'
                          control={control}
                          render={({ field }) => (
                            <MultiSelect
                              className='z-[21]'
                              label='Tiers'
                              options={tiersOptions.map((option) => ({
                                value: option.value,
                                text: option.text,
                                selected:
                                  field.value.includes(option.value) || false,
                              }))}
                              defaultSelected={field.value.map((option) =>
                                option.toString()
                              )}
                              onChange={(selected) => {
                                field.onChange(selected)
                              }}
                            />
                          )}
                        />
                        {errors.participants?.tiers && (
                          <p className='mt-1 text-xs text-red-500'>
                            {errors.participants?.tiers?.message}
                          </p>
                        )}
                      </>
                    )}
                    {participants === PARTICIPANT_TYPE.INVITE && (
                      <>
                        <Label>Code</Label>
                        <Controller
                          name='participants.code'
                          control={control}
                          render={({ field }) => (
                            <div className='flex items-center gap-6'>
                              <Input
                                {...field}
                                type='text'
                                rootClassName='w-[50%]'
                                value={field.value}
                                disabled
                                error={Boolean(
                                  errors.participants?.code?.message
                                )}
                                errorMessage={
                                  errors.participants?.code?.message || ''
                                }
                              />
                              <Button
                                className='w-[50%] !px-4 !py-3'
                                onClick={handleGenerateReferralCode}
                              >
                                Generate Code
                              </Button>
                            </div>
                          )}
                        />
                      </>
                    )}
                  </div>
                )}

                {/* Payout */}
                <div className='col-span-2'>
                  <Label>Payout Type</Label>
                  <Controller
                    name='payoutType'
                    control={control}
                    render={({ field }) => (
                      <Select
                        options={payoutTypeOptions}
                        placeholder='Select payout type'
                        defaultValue={field.value}
                        onChange={(e) => {
                          field.onChange(e)
                          setValue('delay.value', 0, {
                            shouldDirty: true,
                          })
                          setValue('delay.type', DELAY_TYPE.HOUR, {
                            shouldDirty: true,
                          })
                        }}
                      />
                    )}
                  />
                </div>

                {payoutType === PAYOUT_TYPE.MANUAL && (
                  <>
                    {/* Delay */}
                    <div className='col-span-2'>
                      <Label>Delay Type</Label>
                      <Controller
                        name='delay.type'
                        control={control}
                        render={({ field }) => (
                          <Select
                            options={delayTypeOptions}
                            placeholder='Select delay type'
                            defaultValue={field.value}
                            onChange={(e) => {
                              field.onChange(e)
                              setValue('delay.value', 0, {
                                shouldDirty: true,
                              })
                            }}
                          />
                        )}
                      />
                    </div>

                    <div className='col-span-2'>
                      <Label>Delay Value</Label>
                      <Controller
                        name='delay.value'
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            type='number'
                            value={field.value}
                            min={0}
                            error={Boolean(errors.delay?.value?.message)}
                            errorMessage={errors.delay?.value?.message || ''}
                            onChange={(e) => {
                              field.onChange(Number(e.target.value))
                            }}
                          />
                        )}
                      />
                    </div>
                  </>
                )}

                {/* Valid From */}
                <div className='col-span-2 lg:col-span-1'>
                  <Label>Valid From</Label>
                  <Controller
                    name='period.start'
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type='date'
                        value={formatDate(field.value.toString())}
                        onChange={(e) => {
                          field.onChange(formatDate(e.target.value))
                        }}
                        error={Boolean(errors.period?.start?.message)}
                        errorMessage={errors.period?.start?.message || ''}
                      />
                    )}
                  />
                </div>

                {/* Valid To */}
                <div className='col-span-2 flex items-start gap-2 lg:col-span-1'>
                  <div className='w-full'>
                    <Label>Valid To</Label>
                    <Controller
                      name='period.end'
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type='date'
                          value={formatDate(field.value.toString())}
                          onChange={(e) => {
                            field.onChange(formatDate(e.target.value))
                          }}
                          error={Boolean(errors.period?.end?.message)}
                          errorMessage={errors.period?.end?.message || ''}
                        />
                      )}
                    />
                  </div>
                </div>

                {/* Status */}
                <div className='col-span-2'>
                  <Label>Status</Label>
                  <Controller
                    name='status'
                    control={control}
                    render={({ field }) => (
                      <Select
                        options={statusOptions}
                        placeholder='Select status'
                        defaultValue={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />

                  {errors.status && (
                    <p className='mt-1 text-xs text-red-500'>
                      {errors.status?.message}
                    </p>
                  )}
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

export default WagerRaceDetailModal
