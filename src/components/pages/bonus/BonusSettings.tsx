import { Bell, Clock, Percent, Shield } from 'lucide-react'
import { memo } from 'react'

import SectionCard from '@/components/pages/bonus/SectionCard'

import EditableInfoItem from './InfoItem'

import { IBonusSettings } from '@/types/bonus'

const EditableBonusSettings = ({
  settings,
  onUpdate,
}: {
  settings: IBonusSettings
  icons: any
  onUpdate: (field: string, value: any) => void
}) => {
  if (!settings) return null

  const handleTimingSettingsUpdate = (field: string, value: any) => {
    onUpdate('timingSettings', {
      ...(settings.timingSettings || {}),
      [field]: value,
    })
  }

  const handleWageringSettingsUpdate = (field: string, value: any) => {
    onUpdate('wageringSettings', {
      ...(settings.wageringSettings || {}),
      [field]: value,
    })
  }

  const handleContributionRateUpdate = (gameType: string, value: any) => {
    onUpdate('wageringSettings', {
      ...(settings.wageringSettings || {}),
      contributionRates: {
        ...(settings.wageringSettings?.contributionRates || {
          slots: 1,
          tableGames: 0.1,
          liveGames: 0.1,
          crash: 0.1,
        }),
        [gameType]: parseFloat(value) / 100, // Convert percentage to decimal
      },
    })
  }

  const handleStackingRulesUpdate = (field: string, value: any) => {
    onUpdate('stackingRules', {
      ...(settings.stackingRules || {}),
      [field]: value,
    })
  }

  const handleForfeitureRulesUpdate = (field: string, value: any) => {
    onUpdate('forfeitureRules', {
      ...(settings.forfeitureRules || {}),
      [field]: value,
    })
  }

  const handleWithdrawalSettingsUpdate = (field: string, value: any) => {
    onUpdate('withdrawalSettings', {
      ...(settings.withdrawalSettings || {}),
      [field]: value,
    })
  }

  const handleNotificationSettingsUpdate = (field: string, value: any) => {
    onUpdate('notificationSettings', {
      ...(settings.notificationSettings || {}),
      [field]: value,
    })
  }

  return (
    <div className='flex flex-col gap-4'>
      <SectionCard
        title='Timing & Limits'
        subtitle='Time-based restrictions and claiming windows'
        icon={<Clock />}
      >
        <EditableInfoItem
          label='Cooldown Period (Hours)'
          value={settings.timingSettings?.cooldownPeriod || 0}
          type='number'
          onChange={(value) =>
            handleTimingSettingsUpdate('cooldownPeriod', parseInt(value) || 0)
          }
          validation={(value) => (value < 0 ? 'Must be positive' : null)}
        />

        <EditableInfoItem
          label='Claim Window (Hours)'
          value={settings.timingSettings?.claimWindow || 0}
          type='number'
          onChange={(value) =>
            handleTimingSettingsUpdate('claimWindow', parseInt(value) || 0)
          }
          validation={(value) => (value < 0 ? 'Must be positive' : null)}
        />

        <EditableInfoItem
          label='Auto Expiry (Hours)'
          value={settings.timingSettings?.autoExpiry || 0}
          type='number'
          onChange={(value) =>
            handleTimingSettingsUpdate('autoExpiry', parseInt(value) || 0)
          }
          validation={(value) => (value < 0 ? 'Must be positive' : null)}
        />

        <EditableInfoItem
          label='Max Bet Limit'
          value={settings.wageringSettings?.maxBetLimit || 0}
          type='currency'
          onChange={(value) =>
            handleWageringSettingsUpdate('maxBetLimit', value)
          }
          validation={(value) => (value < 0 ? 'Must be positive' : null)}
        />

        <EditableInfoItem
          label='Wagering Time Limit (Hours)'
          value={settings.wageringSettings?.wageringTimeLimit || 0}
          type='number'
          onChange={(value) =>
            handleWageringSettingsUpdate(
              'wageringTimeLimit',
              parseInt(value) || 0
            )
          }
          validation={(value) => (value < 0 ? 'Must be positive' : null)}
        />
      </SectionCard>

      <SectionCard
        title='Stacking & Forfeiture Rules'
        subtitle='How this bonus interacts with other bonuses'
        icon={<Shield />}
      >
        <EditableInfoItem
          label='Can Stack Bonuses'
          value={settings.stackingRules?.canStackWithOtherBonuses || false}
          type='boolean'
          onChange={(value) =>
            handleStackingRulesUpdate('canStackWithOtherBonuses', value)
          }
          highlight
        />

        <EditableInfoItem
          label='Max Stacking Value'
          value={settings.stackingRules?.maxStackingValue || 0}
          type='currency'
          onChange={(value) =>
            handleStackingRulesUpdate('maxStackingValue', value)
          }
          validation={(value) => (value < 0 ? 'Must be positive' : null)}
        />

        <EditableInfoItem
          label='Forfeit on Withdrawal'
          value={settings.forfeitureRules?.forfeitOnWithdrawal || false}
          type='boolean'
          onChange={(value) =>
            handleForfeitureRulesUpdate('forfeitOnWithdrawal', value)
          }
        />

        <EditableInfoItem
          label='Partial Forfeiture Allowed'
          value={settings.forfeitureRules?.partialForfeitureAllowed || false}
          type='boolean'
          onChange={(value) =>
            handleForfeitureRulesUpdate('partialForfeitureAllowed', value)
          }
        />

        <EditableInfoItem
          label='Max Cashout Multiplier'
          value={settings.withdrawalSettings?.maxCashoutMultiplier || 0}
          type='number'
          onChange={(value) =>
            handleWithdrawalSettingsUpdate(
              'maxCashoutMultiplier',
              parseFloat(value) || 0
            )
          }
          validation={(value) => (value < 0 ? 'Must be positive' : null)}
        />

        <EditableInfoItem
          label='Min Balance for Withdrawal'
          value={settings.withdrawalSettings?.minBalanceForWithdrawal || 0}
          type='currency'
          onChange={(value) =>
            handleWithdrawalSettingsUpdate('minBalanceForWithdrawal', value)
          }
          validation={(value) => (value < 0 ? 'Must be positive' : null)}
        />
      </SectionCard>

      <SectionCard
        title='Wagering Contribution Rates'
        subtitle='How different game types contribute to wagering requirements'
        icon={<Percent />}
      >
        <EditableInfoItem
          label='Slots (%)'
          value={(settings.wageringSettings?.contributionRates?.slots || 0) * 100}
          type='number'
          onChange={(value) => handleContributionRateUpdate('slots', value)}
          validation={(value) =>
            value < 0 || value > 100 ? 'Must be between 0 and 100' : null
          }
          highlight={settings.wageringSettings?.contributionRates?.slots === 1}
        />

        <EditableInfoItem
          label='Table Games (%)'
          value={(settings.wageringSettings?.contributionRates?.tableGames || 0) * 100}
          type='number'
          onChange={(value) =>
            handleContributionRateUpdate('tableGames', value)
          }
          validation={(value) =>
            value < 0 || value > 100 ? 'Must be between 0 and 100' : null
          }
          highlight={settings.wageringSettings?.contributionRates?.tableGames === 1}
        />

        <EditableInfoItem
          label='Live Games (%)'
          value={(settings.wageringSettings?.contributionRates?.liveGames || 0) * 100}
          type='number'
          onChange={(value) => handleContributionRateUpdate('liveGames', value)}
          validation={(value) =>
            value < 0 || value > 100 ? 'Must be between 0 and 100' : null
          }
          highlight={settings.wageringSettings?.contributionRates?.liveGames === 1}
        />

        <EditableInfoItem
          label='Crash Games (%)'
          value={(settings.wageringSettings?.contributionRates?.crash || 0) * 100}
          type='number'
          onChange={(value) => handleContributionRateUpdate('crash', value)}
          validation={(value) =>
            value < 0 || value > 100 ? 'Must be between 0 and 100' : null
          }
          highlight={settings.wageringSettings?.contributionRates?.crash === 1}
        />
      </SectionCard>

      <SectionCard
        title='Notification Settings'
        subtitle='How users are notified about this bonus'
        icon={<Bell />}
      >
        <EditableInfoItem
          label='Claim Notifications'
          value={settings.notificationSettings?.sendClaimNotification || false}
          type='boolean'
          onChange={(value) =>
            handleNotificationSettingsUpdate('sendClaimNotification', value)
          }
        />

        <EditableInfoItem
          label='Expiry Reminders'
          value={settings.notificationSettings?.sendExpiryReminder || false}
          type='boolean'
          onChange={(value) =>
            handleNotificationSettingsUpdate('sendExpiryReminder', value)
          }
        />

        <EditableInfoItem
          label='Reminder Hours Before'
          value={settings.notificationSettings?.reminderHoursBefore || 24}
          type='number'
          onChange={(value) =>
            handleNotificationSettingsUpdate(
              'reminderHoursBefore',
              parseInt(value) || 24
            )
          }
          validation={(value) => (value < 1 ? 'Must be at least 1 hour' : null)}
        />

        <EditableInfoItem
          label='Progress Updates'
          value={settings.notificationSettings?.sendProgressUpdates || false}
          type='boolean'
          onChange={(value) =>
            handleNotificationSettingsUpdate('sendProgressUpdates', value)
          }
        />
      </SectionCard>
    </div>
  )
}

export default memo(EditableBonusSettings)
