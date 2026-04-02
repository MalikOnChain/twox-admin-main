import { CircleDollarSign, Gift, LoaderPinwheel } from 'lucide-react'

import EditableInfoItem from '@/components/pages/bonus/InfoItem'
import SectionCard from '@/components/pages/bonus/SectionCard'

import { Bonus } from '@/types/bonus'

const BonusRewards = ({
  bonus,
  onUpdate,
}: {
  bonus: Bonus
  onUpdate: (field: string, value: any) => void
}) => {
  return (
    <div className='flex flex-col gap-4'>
      <SectionCard
        title='Reward With Cash'
        subtitle='Default cash amount for the bonus'
        icon={<CircleDollarSign />}
      >
        <EditableInfoItem
          label='Bonus Rewards'
          value={bonus.defaultReward.cash?.amount}
          type='number'
          onChange={(value) => onUpdate('cash.amount', value)}
        />

        <EditableInfoItem
          label='Bonus Rewards'
          value={bonus.defaultReward.cash?.maxAmount}
          type='number'
          onChange={(value) => onUpdate('cash.maxAmount', value)}
        />

        <EditableInfoItem
          label='Bonus Rewards'
          value={bonus.defaultReward.cash?.minAmount}
          type='number'
          onChange={(value) => onUpdate('cash.minAmount', value)}
        />

        <EditableInfoItem
          label='Bonus Rewards'
          value={bonus.defaultReward.cash?.percentage}
          type='number'
          onChange={(value) => onUpdate('cash.percentage', value)}
        />
      </SectionCard>
      <SectionCard
        title='Reward With Free Spins'
        subtitle='Default cash amount for the bonus'
        icon={<LoaderPinwheel />}
      >
        <EditableInfoItem
          label='Bonus Rewards'
          value={bonus.defaultReward.freeSpins?.amount}
          type='number'
          onChange={(value) => onUpdate('freeSpins.amount', value)}
        />

        <EditableInfoItem
          label='Bonus Rewards'
          value={bonus.defaultReward.freeSpins?.maxAmount}
          type='number'
          onChange={(value) => onUpdate('freeSpins.maxAmount', value)}
        />

        <EditableInfoItem
          label='Bonus Rewards'
          value={bonus.defaultReward.freeSpins?.minAmount}
          type='number'
          onChange={(value) => onUpdate('freeSpins.minAmount', value)}
        />

        <EditableInfoItem
          label='Bonus Rewards'
          value={bonus.defaultReward.freeSpins?.percentage}
          type='number'
          onChange={(value) => onUpdate('freeSpins.percentage', value)}
        />
      </SectionCard>
      <SectionCard
        title='Reward With Bonus'
        subtitle='Default Bonus amount for the bonus'
        icon={<Gift />}
      >
        <EditableInfoItem
          label='Bonus Rewards'
          value={bonus.defaultReward.bonus?.amount}
          type='number'
          onChange={(value) => onUpdate('bonus.amount', value)}
        />

        <EditableInfoItem
          label='Bonus Rewards'
          value={bonus.defaultReward.bonus?.maxAmount}
          type='number'
          onChange={(value) => onUpdate('bonus.maxAmount', value)}
        />

        <EditableInfoItem
          label='Bonus Rewards'
          value={bonus.defaultReward.bonus?.minAmount}
          type='number'
          onChange={(value) => onUpdate('bonus.minAmount', value)}
        />

        <EditableInfoItem
          label='Bonus Rewards'
          value={bonus.defaultReward.bonus?.percentage}
          type='number'
          onChange={(value) => onUpdate('bonus.percentage', value)}
        />
      </SectionCard>
    </div>
  )
}

export default BonusRewards
