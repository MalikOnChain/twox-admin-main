// EditableBonusDetailPage.tsx
'use client'

import {
  AlertCircle,
  Gift,
  Info,
  RotateCcw,
  Save,
  Settings,
  Star,
  UsersRound,
} from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

import { getBonusDetail, updateBonus } from '@/api/bonus'

import ComponentCard from '@/components/common/ComponentCard'
import ConfirmModal from '@/components/common/ConfirmModal'
import BonusDetails from '@/components/pages/bonus/BonusDetails'
import BonusEligibility from '@/components/pages/bonus/BonusEligibility'
import BonusRewards from '@/components/pages/bonus/BonusRewards'
import BonusSettings from '@/components/pages/bonus/BonusSettings'
import TierRewards from '@/components/pages/bonus/TierRewards'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import BonusHeader from './BonusHeader'
import BonusStatistics from './BonusStatistics'

import {
  Bonus,
  IBonusEligibility,
  IBonusSettings,
  IBonusTierRewards,
} from '@/types/bonus'

const EditableBonusDetailPage = () => {
  const { id } = useParams()
  const router = useRouter()

  // Original data from server
  const [originalBonus, setOriginalBonus] = useState<Bonus | null>(null)
  const [originalEligibility, setOriginalEligibility] =
    useState<IBonusEligibility | null>(null)
  const [originalSettings, setOriginalSettings] =
    useState<IBonusSettings | null>(null)
  const [originalTierRewards, setOriginalTierRewards] = useState<
    IBonusTierRewards[] | null
  >(null)

  // Current editable data
  const [bonus, setBonus] = useState<Bonus | null>(null)
  const [eligibility, setEligibility] = useState<IBonusEligibility | null>(null)
  const [settings, setSettings] = useState<IBonusSettings | null>(null)
  const [tierRewards, setTierRewards] = useState<IBonusTierRewards[] | null>(
    null
  )

  // UI state
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasChanges, setHasChanges] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(
    null
  )

  const fetchBonus = useCallback(async () => {
    if (!id) return

    try {
      setLoading(true)
      const { bonus, eligibility, settings, tierRewards } =
        await getBonusDetail(id as string)

      // Store original data
      setOriginalBonus(bonus)
      setOriginalEligibility(eligibility)
      setOriginalSettings(settings)
      setOriginalTierRewards(tierRewards)

      // Set editable data
      setBonus(bonus)
      setEligibility(eligibility)
      setSettings(settings)
      setTierRewards(tierRewards)

      setError(null)
      setHasChanges(false)
    } catch (err) {
      setError('Failed to fetch bonus details')
      console.error('Error fetching bonus:', err)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchBonus()
  }, [fetchBonus])

  // Check for changes
  useEffect(() => {
    if (!originalBonus || !bonus) return

    const hasDataChanges =
      JSON.stringify(originalBonus) !== JSON.stringify(bonus) ||
      JSON.stringify(originalEligibility) !== JSON.stringify(eligibility) ||
      JSON.stringify(originalSettings) !== JSON.stringify(settings) ||
      JSON.stringify(originalTierRewards) !== JSON.stringify(tierRewards)

    setHasChanges(hasDataChanges)
  }, [
    bonus,
    eligibility,
    settings,
    tierRewards,
    originalBonus,
    originalEligibility,
    originalSettings,
    originalTierRewards,
  ])

  const handleSave = async () => {
    if (!id || !hasChanges) return

    try {
      setSaving(true)
      setError(null)

      const {
        bonus: updatedBonus,
        eligibility: updatedEligibility,
        settings: updatedSettings,
        tierRewards: updatedTierRewards,
      } = await updateBonus(id as string, bonus, {
        eligibility,
        settings,
        tierRewards,
      })

      // Update original data to new saved state
      setOriginalBonus(updatedBonus)
      setOriginalEligibility(updatedEligibility)
      setOriginalSettings(updatedSettings)
      setOriginalTierRewards(updatedTierRewards)

      setHasChanges(false)
      setSaveSuccess(true)

      // Clear success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err) {
      setError('Failed to save changes')
      console.error('Error saving bonus:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    if (!originalBonus) return

    setBonus(originalBonus)
    setEligibility(originalEligibility)
    setSettings(originalSettings)
    setTierRewards(originalTierRewards)
    setHasChanges(false)
    setError(null)
  }

  // Update handlers for each section
  const handleBonusUpdate = (field: string, value: any) => {
    if (!bonus) return
    setBonus({ ...bonus, [field]: value })
  }

  const handleRewardUpdate = (field: string, value: any) => {
    if (!bonus) return

    const [rewardType, property] = field.split('.')

    setBonus({
      ...bonus,
      defaultReward: {
        ...bonus.defaultReward,
        [rewardType]: {
          ...bonus.defaultReward[
            rewardType as keyof typeof bonus.defaultReward
          ],
          [property]: value,
        },
      },
    })
  }

  const handleEligibilityUpdate = (field: string, value: any) => {
    if (!eligibility) return
    setEligibility({ ...eligibility, [field]: value })
  }

  const handleSettingsUpdate = (field: string, value: any) => {
    if (!settings) return
    setSettings({ ...settings, [field]: value })
  }

  const handleTierRewardsUpdate = (
    tierIndex: number,
    field: string,
    value: any
  ) => {
    if (!tierRewards) return
    const updatedTierRewards = [...tierRewards]
    updatedTierRewards[tierIndex] = {
      ...updatedTierRewards[tierIndex],
      [field]: value,
    }
    setTierRewards(updatedTierRewards)
  }

  // Icons (you can replace these with your preferred icon library)
  const icons = {
    gift: '🎁',
    settings: '⚙️',
    users: '👥',
    money: '💰',
    chart: '📊',
    bell: '🔔',
    star: '⭐',
    calendar: '📅',
    shield: '🛡️',
    info: 'ℹ️',
    percentage: '%',
    clock: '⏰',
  }

  // Add navigation handler
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChanges) {
        e.preventDefault()
        e.returnValue = ''
        return ''
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [hasChanges])

  // Handle router events
  useEffect(() => {
    // const handleRouteChange = (url: string) => {
    //   if (hasChanges) {
    //     const leave = window.confirm(
    //       'You have unsaved changes. Are you sure you want to leave this page?'
    //     )
    //     if (!leave) {
    //       // Prevent navigation
    //       window.history.pushState(null, '', window.location.href)
    //       throw 'Route Cancelled'
    //     }
    //   }
    // }

    window.addEventListener('popstate', () => {
      if (hasChanges) {
        const leave = window.confirm(
          'You have unsaved changes. Are you sure you want to leave this page?'
        )
        if (!leave) {
          window.history.pushState(null, '', window.location.href)
        }
      }
    })

    return () => {
      window.removeEventListener('popstate', () => {})
    }
  }, [hasChanges])

  // const handleNavigation = (path: string) => {
  //   if (hasChanges) {
  //     setPendingNavigation(path)
  //     setShowConfirmModal(true)
  //   } else {
  //     router.push(path)
  //   }
  // }

  const handleConfirmNavigation = () => {
    if (pendingNavigation) {
      router.push(pendingNavigation)
    }
    setShowConfirmModal(false)
    setPendingNavigation(null)
  }

  const handleCancelNavigation = () => {
    setShowConfirmModal(false)
    setPendingNavigation(null)
  }

  if (loading) {
    return (
      <ComponentCard title='Bonus Detail'>
        <div className='flex h-64 items-center justify-center'>
          <div className='flex flex-col items-center gap-4'>
            <div className='h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent'></div>
            <div className='text-gray-500'>Loading bonus details...</div>
          </div>
        </div>
      </ComponentCard>
    )
  }

  if (error && !bonus) {
    return (
      <ComponentCard title='Bonus Detail'>
        <div className='flex h-64 items-center justify-center'>
          <div className='rounded-lg border border-red-200 bg-red-50 p-6 text-center dark:border-red-800 dark:bg-red-950/30'>
            <div className='mb-2 text-4xl text-red-500'>⚠️</div>
            <div className='font-medium text-red-600 dark:text-red-400'>
              {error}
            </div>
          </div>
        </div>
      </ComponentCard>
    )
  }

  if (!bonus) {
    return (
      <ComponentCard title='Bonus Detail'>
        <div className='flex h-64 items-center justify-center'>
          <div className='text-center'>
            <div className='mb-2 text-4xl text-gray-400'>🔍</div>
            <div className='text-gray-500'>Bonus not found</div>
          </div>
        </div>
      </ComponentCard>
    )
  }

  return (
    <ComponentCard title='Bonus Detail'>
      {/* Save/Reset Controls */}
      <div className='mb-6 flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800'>
        <div className='flex items-center gap-4'>
          <div className='flex items-center gap-2'>
            <div
              className={`h-3 w-3 rounded-full ${
                hasChanges ? 'bg-yellow-500' : 'bg-green-500'
              }`}
            />
            <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
              {hasChanges ? 'Unsaved changes' : 'All changes saved'}
            </span>
          </div>

          {saveSuccess && (
            <div className='flex items-center gap-1 text-sm text-green-600 dark:text-green-400'>
              <span>✓</span>
              <span>Changes saved successfully!</span>
            </div>
          )}

          {error && (
            <div className='flex items-center gap-1 text-sm text-red-600 dark:text-red-400'>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}
        </div>

        <div className='flex items-center gap-2'>
          <button
            onClick={handleReset}
            disabled={!hasChanges || saving}
            className='flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
          >
            <RotateCcw size={16} />
            Reset
          </button>

          <button
            onClick={handleSave}
            disabled={!hasChanges || saving}
            className='flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50'
          >
            <Save size={16} />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className='space-y-8'>
        {/* Header Section (Read-only) */}
        <BonusHeader
          code={bonus.code}
          description={bonus.description}
          icons={icons}
          name={bonus.name}
          status={bonus.status}
        />

        {/* Key Statistics (Read-only) */}
        <BonusStatistics
          icons={icons}
          claimsCount={bonus.claimsCount}
          maxClaims={bonus.maxClaims}
          maxClaimsPerUser={bonus.maxClaimsPerUser}
          priority={bonus.priority}
          defaultWageringMultiplier={bonus.defaultWageringMultiplier}
        />

        {/* Tabs for Details, Eligibility, and Settings */}
        <Tabs defaultValue='details'>
          <TabsList>
            <TabsTrigger value='details'>
              <Info />
              <span className='ml-2 text-lg font-bold text-black dark:text-white'>
                Details
              </span>
            </TabsTrigger>
            <TabsTrigger value='rewards'>
              <Gift />
              <span className='ml-2 text-lg font-bold text-black dark:text-white'>
                Rewards
              </span>
            </TabsTrigger>
            <TabsTrigger value='eligibility'>
              <UsersRound />
              <span className='ml-2 text-lg font-bold text-black dark:text-white'>
                Eligibility
              </span>
            </TabsTrigger>
            <TabsTrigger value='settings'>
              <Settings />
              <span className='ml-2 text-lg font-bold text-black dark:text-white'>
                Settings
              </span>
            </TabsTrigger>

            <TabsTrigger value='tier-rewards'>
              <Star />
              <span className='ml-2 text-lg font-bold text-black dark:text-white'>
                Tier Rewards
              </span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value='details'>
            <BonusDetails
              bonus={bonus}
              icons={icons}
              onUpdate={handleBonusUpdate}
            />
          </TabsContent>

          <TabsContent value='rewards'>
            <BonusRewards bonus={bonus} onUpdate={handleRewardUpdate} />
          </TabsContent>

          <TabsContent value='eligibility'>
            {eligibility && (
              <BonusEligibility
                eligibility={eligibility}
                icons={icons}
                onUpdate={handleEligibilityUpdate}
              />
            )}
          </TabsContent>

          <TabsContent value='settings'>
            {settings && (
              <BonusSettings
                settings={settings}
                icons={icons}
                onUpdate={handleSettingsUpdate}
              />
            )}
          </TabsContent>

          <TabsContent value='tier-rewards'>
            {tierRewards && tierRewards.length > 0 && (
              <TierRewards
                tierRewards={tierRewards}
                icons={icons}
                onUpdate={handleTierRewardsUpdate}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>

      <ConfirmModal
        open={showConfirmModal}
        title='Unsaved Changes'
        description='You have unsaved changes. Are you sure you want to leave this page?'
        handleConfirm={handleConfirmNavigation}
        handleClose={handleCancelNavigation}
      />
    </ComponentCard>
  )
}

export default EditableBonusDetailPage
