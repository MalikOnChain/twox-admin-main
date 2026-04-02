'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import * as z from 'zod'

import ComponentCard from '@/components/common/ComponentCard'
import ToolTip from '@/components/common/ToolTip'
import Input from '@/components/form/input/InputField'
import Label from '@/components/form/Label'
import Button from '@/components/ui/button/Button'

import { InfoIcon } from '@/icons'

import { SiteSettings } from '@/types/site-settings'

// Define the form schema
const createFormSchema = () => {
  return z
    .object({
      depositMinAmount: z.coerce
        .number()
        .min(0, 'Minimum deposit amount must be at least 0'),
      withdrawMinAmount: z.coerce
        .number()
        .min(0, 'Minimum withdrawal amount must be at least 0'),
      withdrawMaxAmount: z.coerce
        .number()
        .min(0, 'Maximum withdrawal amount must be at least 0'),
      withdrawWagerMultiplier: z.coerce
        .number()
        .min(0, 'Withdrawal wager multiplier must be at least 0'),
      xpSetting: z.object({
        status: z.string(),
        depositXpAmount: z
          .number()
          .min(1, 'Deposit XP amount must be at least 0'),
        wagerXpSetting: z.array(
          z.object({
            wagerXpAmount: z
              .number()
              .min(1, 'Wager XP amount must be at least 0'),
            gameCategory: z.string(),
          })
        ),
      }),
    })
    .superRefine((data, ctx) => {
      // Custom validation between min and max withdrawal amounts
      if (
        data.withdrawMaxAmount > 0 &&
        data.withdrawMaxAmount < data.withdrawMinAmount
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            'Maximum withdrawal amount must be greater than minimum withdrawal amount',
          path: ['withdrawMaxAmount'],
        })
      }

      const wagerXpAmounts = data.xpSetting.wagerXpSetting
        .map((wagerXpSetting) => wagerXpSetting.wagerXpAmount)
        .filter((amount) => !amount)

      wagerXpAmounts.forEach((_, index) => {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Wager XP amount must be greater than 0',
          path: ['xpSetting', 'wagerXpSetting', index, 'wagerXpAmount'],
        })
      })
    })
}

type FormValues = z.infer<ReturnType<typeof createFormSchema>>

interface DepositWithdrawSettingsCardProps {
  settings: Pick<
    SiteSettings,
    | 'depositMinAmount'
    | 'withdrawMinAmount'
    | 'withdrawMaxAmount'
    | 'withdrawWagerMultiplier'
  >
  onSubmit: (data: FormValues) => void
}

const DepositWithdrawSettingsCard = ({
  settings,
  onSubmit,
}: DepositWithdrawSettingsCardProps) => {
  // Create schema with initial values
  const formSchema = React.useMemo(() => createFormSchema(), [])

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      depositMinAmount: settings.depositMinAmount,
      withdrawMinAmount: settings.withdrawMinAmount,
      withdrawMaxAmount: settings.withdrawMaxAmount,
      withdrawWagerMultiplier: settings.withdrawWagerMultiplier,
    },
    mode: 'onChange',
  })

  useEffect(() => {
    reset(settings)
  }, [settings, reset])

  const onFormSubmit = handleSubmit(async (data: FormValues) => {
    await onSubmit(data)
    reset()
  })

  return (
    <ComponentCard title='Deposit & Withdraw Settings'>
      <form onSubmit={onFormSubmit} className='space-y-6'>
        <div>
          <Label htmlFor='depositMinAmount'>Deposit Min Amount</Label>
          <Controller
            name='depositMinAmount'
            control={control}
            render={({ field }) => (
              <Input
                id='depositMinAmount'
                type='number'
                value={field.value}
                onChange={(e) => {
                  field.onChange(Number(e.target.value))
                }}
                onBlur={field.onBlur}
                error={Boolean(errors.depositMinAmount?.message)}
                errorMessage={errors.depositMinAmount?.message}
              />
            )}
          />
        </div>

        <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
          <div>
            <Label htmlFor='withdrawMinAmount'>Withdraw Min Amount</Label>
            <Controller
              name='withdrawMinAmount'
              control={control}
              render={({ field }) => (
                <Input
                  id='withdrawMinAmount'
                  type='number'
                  value={field.value}
                  onChange={(e) => {
                    field.onChange(Number(e.target.value))
                  }}
                  onBlur={field.onBlur}
                  error={Boolean(errors.withdrawMinAmount?.message)}
                  errorMessage={errors.withdrawMinAmount?.message}
                />
              )}
            />
          </div>
          <div>
            <Label htmlFor='withdrawMaxAmount'>Withdraw Max Amount</Label>
            <Controller
              name='withdrawMaxAmount'
              control={control}
              render={({ field }) => (
                <Input
                  id='withdrawMaxAmount'
                  type='number'
                  value={field.value}
                  onChange={(e) => {
                    field.onChange(Number(e.target.value))
                  }}
                  onBlur={field.onBlur}
                  error={Boolean(errors.withdrawMaxAmount?.message)}
                  errorMessage={errors.withdrawMaxAmount?.message}
                />
              )}
            />
          </div>
          <div>
            <div className='flex gap-2'>
              <Label htmlFor='withdrawWagerMultiplier items-center'>
                Withdraw Wager Multiplier
              </Label>
              <ToolTip text='The multiplier for the withdrawal wager.'>
                <InfoIcon className='text-gray-500' />
              </ToolTip>
            </div>

            <Controller
              name='withdrawWagerMultiplier'
              control={control}
              render={({ field }) => (
                <Input
                  id='withdrawWagerMultiplier'
                  type='number'
                  value={field.value}
                  onChange={(e) => {
                    field.onChange(Number(e.target.value))
                  }}
                  onBlur={field.onBlur}
                  error={Boolean(errors.withdrawWagerMultiplier?.message)}
                  errorMessage={errors.withdrawWagerMultiplier?.message}
                />
              )}
            />
          </div>
        </div>

        <div className='flex justify-end'>
          <Button type='submit' size='sm' disabled={!isDirty || isSubmitting}>
            {isSubmitting ? 'Updating...' : 'Update'}
          </Button>
        </div>
      </form>
    </ComponentCard>
  )
}

export default DepositWithdrawSettingsCard
