'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Image from 'next/image'
import { Modal } from '@/components/ui/modal'
import Button from '@/components/ui/button/Button'
import Input from '@/components/form/input/InputField'
import Label from '@/components/form/Label'
import Switch from '@/components/form/switch/Switch'
import { Bonus } from '@/types/bonus'
import { getGameCategories } from '@/api/casino/game-category'
import { getTiers } from '@/api/tier'
import { uploadBonusImage } from '@/api/bonus'
import { PencilIcon } from '@/icons'

const bonusTypeConfigSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.string().min(1, 'Type is required'),
  description: z.string().optional(),
  code: z.string().optional(),
  claimMethod: z.enum(['auto', 'manual', 'code']),
  status: z.enum(['active', 'inactive', 'draft', 'expired']),
  isVisible: z.boolean(),
  validFrom: z.string().min(1, 'Valid from is required'),
  validTo: z.string().optional(),
  maxClaims: z.number().optional(),
  maxClaimsPerUser: z.number().optional(),
  imageUrl: z.string().optional(),
  // Reward Calculation
  rewardCashPercentage: z.number().min(0).max(100).optional(),
  rewardCashAmount: z.number().min(0).optional(),
  rewardCashMin: z.number().min(0).optional(),
  rewardCashMax: z.number().min(0).optional(),
  rewardFreeSpinsAmount: z.number().min(0).optional(),
  rewardFreeSpinsPercentage: z.number().min(0).max(100).optional(),
  rewardFreeSpinsMin: z.number().min(0).optional(),
  rewardFreeSpinsMax: z.number().min(0).optional(),
  // Wagering
  wageringMultiplier: z.number().min(0).optional(),
  // Triggers
  triggerMinDeposit: z.number().min(0).optional(),
  triggerMinWager: z.number().min(0).optional(),
  // Eligibility
  eligibilityType: z.enum(['all', 'vip_tiers', 'country', 'registration_date', 'deposit_history']).optional(),
  eligibleVipTiers: z.array(z.string()).optional(),
  allowedCountries: z.array(z.string()).optional(),
  excludedCountries: z.array(z.string()).optional(),
  minAccountAgeDays: z.number().min(0).optional(),
  requireDeposit: z.boolean().optional(),
  minDepositAmount: z.number().min(0).optional(),
  // Fraud Guards
  requireKYC: z.boolean().optional(),
  requireEmailVerification: z.boolean().optional(),
  maxAccountsPerIP: z.number().min(1).optional(),
  // Targeting
  targetGameCategories: z.array(z.string()).optional(),
  targetSpecificGames: z.array(z.string()).optional(),
})

type BonusTypeConfigFormValues = z.infer<typeof bonusTypeConfigSchema>

type BonusTypeConfigModalProps = {
  isOpen: boolean
  onClose: () => void
  bonus?: Bonus | null
  onSave: (data: BonusTypeConfigFormValues) => Promise<boolean>
}

const BONUS_TYPES = [
  { value: 'deposit', label: 'Deposit' },
  { value: 'wager', label: 'Wager' },
  { value: 'cashback', label: 'Cashback' },
  { value: 'freeSpins', label: 'Free Spins' },
  { value: 'missions', label: 'Missions' },
  { value: 'lossback', label: 'Lossback' },
  { value: 'manual', label: 'Manual/Comp' },
]

type ConfigTab = 'general' | 'triggers' | 'reward-calc' | 'wagering' | 'eligibility' | 'targeting'

const COUNTRIES = [
  'US', 'CA', 'GB', 'AU', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'CH', 'AT', 'SE', 'NO', 'DK',
  'FI', 'PL', 'CZ', 'IE', 'PT', 'GR', 'BR', 'MX', 'AR', 'CL', 'CO', 'PE', 'ZA', 'NG', 'KE',
  'EG', 'IN', 'CN', 'JP', 'KR', 'SG', 'MY', 'TH', 'ID', 'PH', 'VN', 'NZ', 'AE', 'SA', 'IL',
]

