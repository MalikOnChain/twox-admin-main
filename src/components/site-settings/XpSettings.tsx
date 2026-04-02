'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import * as z from 'zod'

import ComponentCard from '@/components/common/ComponentCard'
import Input from '@/components/form/input/InputField'
import Label from '@/components/form/Label'
import Switch from '@/components/form/switch/Switch'
import Button from '@/components/ui/button/Button'

import { GAME_CATEGORIES } from '@/types/game'
import { SiteSettings } from '@/types/site-settings'
import { XPStatus, XPStatusLabel } from '@/types/xpSettings'

// Define the form schema
const createFormSchema = () => {
  return z
    .object({
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

interface XpSettingsCardProps {
  settings: Pick<SiteSettings, 'xpSetting'>
  onSubmit: (data: FormValues) => void
}

const XpSettingsCard = ({ settings, onSubmit }: XpSettingsCardProps) => {
  // Create schema with initial values
  const formSchema = React.useMemo(() => createFormSchema(), [])

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      xpSetting: settings.xpSetting,
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
    <ComponentCard title='XP Settings'>
      <form onSubmit={onFormSubmit} className='space-y-6'>
        {/* XP Settings */}
        <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
          {Object.entries(GAME_CATEGORIES).map(([key, value], index) => {
            if (value === GAME_CATEGORIES.CRASH) {
              return null
            }
            return (
              <div key={key}>
                <Label htmlFor={`wagerXpAmount-${key}`}>
                  Wager XP Multiplier for {value}
                </Label>
                <Controller
                  name={`xpSetting.wagerXpSetting.${index}.wagerXpAmount`}
                  control={control}
                  render={({ field }) => (
                    <Input
                      id={`wagerXpAmount-${key}`}
                      type='number'
                      min={0}
                      step={0.1}
                      value={field.value || 0}
                      onChange={(e) => {
                        field.onChange(Number(e.target.value))
                        setValue(
                          `xpSetting.wagerXpSetting.${index}.gameCategory`,
                          value
                        )
                      }}
                      onBlur={field.onBlur}
                      error={Boolean(
                        errors.xpSetting?.wagerXpSetting?.[index]?.wagerXpAmount
                          ?.message
                      )}
                      errorMessage={
                        errors.xpSetting?.wagerXpSetting?.[index]?.wagerXpAmount
                          ?.message
                      }
                    />
                  )}
                />
              </div>
            )
          })}
          <div>
            <Label htmlFor='depositXpAmount'>Deposit XP Multiplier</Label>
            <Controller
              name='xpSetting.depositXpAmount'
              control={control}
              render={({ field }) => (
                <Input
                  id='depositXpAmount'
                  type='number'
                  min={0}
                  step={0.1}
                  value={field.value || 0}
                  onChange={(e) => {
                    field.onChange(Number(e.target.value))
                  }}
                  onBlur={field.onBlur}
                  error={Boolean(errors.xpSetting?.depositXpAmount?.message)}
                  errorMessage={errors.xpSetting?.depositXpAmount?.message}
                />
              )}
            />
          </div>

          {/* <div>
            <Label htmlFor='lossXpAmount'>Loss XP Multiplier</Label>
            <Controller
              name='xpSetting.lossXpAmount'
              control={control}
              render={({ field }) => (
                <Input
                  id='lossXpAmount'
                  type='number'
                  min={0}
                  step={0.1}
                  value={field.value || 0}
                  onChange={(e) => {
                    field.onChange(Number(e.target.value))
                  }}
                  onBlur={field.onBlur}
                  error={Boolean(errors.xpSetting?.lossXpAmount?.message)}
                  errorMessage={errors.xpSetting?.lossXpAmount?.message}
                />
              )}
            />
          </div> */}
        </div>
        <div className='flex justify-end gap-2'>
          <div className='flex items-center'>
            {/* <Label htmlFor='xpSetting.status'>XP System Status</Label> */}
            <Controller
              name='xpSetting.status'
              control={control}
              render={({ field }) => (
                <Switch
                  label={XPStatusLabel[field.value]}
                  defaultChecked={field.value === XPStatus.ACTIVE}
                  onChange={(e) => {
                    field.onChange(e ? XPStatus.ACTIVE : XPStatus.INACTIVE)
                  }}
                />
              )}
            />
          </div>
          <Button type='submit' size='sm' disabled={!isDirty || isSubmitting}>
            {isSubmitting ? 'Updating...' : 'Update'}
          </Button>
        </div>
      </form>
    </ComponentCard>
  )
}

export default XpSettingsCard
