import { DollarSign, Star, Zap } from 'lucide-react'
import { memo } from 'react'

import EditableInfoItem from './InfoItem'

import { IBonusTierRewards } from '@/types/bonus'

const EditableTierRewards = ({
  tierRewards,
  icons: _icons,
  onUpdate,
}: {
  tierRewards: IBonusTierRewards[]
  icons: any
  onUpdate: (tierIndex: number, field: string, value: any) => void
}) => {
  if (!tierRewards || tierRewards.length === 0) return null

  const handleTierUpdate = (tierIndex: number, field: string, value: any) => {
    onUpdate(tierIndex, field, value)
  }

  const handleRewardUpdate = (
    tierIndex: number,
    rewardType: string,
    field: string,
    value: any
  ) => {
    const currentTier = tierRewards[tierIndex]
    const updatedReward = {
      ...currentTier.tierReward[rewardType],
      [field]: value,
    }

    const updatedTierReward = {
      ...currentTier.tierReward,
      [rewardType]: updatedReward,
    }

    onUpdate(tierIndex, 'tierReward', updatedTierReward)
  }

  return (
    <div className='rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800'>
      <div className='mb-6 flex items-center gap-3 border-b border-gray-100 pb-4 dark:border-gray-700'>
        <div className='rounded-lg bg-gradient-to-r from-purple-100 to-pink-100 p-2 dark:from-purple-900/30 dark:to-pink-900/30'>
          <span className='text-purple-600 dark:text-purple-400'>
            <Star />
          </span>
        </div>
        <div>
          <h4 className='text-lg font-semibold text-gray-900 dark:text-white'>
            Tier-Based Rewards
          </h4>
          <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
            Special rewards for different VIP tiers
          </p>
        </div>
      </div>

      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {tierRewards.map((tier, index) => (
          <div
            key={index}
            className='rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 p-6 transition-all duration-300 hover:shadow-lg dark:border-gray-700 dark:from-gray-900 dark:to-gray-800'
          >
            <div className='mb-4 space-y-4'>
              <EditableInfoItem
                label='Tier Name'
                value={tier.tierName}
                onChange={(value) => handleTierUpdate(index, 'tierName', value)}
                validation={(value) =>
                  !value?.trim() ? 'Tier name is required' : null
                }
                highlight
              />

              <EditableInfoItem
                label='Tier Level'
                value={tier.tierLevel}
                type='number'
                onChange={(value) =>
                  handleTierUpdate(index, 'tierLevel', parseInt(value) || 1)
                }
                validation={(value) =>
                  value < 1 ? 'Level must be at least 1' : null
                }
              />

              <EditableInfoItem
                label='Active Status'
                value={tier.isActive}
                type='boolean'
                onChange={(value) => handleTierUpdate(index, 'isActive', value)}
              />
            </div>

            <div className='space-y-3 border-t border-gray-200 pt-4 dark:border-gray-700'>
              <EditableInfoItem
                label='Cash Reward'
                value={tier.tierReward.cash?.amount || 0}
                type='currency'
                icon={<DollarSign size={14} />}
                onChange={(value) =>
                  handleRewardUpdate(index, 'cash', 'amount', value)
                }
                validation={(value) => (value < 0 ? 'Must be positive' : null)}
              />

              <EditableInfoItem
                label='Bonus Reward'
                value={tier.tierReward.bonus?.amount || 0}
                type='currency'
                icon={<DollarSign size={14} />}
                onChange={(value) =>
                  handleRewardUpdate(index, 'bonus', 'amount', value)
                }
                validation={(value) => (value < 0 ? 'Must be positive' : null)}
              />

              <EditableInfoItem
                label='Free Spins'
                value={tier.tierReward.freeSpins?.amount || 0}
                type='number'
                icon={<Zap size={14} />}
                onChange={(value) =>
                  handleRewardUpdate(
                    index,
                    'freeSpins',
                    'amount',
                    parseInt(value) || 0
                  )
                }
                validation={(value) => (value < 0 ? 'Must be positive' : null)}
              />

              <EditableInfoItem
                label='Wagering Multiplier'
                value={tier.tierWageringMultiplier}
                type='number'
                onChange={(value) =>
                  handleTierUpdate(
                    index,
                    'tierWageringMultiplier',
                    parseFloat(value) || 1
                  )
                }
                validation={(value) => (value < 0 ? 'Must be positive' : null)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default memo(EditableTierRewards)
