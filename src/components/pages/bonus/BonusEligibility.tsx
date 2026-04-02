import { Clock, DollarSign, Globe, Users } from 'lucide-react'

import SectionCard from '@/components/pages/bonus/SectionCard'

import EditableInfoItem from './InfoItem'

import { IBonusEligibility } from '@/types/bonus'

const EditableBonusEligibility = ({
  eligibility,
  onUpdate,
}: {
  eligibility: IBonusEligibility
  icons: any
  onUpdate: (field: string, value: any) => void
}) => {
  if (!eligibility) return null

  const handleVipTierUpdate = (value: any) => {
    // Convert comma-separated string to array of tier objects
    const tierNames = Array.isArray(value)
      ? value
      : value
          .split(',')
          .map((v: string) => v.trim())
          .filter(Boolean)
    const vipTiers = tierNames.map((name: string) => ({
      tierName: name,
      tierId: name.toLowerCase(),
    }))
    onUpdate('vipTiers', vipTiers)
  }

  const handleMinAccountAgeUpdate = (field: 'days' | 'hours', value: any) => {
    const currentAge = eligibility.minAccountAge || {}
    onUpdate('minAccountAge', {
      ...currentAge,
      [field]: parseInt(value) || 0,
      [field === 'days' ? 'hours' : 'days']:
        field === 'days' ? 0 : currentAge.days || 0,
    })
  }

  const handleDepositRequirementUpdate = (field: string, value: any) => {
    const currentReqs = eligibility.depositRequirements || {}
    onUpdate('depositRequirements', {
      ...currentReqs,
      [field]: value,
    })
  }

  return (
    <div className='flex flex-col gap-4'>
      {/* Main Eligibility Rules Section */}
      <SectionCard
        title='Eligibility Rules'
        subtitle='Who can claim this bonus and under what conditions'
        icon={<Users />}
        isCollapsible={true}
        defaultCollapsed={false}
        isToggleable={true}
        isEnabled={eligibility.isActive}
        onToggle={(enabled) => onUpdate('isActive', enabled)}
        switchLabel='Eligibility Active'
        switchDescription='Enable or disable the eligibility rules'
      >
        <EditableInfoItem
          label='Eligibility Type'
          value={eligibility.eligibilityType}
          type='select'
          options={[
            { label: 'All Users', value: 'all' },
            { label: 'New Users Only', value: 'new' },
            { label: 'VIP Only', value: 'vip' },
            { label: 'Deposit Required', value: 'deposit' },
            { label: 'Custom', value: 'custom' },
          ]}
          onChange={(value) => onUpdate('eligibilityType', value)}
          highlight
        />

        <EditableInfoItem
          label='VIP Tiers'
          value={
            eligibility.vipTiers?.map((tier) => tier.tierName || tier.tierId) ||
            []
          }
          type='multiselect'
          options={[
            { value: '1', label: 'Option 1' },
            { value: '2', label: 'Option 2' },
            { value: '3', label: 'Option 3' },
          ]}
          onChange={handleVipTierUpdate}
          placeholder='Enter tier names separated by commas'
        />

        <EditableInfoItem
          label='Min Account Age (Days)'
          value={eligibility.minAccountAge?.days || 0}
          type='number'
          icon={<Clock size={16} />}
          onChange={(value) => handleMinAccountAgeUpdate('days', value)}
          validation={(value) => (value < 0 ? 'Must be positive' : null)}
        />

        <EditableInfoItem
          label='Min Account Age (Hours)'
          value={eligibility.minAccountAge?.hours || 0}
          type='number'
          icon={<Clock size={16} />}
          onChange={(value) => handleMinAccountAgeUpdate('hours', value)}
          validation={(value) => (value < 0 ? 'Must be positive' : null)}
        />

        <EditableInfoItem
          label='Allowed Countries'
          value={eligibility.allowedCountries || []}
          type='multiselect'
          icon={<Globe size={16} />}
          onChange={(value) => onUpdate('allowedCountries', value)}
          placeholder='Enter country codes separated by commas (e.g., US, CA, GB)'
        />

        <EditableInfoItem
          label='Excluded Countries'
          value={eligibility.excludedCountries || []}
          type='multiselect'
          icon={<Globe size={16} />}
          onChange={(value) => onUpdate('excludedCountries', value)}
          placeholder='Enter country codes separated by commas'
        />
      </SectionCard>

      {/* Deposit Requirements Section with Toggle */}
      <SectionCard
        title='Deposit Requirements'
        subtitle='Configure deposit-related bonus requirements'
        icon={<DollarSign />}
        isToggleable={true}
        isEnabled={eligibility.depositRequirements?.requireDeposit || false}
        onToggle={(enabled) =>
          handleDepositRequirementUpdate('requireDeposit', enabled)
        }
        switchLabel='Require Deposit'
        switchDescription='Enable deposit requirements'
        isCollapsible={true}
        defaultCollapsed={false}
      >
        <EditableInfoItem
          label='First Deposit Only'
          value={eligibility.depositRequirements?.firstDepositOnly || false}
          type='boolean'
          onChange={(value) =>
            handleDepositRequirementUpdate('firstDepositOnly', value)
          }
        />

        <EditableInfoItem
          label='Min Deposit Amount'
          value={eligibility.depositRequirements?.minDepositAmount || 0}
          type='currency'
          icon={<DollarSign size={16} />}
          onChange={(value) =>
            handleDepositRequirementUpdate('minDepositAmount', value)
          }
          validation={(value) => (value < 0 ? 'Must be positive' : null)}
          highlight
        />

        <EditableInfoItem
          label='Max Deposit Amount'
          value={eligibility.depositRequirements?.maxDepositAmount || 0}
          type='currency'
          icon={<DollarSign size={16} />}
          onChange={(value) =>
            handleDepositRequirementUpdate('maxDepositAmount', value)
          }
          validation={(value) => (value < 0 ? 'Must be positive' : null)}
        />

        <EditableInfoItem
          label='Deposit Count'
          value={eligibility.depositRequirements?.minDepositCount || 0}
          type='number'
          onChange={(value) =>
            handleDepositRequirementUpdate('minDepositCount', value)
          }
          validation={(value) => (value < 0 ? 'Must be positive' : null)}
        />

        <EditableInfoItem
          label='Max Deposits Per Timeframe'
          value={eligibility.depositRequirements?.maxDepositsPerTimeframe || 0}
          type='number'
          onChange={(value) =>
            handleDepositRequirementUpdate('maxDepositsPerTimeframe', value)
          }
          validation={(value) => (value < 0 ? 'Must be positive' : null)}
        />

        <EditableInfoItem
          label='Min Total Deposits'
          value={eligibility.depositRequirements?.minTotalDeposits || 0}
          type='currency'
          onChange={(value) =>
            handleDepositRequirementUpdate('minTotalDeposits', value)
          }
          validation={(value) => (value < 0 ? 'Must be positive' : null)}
        />
      </SectionCard>
    </div>
  )
}

export default EditableBonusEligibility