export default function BonusTypeConfigModal({
  isOpen,
  onClose,
  bonus,
  onSave,
}: BonusTypeConfigModalProps) {
  const [activeTab, setActiveTab] = useState<ConfigTab>('general')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [gameCategories, setGameCategories] = useState<Array<{ _id: string; title: string }>>([])
  const [vipTiers, setVipTiers] = useState<Array<{ _id: string; name: string }>>([])
  const bonusImageRef = useRef<HTMLInputElement>(null)
  const [image, setImageUrl] = useState<string | null>(null)
  const [fileToUpload, setFileToUpload] = useState<File | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
    getValues,
  } = useForm<BonusTypeConfigFormValues>({
    resolver: zodResolver(bonusTypeConfigSchema),
    defaultValues: {
      name: '',
      type: 'deposit',
      description: '',
      code: '',
      claimMethod: 'manual',
      status: 'draft',
      isVisible: true,
      validFrom: new Date().toISOString().split('T')[0],
      validTo: '',
      maxClaims: undefined,
      maxClaimsPerUser: 1,
      rewardCashPercentage: undefined,
      rewardCashAmount: undefined,
      rewardCashMin: undefined,
      rewardCashMax: undefined,
      rewardFreeSpinsAmount: undefined,
      rewardFreeSpinsPercentage: undefined,
      rewardFreeSpinsMin: undefined,
      rewardFreeSpinsMax: undefined,
      wageringMultiplier: 30,
      triggerMinDeposit: undefined,
      triggerMinWager: undefined,
      eligibilityType: 'all',
      eligibleVipTiers: [],
      allowedCountries: [],
      excludedCountries: [],
      minAccountAgeDays: undefined,
      requireDeposit: false,
      minDepositAmount: undefined,
      requireKYC: false,
      requireEmailVerification: false,
      maxAccountsPerIP: undefined,
      targetGameCategories: [],
      targetSpecificGames: [],
      imageUrl: '',
    },
  })

  const fetchGameCategories = useCallback(async () => {
    try {
      const response = await getGameCategories({ page: 1, limit: 1000 })
      if (response.success && response.data) {
        setGameCategories(response.data.map((cat: any) => ({ _id: cat._id, title: cat.title })))
      }
    } catch (error) {
      console.error('Error fetching game categories:', error)
    }
  }, [])

  const fetchVipTiers = useCallback(async () => {
    try {
      const response = await getTiers({ page: 1, limit: 1000 })
      if (response.success && response.rows) {
        setVipTiers(response.rows.map((tier: any) => ({ _id: tier._id, name: tier.name })))
      }
    } catch (error) {
      console.error('Error fetching VIP tiers:', error)
    }
  }, [])

  useEffect(() => {
    if (isOpen) {
      fetchGameCategories()
      fetchVipTiers()
    }
  }, [isOpen, fetchGameCategories, fetchVipTiers])

  useEffect(() => {
    if (bonus) {
      reset({
        name: bonus.name || '',
        type: bonus.type || 'deposit',
        description: bonus.description || '',
        code: bonus.code || '',
        claimMethod: bonus.claimMethod || 'manual',
        status: bonus.status || 'draft',
        isVisible: bonus.isVisible !== undefined ? bonus.isVisible : true,
        validFrom: bonus.validFrom
          ? new Date(bonus.validFrom).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        validTo: bonus.validTo
          ? new Date(bonus.validTo).toISOString().split('T')[0]
          : '',
        maxClaims: bonus.maxClaims || undefined,
        maxClaimsPerUser: bonus.maxClaimsPerUser || 1,
        wageringMultiplier: bonus.defaultWageringMultiplier || 30,
        imageUrl: bonus.imageUrl || '',
        // Note: Other fields would need to be extracted from bonus.metadata or related models
      })
      setImageUrl(bonus.imageUrl || null)
    } else {
      reset({
        name: '',
        type: 'deposit',
        description: '',
        code: '',
        claimMethod: 'manual',
        status: 'draft',
        isVisible: true,
        validFrom: new Date().toISOString().split('T')[0],
        validTo: '',
        maxClaims: undefined,
        maxClaimsPerUser: 1,
        wageringMultiplier: 30,
        eligibilityType: 'all',
        imageUrl: '',
      })
      setImageUrl(null)
      setFileToUpload(null)
    }
  }, [bonus, reset])

  const handleOnChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      if (file.type.startsWith('image/')) {
        setFileToUpload(file)
        setImageUrl(URL.createObjectURL(file))
      }
    } catch (error) {
      console.error('Error handling image:', error)
    }
  }

  const updateImage = async () => {
    const updatedData = { ...getValues() }

    try {
      if (fileToUpload) {
        const formData = new FormData()
        formData.append('file', fileToUpload)
        const result = await uploadBonusImage(formData)
        updatedData.imageUrl = result.url
        setValue('imageUrl', result.url)
      }

      return updatedData
    } catch (error) {
      console.error('Error uploading bonus image:', error)
      throw error
    }
  }

  const handleClose = () => {
    setFileToUpload(null)
    setImageUrl(null)
    onClose()
  }

  const onSubmit = async (data: BonusTypeConfigFormValues) => {
    setIsSubmitting(true)
    try {
      // Upload image if a new file was selected
      let finalData = data
      if (fileToUpload) {
        finalData = await updateImage()
      }
      
      const success = await onSave(finalData)
      if (success) {
        handleClose()
      }
    } catch (error) {
      console.error('Error submitting bonus:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const tabs: { id: ConfigTab; label: string }[] = [
    { id: 'general', label: 'General' },
    { id: 'triggers', label: 'Triggers' },
    { id: 'reward-calc', label: 'Reward Calc' },
    { id: 'wagering', label: 'Wagering' },
    { id: 'eligibility', label: 'Eligibility' },
    { id: 'targeting', label: 'Targeting' },
  ]

  const eligibilityType = watch('eligibilityType')
  const targetGameCategories = watch('targetGameCategories') || []
  const eligibleVipTiers = watch('eligibleVipTiers') || []
  const allowedCountries = watch('allowedCountries') || []
  const excludedCountries = watch('excludedCountries') || []

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className='max-w-4xl'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='p-6'>
          <h2 className='mb-6 text-xl font-semibold text-gray-800 dark:text-white'>
            {bonus ? 'Edit Bonus Type' : 'Create Bonus Type'}
          </h2>

          {/* Tabs */}
          <div className='mb-6 border-b border-gray-200 dark:border-gray-700'>
            <nav className='-mb-px flex space-x-8 overflow-x-auto'>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type='button'
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium ${
                    activeTab === tab.id
                      ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className='max-h-[60vh] overflow-y-auto'>
            {/* General Tab */}
            {activeTab === 'general' && (
              <div className='space-y-4'>
                {/* Bonus Image Upload */}
                <div>
                  <Label>Bonus Image</Label>
                  <div className='relative mt-2 flex h-[200px] flex-col items-center justify-center gap-2 rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50'>
                    <Image
                      src={image || bonus?.imageUrl || '/images/preview.png'}
                      alt={bonus?.name || 'Bonus preview'}
                      width={0}
                      height={0}
                      sizes='100vw'
                      className='h-full w-full rounded-lg object-cover'
                    />
                    <input
                      type='file'
                      onChange={handleOnChangeImage}
                      ref={bonusImageRef}
                      className='hidden'
                      accept='image/*'
                    />
                    <div
                      className='absolute top-2 right-2 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white opacity-80 shadow-md hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600'
                      onClick={() => bonusImageRef.current?.click()}
                    >
                      <PencilIcon className='h-5 w-5 text-gray-500 dark:text-gray-400' />
                    </div>
                  </div>
                  <p className='mt-1 text-xs text-gray-500 dark:text-gray-400'>
                    Click the pencil icon to upload a bonus image
                  </p>
                </div>

                <div>
                  <Label>Name *</Label>
                  <Input
                    {...register('name')}
                    error={!!errors.name?.message}
                    errorMessage={errors.name?.message}
                    placeholder='Enter bonus name'
                  />
                </div>

                <div>
                  <Label>Type *</Label>
                  <select
                    {...register('type')}
                    className='mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
                  >
                    {BONUS_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label>Description</Label>
                  <textarea
                    {...register('description')}
                    rows={3}
                    className='mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
                    placeholder='Enter bonus description'
                  />
                </div>

                <div>
                  <Label>Code</Label>
                  <Input
                    {...register('code')}
                    placeholder='Optional bonus code'
                  />
                </div>

                <div>
                  <Label>Claim Method</Label>
                  <select
                    {...register('claimMethod')}
                    className='mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
                  >
                    <option value='auto'>Auto</option>
                    <option value='manual'>Manual</option>
                    <option value='code'>Code</option>
                  </select>
                </div>

                <div>
                  <Label>Status</Label>
                  <select
                    {...register('status')}
                    className='mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
                  >
                    <option value='draft'>Draft</option>
                    <option value='active'>Active</option>
                    <option value='inactive'>Inactive</option>
                    <option value='expired'>Expired</option>
                  </select>
                </div>

                <div className='flex items-center gap-2'>
                  <Switch
                    defaultChecked={watch('isVisible')}
                    onChange={(checked) => setValue('isVisible', checked)}
                  />
                  <Label>Visible to users</Label>
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <Label>Valid From *</Label>
                    <Input
                      type='date'
                      {...register('validFrom')}
                      error={!!errors.validFrom?.message}
                      errorMessage={errors.validFrom?.message}
                    />
                  </div>
                  <div>
                    <Label>Valid To</Label>
                    <Input
                      type='date'
                      {...register('validTo')}
                      placeholder='No expiry'
                    />
                  </div>
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <Label>Max Claims</Label>
                    <Input
                      type='number'
                      {...register('maxClaims', { valueAsNumber: true })}
                      placeholder='Unlimited'
                    />
                  </div>
                  <div>
                    <Label>Max Claims Per User</Label>
                    <Input
                      type='number'
                      {...register('maxClaimsPerUser', { valueAsNumber: true })}
                      defaultValue={1}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Triggers Tab */}
            {activeTab === 'triggers' && (
              <div className='space-y-4'>
                <div>
                  <Label>Minimum Deposit Amount</Label>
                  <Input
                    type='number'
                    step={0.01}
                    min={0}
                    {...register('triggerMinDeposit', { valueAsNumber: true })}
                    placeholder='Minimum deposit to trigger bonus'
                  />
                  <p className='mt-1 text-xs text-gray-500 dark:text-gray-400'>
                    Bonus will trigger when user deposits this amount or more
                  </p>
                </div>

                <div>
                  <Label>Minimum Wager Amount</Label>
                  <Input
                    type='number'
                    step={0.01}
                    min={0}
                    {...register('triggerMinWager', { valueAsNumber: true })}
                    placeholder='Minimum wager to trigger bonus'
                  />
                  <p className='mt-1 text-xs text-gray-500 dark:text-gray-400'>
                    Bonus will trigger when user wagers this amount or more
                  </p>
                </div>

                <div className='rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50'>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>
                    <strong>Note:</strong> Trigger conditions determine when the bonus becomes available. 
                    Leave empty if the bonus should be available immediately or based on other criteria.
                  </p>
                </div>
              </div>
            )}

            {/* Reward Calc Tab */}
            {activeTab === 'reward-calc' && (
              <div className='space-y-6'>
                {/* Cash Rewards */}
                <div className='space-y-4'>
                  <h4 className='text-sm font-semibold text-gray-800 dark:text-white'>Cash Rewards</h4>
                  
                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <Label>Cash Percentage (%)</Label>
                      <Input
                        type='number'
                        step={0.01}
                        min={0}
                        max={100}
                        {...register('rewardCashPercentage', { valueAsNumber: true })}
                        placeholder='e.g., 100 for 100%'
                      />
                    </div>
                    <div>
                      <Label>Fixed Cash Amount</Label>
                      <Input
                        type='number'
                        step={0.01}
                        min={0}
                        {...register('rewardCashAmount', { valueAsNumber: true })}
                        placeholder='Fixed amount'
                      />
                    </div>
                  </div>

                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <Label>Minimum Cash Amount</Label>
                      <Input
                        type='number'
                        step={0.01}
                        min={0}
                        {...register('rewardCashMin', { valueAsNumber: true })}
                        placeholder='Min amount'
                      />
                    </div>
                    <div>
                      <Label>Maximum Cash Amount</Label>
                      <Input
                        type='number'
                        step={0.01}
                        min={0}
                        {...register('rewardCashMax', { valueAsNumber: true })}
                        placeholder='Max amount'
                      />
                    </div>
                  </div>
                </div>

                {/* Free Spins Rewards */}
                <div className='space-y-4'>
                  <h4 className='text-sm font-semibold text-gray-800 dark:text-white'>Free Spins Rewards</h4>
                  
                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <Label>Free Spins Amount</Label>
                      <Input
                        type='number'
                        min={0}
                        {...register('rewardFreeSpinsAmount', { valueAsNumber: true })}
                        placeholder='Number of free spins'
                      />
                    </div>
                    <div>
                      <Label>Free Spins Percentage (%)</Label>
                      <Input
                        type='number'
                        step={0.01}
                        min={0}
                        max={100}
                        {...register('rewardFreeSpinsPercentage', { valueAsNumber: true })}
                        placeholder='Percentage'
                      />
                    </div>
                  </div>

                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <Label>Minimum Free Spins</Label>
                      <Input
                        type='number'
                        min={0}
                        {...register('rewardFreeSpinsMin', { valueAsNumber: true })}
                        placeholder='Min spins'
                      />
                    </div>
                    <div>
                      <Label>Maximum Free Spins</Label>
                      <Input
                        type='number'
                        min={0}
                        {...register('rewardFreeSpinsMax', { valueAsNumber: true })}
                        placeholder='Max spins'
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Wagering Tab */}
            {activeTab === 'wagering' && (
              <div className='space-y-4'>
                <div>
                  <Label>Wagering Multiplier</Label>
                  <Input
                    type='number'
                    step={0.1}
                    min={0}
                    {...register('wageringMultiplier', { valueAsNumber: true })}
                    placeholder='e.g., 30 for 30x'
                  />
                  <p className='mt-1 text-xs text-gray-500 dark:text-gray-400'>
                    The bonus amount must be wagered this many times before withdrawal. 
                    Common values: 30x, 35x, 40x
                  </p>
                </div>

                <div className='rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50'>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>
                    <strong>Note:</strong> Game category contribution rates and advanced wagering settings 
                    can be configured in the Bonus Settings section.
                  </p>
                </div>
              </div>
            )}

            {/* Eligibility Tab */}
            {activeTab === 'eligibility' && (
              <div className='space-y-4'>
                <div>
                  <Label>Eligibility Type</Label>
                  <select
                    {...register('eligibilityType')}
                    className='mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
                  >
                    <option value='all'>All Users</option>
                    <option value='vip_tiers'>VIP Tiers Only</option>
                    <option value='country'>Country Based</option>
                    <option value='registration_date'>Registration Date Based</option>
                    <option value='deposit_history'>Deposit History Based</option>
                  </select>
                </div>

                {eligibilityType === 'vip_tiers' && (
                  <div>
                    <Label>Eligible VIP Tiers</Label>
                    <div className='mt-2 max-h-40 space-y-2 overflow-y-auto rounded-lg border border-gray-300 bg-white p-2 dark:border-gray-600 dark:bg-gray-800'>
                      {vipTiers.map((tier) => (
                        <label key={tier._id} className='flex items-center gap-2'>
                          <input
                            type='checkbox'
                            checked={eligibleVipTiers.includes(tier._id)}
                            onChange={(e) => {
                              const current = eligibleVipTiers
                              if (e.target.checked) {
                                setValue('eligibleVipTiers', [...current, tier._id])
                              } else {
                                setValue('eligibleVipTiers', current.filter((id) => id !== tier._id))
                              }
                            }}
                            className='rounded border-gray-300 text-brand-600 focus:ring-brand-500'
                          />
                          <span className='text-sm text-gray-700 dark:text-gray-300'>{tier.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {eligibilityType === 'country' && (
                  <div className='space-y-4'>
                    <div>
                      <Label>Allowed Countries</Label>
                      <select
                        multiple
                        className='mt-2 max-h-32 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
                        value={allowedCountries}
                        onChange={(e) => {
                          const selected = Array.from(e.target.selectedOptions, (option) => option.value)
                          setValue('allowedCountries', selected)
                        }}
                      >
                        {COUNTRIES.map((country) => (
                          <option key={country} value={country}>
                            {country}
                          </option>
                        ))}
                      </select>
                      <p className='mt-1 text-xs text-gray-500 dark:text-gray-400'>
                        Hold Ctrl/Cmd to select multiple countries
                      </p>
                    </div>

                    <div>
                      <Label>Excluded Countries</Label>
                      <select
                        multiple
                        className='mt-2 max-h-32 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
                        value={excludedCountries}
                        onChange={(e) => {
                          const selected = Array.from(e.target.selectedOptions, (option) => option.value)
                          setValue('excludedCountries', selected)
                        }}
                      >
                        {COUNTRIES.map((country) => (
                          <option key={country} value={country}>
                            {country}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {eligibilityType === 'registration_date' && (
                  <div>
                    <Label>Minimum Account Age (Days)</Label>
                    <Input
                      type='number'
                      min={0}
                      {...register('minAccountAgeDays', { valueAsNumber: true })}
                      placeholder='Minimum days since registration'
                    />
                  </div>
                )}

                {eligibilityType === 'deposit_history' && (
                  <div className='space-y-4'>
                    <div className='flex items-center gap-2'>
                      <Switch
                        defaultChecked={watch('requireDeposit')}
                        onChange={(checked) => setValue('requireDeposit', checked)}
                      />
                      <Label>Require Deposit</Label>
                    </div>

                    <div>
                      <Label>Minimum Deposit Amount</Label>
                      <Input
                        type='number'
                        step={0.01}
                        min={0}
                        {...register('minDepositAmount', { valueAsNumber: true })}
                        placeholder='Minimum deposit amount required'
                      />
                    </div>
                  </div>
                )}

                <div className='flex items-center gap-2'>
                  <Switch
                    defaultChecked={watch('requireKYC')}
                    onChange={(checked) => setValue('requireKYC', checked)}
                  />
                  <Label>Require KYC Verification</Label>
                </div>

                <div className='flex items-center gap-2'>
                  <Switch
                    defaultChecked={watch('requireEmailVerification')}
                    onChange={(checked) => setValue('requireEmailVerification', checked)}
                  />
                  <Label>Require Email Verification</Label>
                </div>
              </div>
            )}

            {/* Targeting Tab */}
            {activeTab === 'targeting' && (
              <div className='space-y-4'>
                <div>
                  <Label>Target Game Categories</Label>
                  <div className='mt-2 max-h-40 space-y-2 overflow-y-auto rounded-lg border border-gray-300 bg-white p-2 dark:border-gray-600 dark:bg-gray-800'>
                    {gameCategories.length === 0 ? (
                      <p className='text-sm text-gray-500 dark:text-gray-400'>Loading categories...</p>
                    ) : (
                      gameCategories.map((category) => (
                        <label key={category._id} className='flex items-center gap-2'>
                          <input
                            type='checkbox'
                            checked={targetGameCategories.includes(category._id)}
                            onChange={(e) => {
                              const current = targetGameCategories
                              if (e.target.checked) {
                                setValue('targetGameCategories', [...current, category._id])
                              } else {
                                setValue('targetGameCategories', current.filter((id) => id !== category._id))
                              }
                            }}
                            className='rounded border-gray-300 text-brand-600 focus:ring-brand-500'
                          />
                          <span className='text-sm text-gray-700 dark:text-gray-300'>{category.title}</span>
                        </label>
                      ))
                    )}
                  </div>
                  <p className='mt-1 text-xs text-gray-500 dark:text-gray-400'>
                    Select game categories where this bonus applies. Leave empty to apply to all categories.
                  </p>
                </div>

                <div className='rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50'>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>
                    <strong>Note:</strong> Specific game targeting can be configured after bonus creation 
                    in the bonus detail page.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className='flex justify-end gap-2 border-t border-gray-200 p-6 dark:border-gray-700'>
          <Button type='button' variant='outline' onClick={handleClose}>
            Cancel
          </Button>
          <Button type='submit' disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : bonus ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
