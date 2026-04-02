'use client'

import { useState, useEffect } from 'react'
import { Modal } from '@/components/ui/modal'
import Button from '@/components/ui/button/Button'
import Input from '@/components/form/input/InputField'
import Label from '@/components/form/Label'
import { IBonusSchedule, createSchedule, updateSchedule } from '@/api/bonus-scheduling'
import { Bonus } from '@/types/bonus'
import { ITierData } from '@/types/tier'
import { toast } from 'sonner'
import { PlusIcon, TrashBinIcon } from '@/icons'

type ScheduleModalProps = {
  isOpen: boolean
  onClose: () => void
  schedule?: IBonusSchedule | null
  bonuses: Bonus[]
  vipTiers: ITierData[]
  scheduleType?: 'one-time' | 'recurring' | 'rule-based'
  onSuccess: () => void
}

export default function ScheduleModal({
  isOpen,
  onClose,
  schedule,
  bonuses,
  vipTiers,
  scheduleType,
  onSuccess,
}: ScheduleModalProps) {
  const [formData, setFormData] = useState<Partial<IBonusSchedule>>({
    name: '',
    description: '',
    bonusId: '',
    scheduleType: scheduleType || 'one-time',
    status: 'active',
    isActive: true,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (schedule) {
      setFormData({
        name: schedule.name || '',
        description: schedule.description || '',
        bonusId: typeof schedule.bonusId === 'string' ? schedule.bonusId : schedule.bonusId?._id || '',
        scheduleType: schedule.scheduleType,
        status: schedule.status,
        isActive: schedule.isActive,
        scheduledDate: schedule.scheduledDate,
        recurringPattern: schedule.recurringPattern,
        ruleConditions: schedule.ruleConditions || [],
        ruleActions: schedule.ruleActions || [],
      })
    } else {
      setFormData({
        name: '',
        description: '',
        bonusId: '',
        scheduleType: scheduleType || 'one-time',
        status: 'active',
        isActive: true,
        scheduledDate: undefined,
        recurringPattern: undefined,
        ruleConditions: [],
        ruleActions: [],
      })
    }
  }, [schedule, scheduleType])

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)
      if (schedule) {
        await updateSchedule(schedule._id, formData)
        toast.success('Schedule updated successfully')
      } else {
        await createSchedule(formData)
        toast.success('Schedule created successfully')
      }
      onSuccess()
      onClose()
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const addRuleCondition = () => {
    setFormData({
      ...formData,
      ruleConditions: [
        ...(formData.ruleConditions || []),
        {
          type: 'vip_tier',
          operator: 'greater_equal',
          value: '',
        },
      ],
    })
  }

  const addRuleAction = () => {
    setFormData({
      ...formData,
      ruleActions: [
        ...(formData.ruleActions || []),
        {
          type: 'grant_bonus',
          bonusId: '',
        },
      ],
    })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} className='max-w-4xl'>
      <div className='p-6'>
        <h2 className='mb-6 text-xl font-semibold text-gray-800 dark:text-white'>
          {schedule ? 'Edit Schedule' : 'Create Schedule'}
        </h2>

        <div className='space-y-4 max-h-[60vh] overflow-y-auto'>
          {/* Basic Info */}
          <div>
            <Label>Name *</Label>
            <Input
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder='Enter schedule name'
            />
          </div>

          <div>
            <Label>Description</Label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className='mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
              placeholder='Enter description'
            />
          </div>

          <div>
            <Label>Bonus *</Label>
            <select
              value={typeof formData.bonusId === 'string' ? formData.bonusId : formData.bonusId?._id || ''}
              onChange={(e) => setFormData({ ...formData, bonusId: e.target.value })}
              className='mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
            >
              <option value=''>Select a bonus</option>
              {bonuses.map((bonus) => (
                <option key={bonus._id} value={bonus._id}>
                  {bonus.name} ({bonus.type})
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label>Schedule Type *</Label>
            <select
              value={formData.scheduleType}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  scheduleType: e.target.value as 'one-time' | 'recurring' | 'rule-based',
                })
              }
              className='mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
            >
              <option value='one-time'>One-time</option>
              <option value='recurring'>Recurring</option>
              <option value='rule-based'>IF/THEN Rule</option>
            </select>
          </div>

          {/* One-time Schedule */}
          {formData.scheduleType === 'one-time' && (
            <div>
              <Label>Scheduled Date *</Label>
              <Input
                type='datetime-local'
                value={
                  formData.scheduledDate
                    ? new Date(formData.scheduledDate).toISOString().slice(0, 16)
                    : ''
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    scheduledDate: new Date(e.target.value).toISOString(),
                  })
                }
              />
            </div>
          )}

          {/* Recurring Pattern */}
          {formData.scheduleType === 'recurring' && (
            <div className='space-y-4'>
              <div>
                <Label>Frequency *</Label>
                <select
                  value={formData.recurringPattern?.frequency || 'daily'}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      recurringPattern: {
                        ...formData.recurringPattern,
                        frequency: e.target.value as 'daily' | 'weekly' | 'monthly' | 'yearly',
                        interval: formData.recurringPattern?.interval || 1,
                      },
                    })
                  }
                  className='mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
                >
                  <option value='daily'>Daily</option>
                  <option value='weekly'>Weekly</option>
                  <option value='monthly'>Monthly</option>
                  <option value='yearly'>Yearly</option>
                </select>
              </div>

              <div>
                <Label>Interval (Every N {formData.recurringPattern?.frequency || 'days'})</Label>
                <Input
                  type='number'
                  min={1}
                  value={formData.recurringPattern?.interval || 1}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      recurringPattern: {
                        ...formData.recurringPattern,
                        interval: Number(e.target.value),
                        frequency: formData.recurringPattern?.frequency || 'daily',
                      },
                    })
                  }
                />
              </div>

              {formData.recurringPattern?.frequency === 'weekly' && (
                <div>
                  <Label>Days of Week</Label>
                  <div className='mt-2 flex flex-wrap gap-2'>
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, idx) => (
                      <label key={idx} className='flex items-center gap-2'>
                        <input
                          type='checkbox'
                          checked={formData.recurringPattern?.daysOfWeek?.includes(idx) || false}
                          onChange={(e) => {
                            const days = formData.recurringPattern?.daysOfWeek || []
                            const newDays = e.target.checked
                              ? [...days, idx]
                              : days.filter((d) => d !== idx)
                            setFormData({
                              ...formData,
                              recurringPattern: {
                                ...formData.recurringPattern,
                                daysOfWeek: newDays,
                                frequency: 'weekly',
                                interval: formData.recurringPattern?.interval || 1,
                              },
                            })
                          }}
                        />
                        <span className='text-sm'>{day}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {formData.recurringPattern?.frequency === 'monthly' && (
                <div>
                  <Label>Day of Month (1-31)</Label>
                  <Input
                    type='number'
                    min={1}
                    max={31}
                    value={formData.recurringPattern?.dayOfMonth || 1}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        recurringPattern: {
                          ...formData.recurringPattern,
                          dayOfMonth: Number(e.target.value),
                          frequency: 'monthly',
                          interval: formData.recurringPattern?.interval || 1,
                        },
                      })
                    }
                  />
                </div>
              )}

              <div>
                <Label>Time (HH:mm)</Label>
                <Input
                  type='time'
                  value={formData.recurringPattern?.time || '00:00'}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      recurringPattern: {
                        ...formData.recurringPattern,
                        time: e.target.value,
                        frequency: formData.recurringPattern?.frequency || 'daily',
                        interval: formData.recurringPattern?.interval || 1,
                      },
                    })
                  }
                />
              </div>

              <div>
                <Label>End Date (Optional)</Label>
                <Input
                  type='date'
                  value={
                    formData.recurringPattern?.endDate
                      ? new Date(formData.recurringPattern.endDate).toISOString().split('T')[0]
                      : ''
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      recurringPattern: {
                        ...formData.recurringPattern,
                        endDate: e.target.value ? new Date(e.target.value).toISOString() : undefined,
                        frequency: formData.recurringPattern?.frequency || 'daily',
                        interval: formData.recurringPattern?.interval || 1,
                      },
                    })
                  }
                />
              </div>
            </div>
          )}

          {/* IF/THEN Rules */}
          {formData.scheduleType === 'rule-based' && (
            <div className='space-y-4'>
              <div>
                <Label>IF Conditions</Label>
                <Button
                  type='button'
                  size='xs'
                  onClick={addRuleCondition}
                  className='mt-2'
                >
                  <PlusIcon />
                  Add Condition
                </Button>
                {formData.ruleConditions?.map((condition, idx) => (
                  <div key={idx} className='mt-2 flex gap-2 rounded-lg border p-3'>
                    <select
                      value={condition.type}
                      onChange={(e) => {
                        const newConditions = [...(formData.ruleConditions || [])]
                        newConditions[idx] = {
                          ...condition,
                          type: e.target.value as any,
                        }
                        setFormData({ ...formData, ruleConditions: newConditions })
                      }}
                      className='rounded-lg border border-gray-300 bg-white px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
                    >
                      <option value='vip_tier'>VIP Tier</option>
                      <option value='deposit'>Deposit</option>
                      <option value='wager'>Wager</option>
                      <option value='date'>Date</option>
                    </select>
                    <select
                      value={condition.operator}
                      onChange={(e) => {
                        const newConditions = [...(formData.ruleConditions || [])]
                        newConditions[idx] = {
                          ...condition,
                          operator: e.target.value as any,
                        }
                        setFormData({ ...formData, ruleConditions: newConditions })
                      }}
                      className='rounded-lg border border-gray-300 bg-white px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
                    >
                      <option value='equals'>=</option>
                      <option value='greater_than'>&gt;</option>
                      <option value='greater_equal'>&gt;=</option>
                      <option value='less_than'>&lt;</option>
                      <option value='less_equal'>&lt;=</option>
                      <option value='in'>In</option>
                    </select>
                    {condition.type === 'vip_tier' ? (
                      <select
                        value={condition.value}
                        onChange={(e) => {
                          const newConditions = [...(formData.ruleConditions || [])]
                          newConditions[idx] = {
                            ...condition,
                            value: e.target.value,
                          }
                          setFormData({ ...formData, ruleConditions: newConditions })
                        }}
                        className='flex-1 rounded-lg border border-gray-300 bg-white px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
                      >
                        <option value=''>Select VIP Tier</option>
                        {vipTiers.map((tier) => (
                          <option key={tier._id} value={tier.name}>
                            {tier.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <Input
                        value={condition.value || ''}
                        onChange={(e) => {
                          const newConditions = [...(formData.ruleConditions || [])]
                          newConditions[idx] = {
                            ...condition,
                            value: e.target.value,
                          }
                          setFormData({ ...formData, ruleConditions: newConditions })
                        }}
                        placeholder='Value'
                        className='flex-1'
                      />
                    )}
                    <button
                      onClick={() => {
                        const newConditions = formData.ruleConditions?.filter((_, i) => i !== idx)
                        setFormData({ ...formData, ruleConditions: newConditions })
                      }}
                      className='text-red-500 hover:text-red-700'
                    >
                      <TrashBinIcon className='h-4 w-4' />
                    </button>
                  </div>
                ))}
              </div>

              <div>
                <Label>THEN Actions</Label>
                <Button
                  type='button'
                  size='xs'
                  onClick={addRuleAction}
                  className='mt-2'
                >
                  <PlusIcon />
                  Add Action
                </Button>
                {formData.ruleActions?.map((action, idx) => (
                  <div key={idx} className='mt-2 flex gap-2 rounded-lg border p-3'>
                    <select
                      value={action.type}
                      onChange={(e) => {
                        const newActions = [...(formData.ruleActions || [])]
                        newActions[idx] = {
                          ...action,
                          type: e.target.value as any,
                        }
                        setFormData({ ...formData, ruleActions: newActions })
                      }}
                      className='rounded-lg border border-gray-300 bg-white px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
                    >
                      <option value='grant_bonus'>Grant Bonus</option>
                      <option value='send_notification'>Send Notification</option>
                      <option value='update_tier'>Update Tier</option>
                    </select>
                    {action.type === 'grant_bonus' && (
                      <select
                        value={action.bonusId || ''}
                        onChange={(e) => {
                          const newActions = [...(formData.ruleActions || [])]
                          newActions[idx] = {
                            ...action,
                            bonusId: e.target.value,
                          }
                          setFormData({ ...formData, ruleActions: newActions })
                        }}
                        className='flex-1 rounded-lg border border-gray-300 bg-white px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
                      >
                        <option value=''>Select Bonus</option>
                        {bonuses.map((bonus) => (
                          <option key={bonus._id} value={bonus._id}>
                            {bonus.name}
                          </option>
                        ))}
                      </select>
                    )}
                    <button
                      onClick={() => {
                        const newActions = formData.ruleActions?.filter((_, i) => i !== idx)
                        setFormData({ ...formData, ruleActions: newActions })
                      }}
                      className='text-red-500 hover:text-red-700'
                    >
                      <TrashBinIcon className='h-4 w-4' />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <Label>Status</Label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as 'active' | 'paused' | 'completed' | 'cancelled',
                })
              }
              className='mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
            >
              <option value='active'>Active</option>
              <option value='paused'>Paused</option>
              <option value='completed'>Completed</option>
              <option value='cancelled'>Cancelled</option>
            </select>
          </div>
        </div>

        <div className='mt-6 flex justify-end gap-2 border-t border-gray-200 p-6 dark:border-gray-700'>
          <Button type='button' variant='outline' onClick={onClose}>
            Cancel
          </Button>
          <Button type='button' onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : schedule ? 'Update' : 'Create'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

