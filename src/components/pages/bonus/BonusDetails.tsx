import { Info } from 'lucide-react'
import { memo } from 'react'

import { BonusType } from '@/lib/bonus'

import SectionCard from '@/components/pages/bonus/SectionCard'

import EditableInfoItem from './InfoItem'

import { Bonus } from '@/types/bonus'

const EditableBonusDetails = ({
  bonus,
  icons,
  onUpdate,
}: {
  bonus: Bonus
  icons: any
  onUpdate: (field: string, value: any) => void
}) => {
  return (
    <div className='flex flex-col gap-4'>
      <SectionCard
        title='Bonus Information'
        subtitle='Core details and configuration'
        icon={<Info />}
        isToggleable={true}
        isEnabled={bonus.isActive}
        onToggle={(enabled) => onUpdate('isActive', enabled)}
        switchLabel='Active'
        switchDescription='Enable or disable the bonus'
        isCollapsible={true}
        defaultCollapsed={false}
      >
        <EditableInfoItem
          label='Bonus Name'
          value={bonus.name}
          onChange={(value) => onUpdate('name', value)}
          validation={(value) => (!value?.trim() ? 'Name is required' : null)}
          placeholder='Enter bonus name'
        />

        <EditableInfoItem
          label='Description'
          value={bonus.description}
          type='textarea'
          onChange={(value) => onUpdate('description', value)}
          placeholder='Enter bonus description'
        />

        <EditableInfoItem
          label='Claim Method'
          value={bonus.claimMethod}
          type='select'
          options={[
            { label: 'Automatic', value: 'automatic' },
            { label: 'Manual', value: 'manual' },
            { label: 'Code Required', value: 'code_required' },
          ]}
          onChange={(value) => onUpdate('claimMethod', value)}
          highlight
        />

        <EditableInfoItem
          label='Bonus Code'
          value={bonus.code}
          onChange={(value) => onUpdate('code', value)}
          validation={(value) => (!value?.trim() ? 'Code is required' : null)}
          placeholder='Enter bonus code'
        />

        <EditableInfoItem
          label='Default Wagering Multiplier'
          value={bonus.defaultWageringMultiplier}
          onChange={(value) => onUpdate('defaultWageringMultiplier', value)}
          validation={(value) =>
            !value?.trim() ? 'Wagering multiplier is required' : null
          }
          placeholder='Enter wagering multiplier'
          type='number'
        />

        <EditableInfoItem
          label='Default Wagering Multiplier'
          value={bonus.priority}
          onChange={(value) => onUpdate('priority', value)}
          validation={(value) =>
            !value?.trim() ? 'Priority is required' : null
          }
          placeholder='Enter priority'
          type='number'
        />

        <EditableInfoItem
          label='Type'
          value={Object.keys(BonusType).find(
            (key) => BonusType[key as keyof typeof BonusType] === bonus.type
          )}
          type='select'
          options={[
            { label: 'Welcome Bonus', value: BonusType.WELCOME },
            { label: 'Deposit Bonus', value: BonusType.DEPOSIT },
            { label: 'Custom', value: BonusType.CUSTOM },
            { label: 'Daily', value: BonusType.DAILY },
            { label: 'Weekly', value: BonusType.WEEKLY },
            { label: 'Monthly', value: BonusType.MONTHLY },
            { label: 'Referral', value: BonusType.REFERRAL },
          ]}
          onChange={(value) => onUpdate('type', value)}
        />

        <EditableInfoItem
          label='Category'
          value={bonus.category}
          type='text'
          onChange={(value) => onUpdate('category', value)}
        />

        <EditableInfoItem
          label='Validity Period'
          value={{ from: bonus.validFrom, to: bonus.validTo }}
          type='dateRange'
          icon={icons.calendar}
          onChange={({ from, to }) => {
            onUpdate('validFrom', from)
            onUpdate('validTo', to)
          }}
          fromPlaceholder='Valid From'
          toPlaceholder='Valid To'
        />

        <EditableInfoItem
          label='Is Visible?'
          value={bonus.isVisible}
          type='boolean'
          onChange={(value) => onUpdate('isVisible', value)}
        />

        <EditableInfoItem
          label='Display Order'
          value={bonus.displayOrder}
          type='number'
          onChange={(value) => onUpdate('displayOrder', parseInt(value) || 0)}
          validation={(value) =>
            value < 0 ? 'Display order must be positive' : null
          }
        />
      </SectionCard>
    </div>
  )
}

export default memo(EditableBonusDetails)
