'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { createCashback, updateCashback } from '@/api/cashback'

import { CashbackFormValues, cashbackSchema } from '@/lib/cashback'

import ComponentCard from '@/components/common/ComponentCard'
import Loading from '@/components/common/Loading'
import Switch from '@/components/form/switch/Switch'
import Button from '@/components/ui/button/Button'
import { Modal } from '@/components/ui/modal'

import CashbackBasicInfo from './CashbackBasicInfo'
import CashbackTierSettings from './CashbackTierSettings'
import CashbackTypeSettings from './CashbackTypeSettings'

import { ICashbackData } from '@/types/cashback'
import { ITierData } from '@/types/tier'

const CashbackDetailModal = ({
  isOpen,
  closeModal,
  detail,
  setSelectedCashback,
  setIsEdit,
  tiers,
}: {
  isOpen: boolean
  closeModal?: () => void
  detail?: ICashbackData
  setSelectedCashback?: (cashback: ICashbackData) => void
  setIsEdit: (isEdit: boolean) => void
  tiers: ITierData[]
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [detailInfo, setDetailInfo] = useState<ICashbackData | null>(null)
  const [formatedTiers] = useState(() => {
    const tiersWithLevel = []
    tiers.forEach((tier) => {
      tier.levels.forEach((level) => {
        tiersWithLevel.push({ ...tier, tierLevel: level.name })
      })
    })
    return tiersWithLevel
  })

  // Initialize React Hook Form
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<CashbackFormValues>({
    resolver: zodResolver(cashbackSchema),
    defaultValues: {
      name: '',
      type: 0,
      tiers: formatedTiers.map((tier) => ({
        tierId: tier._id,
        tierName: tier.name,
        tierLevel: tier.tierLevel,
        percentage: 0,
        cap: { day: 0, week: 0, month: 0 },
        minWagering: 0,
      })),
      claimFrequency: {
        mode: 'instant',
        cooldown: 0,
      },
      default: {
        enabled: false,
        defaultPercentage: 0,
      },
      timeBoost: {
        enabled: false,
        from: null,
        to: null,
        allowedDays: [],
        defaultPercentage: 0,
      },
      gameSpecific: {
        enabled: false,
        multipliers: [],
      },
      status: 0,
      wagerMultiplier: 5,
    },
  })

  // Watch for type changes to conditionally render fields
  const cashbackType = watch('type')
  const claimFrequencyMode = watch('claimFrequency.mode')

  useEffect(() => {
    if (isOpen) {
      if (detail) {
        setDetailInfo(detail)
        reset(detail as CashbackFormValues)
      } else {
        setDetailInfo(null)
        reset({
          name: '',
          type: 0,
          tiers: formatedTiers.map((tier) => ({
            tierId: tier._id,
            tierName: tier.name,
            tierLevel: tier.tierLevel,
            percentage: 0,
            cap: { day: 0, week: 0, month: 0 },
            minWagering: 0,
          })),
          claimFrequency: {
            mode: 'instant',
            cooldown: 0,
          },
          default: {
            enabled: false,
            defaultPercentage: 0,
          },
          timeBoost: {
            enabled: false,
            from: null,
            to: null,
            allowedDays: [],
            defaultPercentage: 0,
          },
          gameSpecific: {
            enabled: false,
            multipliers: [],
          },
          status: 0,
          wagerMultiplier: 5,
        })
      }
    }
  }, [detail, isOpen, tiers, reset, formatedTiers])

  const onSave = async (data: CashbackFormValues) => {
    try {
      setIsLoading(true)
      let res = null

      if (detailInfo?._id) {
        // Update mode
        res = await updateCashback(detailInfo._id, data as ICashbackData)
        if (res.success) {
          setIsEdit(true)
          toast.success('Cashback updated successfully')
          if (setSelectedCashback) {
            setSelectedCashback(data as ICashbackData)
          }
        } else {
          toast.error(res.message || 'Failed to update cashback')
        }
      } else {
        // Create mode
        res = await createCashback(data as ICashbackData)
        if (res.success) {
          setIsEdit(true)
          toast.success('Cashback created successfully')
        } else {
          toast.error(res.message || 'Failed to create cashback')
        }
      }
    } catch (error) {
      console.error('Error updating cashback:', error)
      toast.error('An error occurred while saving the cashback')
    } finally {
      setIsLoading(false)
      handleClose()
    }
  }

  const handleClose = () => {
    setIsLoading(false)
    setDetailInfo(null)
    setSelectedCashback?.(null)
    closeModal?.()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      showCloseButton={true}
      className='m-4 max-w-[800px]'
      position='start'
    >
      {isLoading ? (
        <Loading />
      ) : (
        <div className='overflow-hidden rounded-3xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]'>
          <div className='max-w-full overflow-x-auto p-5'>
            <div className='grid grid-cols-1 gap-y-4 sm:gap-4'>
              <div className='col-span-1'>
                <ComponentCard
                  title={`${detailInfo?._id ? 'Update' : 'Add'} cashback`}
                  className='h-full'
                >
                  <form onSubmit={handleSubmit(onSave)}>
                    <div className='flex flex-col divide-y divide-gray-100 dark:divide-white/[0.05]'>
                      <CashbackBasicInfo
                        control={control}
                        errors={errors}
                        claimFrequencyMode={claimFrequencyMode}
                      />

                      <CashbackTypeSettings
                        control={control}
                        errors={errors}
                        cashbackType={cashbackType}
                      />

                      <CashbackTierSettings
                        control={control}
                        errors={errors}
                        formatedTiers={formatedTiers}
                      />
                    </div>
                    <div className='mt-2 flex items-center justify-around gap-4'>
                      <div className='h-full w-auto rounded-lg px-1 py-2.5'>
                        <Controller
                          name='status'
                          control={control}
                          render={({ field }) => (
                            <Switch
                              label={field.value === 1 ? 'Active' : 'Inactive'}
                              defaultChecked={field.value === 1}
                              onChange={(e) => {
                                field.onChange(e ? 1 : 0)
                              }}
                            />
                          )}
                        />
                      </div>
                      <Button
                        className='w-[30%]'
                        size='sm'
                        type='submit'
                        disabled={isLoading}
                      >
                        {detailInfo?._id ? 'Update' : 'Save'}
                      </Button>
                    </div>
                  </form>
                </ComponentCard>
              </div>
            </div>
          </div>
        </div>
      )}
    </Modal>
  )
}

export default CashbackDetailModal
