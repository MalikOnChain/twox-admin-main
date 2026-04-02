'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

import { createBonus } from '@/api/bonus'

import { BonusType } from '@/lib/bonus'

import Loading from '@/components/common/Loading'

import { Bonus } from '@/types/bonus'

// Create default bonus data for new bonus
const createDefaultBonus = () => ({
  name: 'New Bonus',
  description: 'Enter bonus description',
  type: BonusType.WELCOME,
  validFrom: new Date(),
  defaultReward: {
    cash: {
      amount: 0,
      percentage: 0,
      minAmount: 0,
      maxAmount: 0,
    },
    freeSpins: {
      amount: 0,
      percentage: 0,
      minAmount: 0,
      maxAmount: 0,
    },
    bonus: {
      amount: 0,
      percentage: 0,
      minAmount: 0,
      maxAmount: 0,
    },
    special: {},
  },
})

const createDefaultBonusEligibility = () => ({
  eligibilityType: 'all',
  isActive: true,
})

const createDefaultBonusSettings = () => ({
  wageringSettings: {
    contributionRates: {
      slots: 1.0,
      tableGames: 0.1,
      liveGames: 0.1,
      crash: 0.8,
    },
  },
  stackingRules: {
    canStackWithOtherBonuses: false,
  },
  forfeitureRules: {
    forfeitOnWithdrawal: true,
    forfeitOnLargeWin: {
      enabled: false,
    },
    partialForfeitureAllowed: false,
  },
  notificationSettings: {
    sendClaimNotification: true,
    sendExpiryReminder: true,
    reminderHoursBefore: 24,
    sendProgressUpdates: false,
  },
  trackingSettings: {
    trackConversionRate: true,
    trackWageringCompletion: true,
  },
  abusePreventionSettings: {
    detectMultiAccounting: true,
    requirePhoneVerification: false,
  },
  featureFlags: {
    enableAdvancedWagering: false,
    enableAutoForfeiture: true,
    enableProgressiveUnlock: false,
  },
})

const CreateBonusPage = () => {
  const [bonus, setBonus] = useState<Bonus | null>(null)
  const router = useRouter()
  const fetchBonus = useCallback(async () => {
    const defaultBonus = createDefaultBonus()
    const defaultEligibility = createDefaultBonusEligibility()
    const defaultSettings = createDefaultBonusSettings()

    const { bonus } = await createBonus(defaultBonus, {
      eligibility: defaultEligibility,
      settings: defaultSettings,
      tierRewards: [],
    })

    setBonus(bonus)
  }, [])

  useEffect(() => {
    fetchBonus()
  }, [fetchBonus])

  useEffect(() => {
    if (bonus) {
      router.push(`/bonus/${bonus._id}`)
    }
  }, [bonus, router])

  if (!bonus) {
    return <Loading />
  }

  return <div>CreateBonusPage</div>
}

export default CreateBonusPage
