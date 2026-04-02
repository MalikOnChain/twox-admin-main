'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import * as z from 'zod'
import { toast } from 'sonner'

import {
  getPaymentSettings,
  IPaymentSettings,
  updatePaymentSettings,
} from '@/api/payment-settings'
import { formatNumber } from '@/lib/utils'

import ComponentCard from '@/components/common/ComponentCard'
import Loading from '@/components/common/Loading'
import Button from '@/components/ui/button/Button'

import MethodLimitsSection from './admin-settings/MethodLimitsSection'
import DailyCapsSection from './admin-settings/DailyCapsSection'
import FeesSection from './admin-settings/FeesSection'
import ProcessingTiersSection from './admin-settings/ProcessingTiersSection'
import RegionAvailabilitySection from './admin-settings/RegionAvailabilitySection'
import VipOverridesSection from './admin-settings/VipOverridesSection'

// Form schema
const createFormSchema = () => {
  return z.object({
    paymentSettings: z.object({
      methodLimits: z
        .array(
          z.object({
            method: z.string(),
            currency: z.string(),
            depositMin: z.number().min(0),
            depositMax: z.number().min(0),
            withdrawMin: z.number().min(0),
            withdrawMax: z.number().min(0),
          })
        )
        .optional(),
      dailyCaps: z
        .object({
          depositCap: z.number().min(0),
          withdrawCap: z.number().min(0),
        })
        .optional(),
      fees: z
        .object({
          depositFeePercent: z.number().min(0).max(100),
          withdrawFeePercent: z.number().min(0).max(100),
          methodFees: z
            .array(
              z.object({
                method: z.string(),
                currency: z.string(),
                feePercent: z.number().min(0).max(100),
                fixedFee: z.number().min(0).optional(),
              })
            )
            .optional(),
        })
        .optional(),
      processingTiers: z
        .array(
          z.object({
            tier: z.string(),
            minAmount: z.number().min(0),
            maxAmount: z.number().min(0),
            processingTime: z.number().min(0),
            description: z.string().optional(),
          })
        )
        .optional(),
      regionAvailability: z
        .array(
          z.object({
            region: z.string(),
            methods: z.array(z.string()),
            enabled: z.boolean(),
          })
        )
        .optional(),
      vipOverrides: z
        .array(
          z.object({
            tierId: z.string(),
            tierName: z.string().optional(),
            methodLimits: z
              .array(
                z.object({
                  method: z.string(),
                  currency: z.string(),
                  depositMin: z.number().min(0).optional(),
                  depositMax: z.number().min(0).optional(),
                  withdrawMin: z.number().min(0).optional(),
                  withdrawMax: z.number().min(0).optional(),
                })
              )
              .optional(),
            fees: z
              .object({
                depositFeePercent: z.number().min(0).max(100).optional(),
                withdrawFeePercent: z.number().min(0).max(100).optional(),
              })
              .optional(),
            dailyCaps: z
              .object({
                depositCap: z.number().min(0).optional(),
                withdrawCap: z.number().min(0).optional(),
              })
              .optional(),
          })
        )
        .optional(),
    }),
  })
}

type FormValues = z.infer<ReturnType<typeof createFormSchema>>

export default function AdminPaymentSettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [settingsData, setSettingsData] = useState<any>(null)
  const [availableOptions, setAvailableOptions] = useState<any>(null)

  const formSchema = createFormSchema()
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      paymentSettings: {
        methodLimits: [],
        dailyCaps: { depositCap: 0, withdrawCap: 0 },
        fees: { depositFeePercent: 0, withdrawFeePercent: 0, methodFees: [] },
        processingTiers: [],
        regionAvailability: [],
        vipOverrides: [],
      },
    },
  })

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true)
      const data = await getPaymentSettings()
      setSettingsData(data)
      setAvailableOptions({
        methods: data.availableMethods,
        currencies: data.availableCurrencies,
        regions: data.availableRegions,
        vipTiers: data.vipTiers,
      })

      // Set default values from backend
      reset({
        paymentSettings: {
          methodLimits: data.paymentSettings?.methodLimits || [],
          dailyCaps: data.paymentSettings?.dailyCaps || {
            depositCap: 0,
            withdrawCap: 0,
          },
          fees: data.paymentSettings?.fees || {
            depositFeePercent: 0,
            withdrawFeePercent: 0,
            methodFees: [],
          },
          processingTiers: data.paymentSettings?.processingTiers || [],
          regionAvailability: data.paymentSettings?.regionAvailability || [],
          vipOverrides: data.paymentSettings?.vipOverrides || [],
        },
      })
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Error fetching payment settings')
      }
    } finally {
      setLoading(false)
    }
  }, [reset])

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  const handleSave = handleSubmit(async (data) => {
    try {
      setSaving(true)
      await updatePaymentSettings(data.paymentSettings)
      toast.success('Payment settings updated successfully')
      await fetchSettings()
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Failed to save payment settings')
      }
    } finally {
      setSaving(false)
    }
  })

  if (loading) {
    return <Loading />
  }

  if (!settingsData || !availableOptions) {
    return (
      <div className='space-y-6'>
        <ComponentCard title='Admin-Only Payment Settings'>
          <p className='text-gray-500 dark:text-gray-400'>Failed to load payment settings</p>
        </ComponentCard>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      <ComponentCard title='Admin-Only Payment Settings'>
        <form onSubmit={handleSave} className='space-y-6'>
          <MethodLimitsSection
            control={control}
            availableOptions={availableOptions}
            defaultDepositMin={settingsData.depositMinAmount || 0}
            defaultWithdrawMin={settingsData.withdrawMinAmount || 0}
            defaultWithdrawMax={settingsData.withdrawMaxAmount || 0}
          />

          <DailyCapsSection control={control} />

          <FeesSection control={control} availableOptions={availableOptions} />

          <ProcessingTiersSection control={control} />

          <RegionAvailabilitySection control={control} availableOptions={availableOptions} />

          <VipOverridesSection control={control} availableOptions={availableOptions} />

          <div className='flex justify-end'>
            <Button type='submit' disabled={!isDirty || saving}>
              {saving ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </form>
      </ComponentCard>
    </div>
  )
}
