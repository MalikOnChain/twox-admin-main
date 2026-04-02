'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import {
  createTierAffiliate,
  generateReferralCode,
  getAssigners,
  updateTierAffiliate,
} from '@/api/tier-affiliate'

import Label from '@/components/form/Label'
import Select from '@/components/form/Select'
import Button from '@/components/ui/button/Button'
import { Modal } from '@/components/ui/modal'

import { IAssigner, ITierAffiliateCollection } from '@/types/tier-affiliate'

// ✅ Zod schema
const schema = z.object({
  name: z
    .string()
    .min(3, 'Name must be at least 3 characters')
    .regex(/^[a-zA-Z0-9 ]{3,}$/, 'Invalid name format'), // Allow space in name
  referralCode: z
    .string()
    .min(3, 'Referral code must be at least 3 characters')
    .regex(/^[a-zA-Z0-9]{3,}$/, 'Invalid referral code format'),
  wagerCommissionRate: z
    .number({ required_error: 'Wager commission is required' })
    .min(0, 'Minimum is 0')
    .max(1.2, 'Maximum is 1.2'),
  lossCommissionRate: z
    .number({ required_error: 'Loss commission is required' })
    .min(0, 'Minimum is 0')
    .max(50, 'Maximum is 50'),
  assigner: z
    .string({ required_error: 'Assigner is required' })
    .min(1, 'Assigner is required'),
})

type FormData = z.infer<typeof schema>

const TierAffiliateDetail = ({
  isOpen,
  closeModal,
  handleSave,
  detail,
}: {
  isOpen: boolean
  closeModal: () => void
  handleSave: () => void
  detail?: ITierAffiliateCollection | null
}) => {
  const isCreate = !detail?._id

  const [assigners, setAssigners] = useState<IAssigner[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isDirty, isSubmitting },
    watch,
    reset: resetForm,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    defaultValues: {
      name: detail?.name || '',
      referralCode: detail?.referralCode || '',
      wagerCommissionRate: detail?.wagerCommissionRate || 0,
      lossCommissionRate: detail?.lossCommissionRate || 0,
      assigner: detail?.assigner?._id || '',
    },
  })

  const watchAssigner = watch('assigner')

  const fetchAssigners = useCallback(async () => {
    const ass = await getAssigners(detail?._id)
    setAssigners(ass)
  }, [detail])

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        await fetchAssigners()
      } catch (err) {
        if (err instanceof Error) {
          toast.error(err.message)
        } else {
          toast.error('Error loading data')
        }
      } finally {
        setIsLoading(false)
      }

      if (detail) {
        resetForm({
          name: detail.name,
          referralCode: detail.referralCode,
          wagerCommissionRate: detail.wagerCommissionRate,
          lossCommissionRate: detail.lossCommissionRate,
          assigner: detail.assigner._id,
        })
      } else {
        resetForm({
          name: '',
          referralCode: '',
          wagerCommissionRate: 0,
          lossCommissionRate: 0,
          assigner: '',
        })
      }
    }
    fetchData()
  }, [detail, fetchAssigners, resetForm, isOpen])

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true)
      if (isCreate) {
        await createTierAffiliate({
          name: data.name,
          referralCode: data.referralCode,
          wagerCommissionRate: data.wagerCommissionRate,
          lossCommissionRate: data.lossCommissionRate,
          assigner: data.assigner,
        })
      } else {
        await updateTierAffiliate(detail?._id, data)
      }
      handleSave()
      closeModal()
      toast.success('Saved successfully!')
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Failed to save Tier')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerateReferralCode = async () => {
    try {
      setIsGenerating(true)
      const code = await generateReferralCode()
      setValue('referralCode', code, { shouldDirty: true })
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message)
      } else {
        toast.error('Error generating referral code')
      }
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        resetForm()
        closeModal()
      }}
      className='m-4 max-w-[700px]'
      position='start'
    >
      <div className='no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 lg:p-11 dark:bg-gray-900'>
        <div className='px-2 pr-14'>
          <h4 className='mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90'>
            {isCreate ? 'Add' : 'Edit'} Tier Affiliate
          </h4>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='grid grid-cols-1 gap-6 sm:grid-cols-2'
        >
          <div>
            <Label>Name</Label>
            <input
              className='shadow-theme-xs h-11 w-full rounded-lg border px-4 py-2.5 text-sm placeholder:text-gray-400 focus:ring-3 focus:outline-none dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30'
              {...register('name')}
            />
            {errors.name && (
              <p className='text-error-500 mt-1 text-xs'>
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <Label className='flex justify-between'>
              Referral Code
              <span
                onClick={handleGenerateReferralCode}
                className='hover:cursor-pointer hover:text-blue-500 hover:underline'
              >
                Generate
              </span>
            </Label>
            <input
              className='shadow-theme-xs h-11 w-full rounded-lg border px-4 py-2.5 text-sm placeholder:text-gray-400 focus:ring-3 focus:outline-none dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30'
              disabled={isGenerating}
              {...register('referralCode')}
            />
            {errors.referralCode && (
              <p className='text-error-500 mt-1 text-xs'>
                {errors.referralCode.message}
              </p>
            )}
          </div>

          <div>
            <Label>Wager Commission Rate (%)</Label>
            <input
              type='number'
              step={0.1}
              min={0}
              max={1.2}
              className='shadow-theme-xs h-11 w-full rounded-lg border px-4 py-2.5 text-sm placeholder:text-gray-400 focus:ring-3 focus:outline-none dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30'
              {...register('wagerCommissionRate', { valueAsNumber: true })}
            />
            {errors.wagerCommissionRate && (
              <p className='text-error-500 mt-1 text-xs'>
                {errors.wagerCommissionRate.message}
              </p>
            )}
          </div>

          <div>
            <Label>Loss Commission Rate (%)</Label>
            <input
              type='number'
              step={1}
              min={0}
              max={50}
              className='shadow-theme-xs h-11 w-full rounded-lg border px-4 py-2.5 text-sm placeholder:text-gray-400 focus:ring-3 focus:outline-none dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30'
              {...register('lossCommissionRate', { valueAsNumber: true })}
            />
            {errors.lossCommissionRate && (
              <p className='text-error-500 mt-1 text-xs'>
                {errors.lossCommissionRate.message}
              </p>
            )}
          </div>

          <div className='sm:col-span-2'>
            <Label>Assigner</Label>
            <Select
              placeholder='Select Assigner'
              options={
                assigners?.map((r) => ({
                  value: r._id,
                  label: r.username,
                })) || []
              }
              defaultValue={watchAssigner}
              onChange={(value) => setValue('assigner', value)}
            />
            {errors.assigner && (
              <p className='text-error-500 mt-1 text-xs'>
                {errors.assigner.message}
              </p>
            )}
          </div>

          <div className='mt-6 flex items-center gap-3 px-2 sm:col-span-2 lg:justify-end'>
            <Button
              size='sm'
              variant='outline'
              type='button'
              onClick={closeModal}
            >
              Close
            </Button>
            <Button
              size='sm'
              type='submit'
              disabled={!isDirty || isSubmitting || isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Change'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  )
}

export default TierAffiliateDetail
