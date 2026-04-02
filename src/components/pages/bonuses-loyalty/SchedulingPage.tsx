'use client'

import { useState, useCallback, useEffect } from 'react'
import { toast } from 'sonner'
import {
  DateSelectArg,
  EventClickArg,
  EventContentArg,
  EventInput,
} from '@fullcalendar/core'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'

import {
  getCalendarEvents,
  getRecurringTemplates,
  getRules,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  getSchedules,
  IBonusSchedule,
  ICalendarEvent,
  IVipTier,
} from '@/api/bonus-scheduling'
import { getBonuses } from '@/api/bonus'
import { getTiers } from '@/api/tier'

import ComponentCard from '@/components/common/ComponentCard'
import Loading from '@/components/common/Loading'
import Button from '@/components/ui/button/Button'
import { Modal } from '@/components/ui/modal'
import Badge from '@/components/ui/badge/Badge'
import { PlusIcon, PencilIcon, TrashBinIcon } from '@/icons'
import { useModal } from '@/hooks/useModal'
import ScheduleModal from '@/components/pages/bonuses-loyalty/scheduling/ScheduleModal'

import { Bonus } from '@/types/bonus'
import { ITierData } from '@/types/tier'

type ScheduleTab = 'calendar' | 'recurring' | 'rules'

export default function SchedulingPage() {
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<ScheduleTab>('calendar')
  const [calendarEvents, setCalendarEvents] = useState<ICalendarEvent[]>([])
  const [recurringTemplates, setRecurringTemplates] = useState<IBonusSchedule[]>([])
  const [rules, setRules] = useState<IBonusSchedule[]>([])
  const [vipTiers, setVipTiers] = useState<IVipTier[]>([])
  const [tiers, setTiers] = useState<ITierData[]>([])
  const [bonuses, setBonuses] = useState<Bonus[]>([])
  const [selectedSchedule, setSelectedSchedule] = useState<IBonusSchedule | null>(null)
  const [scheduleModalType, setScheduleModalType] = useState<'one-time' | 'recurring' | 'rule-based' | undefined>()
  const scheduleModal = useModal()

  const fetchCalendarEvents = useCallback(async () => {
    try {
      const start = new Date()
      start.setMonth(start.getMonth() - 1)
      const end = new Date()
      end.setMonth(end.getMonth() + 2)

      const response = await getCalendarEvents({
        start: start.toISOString(),
        end: end.toISOString(),
      })
      setCalendarEvents(response.data)
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message)
      }
    }
  }, [])

  const fetchRecurringTemplates = useCallback(async () => {
    try {
      const response = await getRecurringTemplates()
      setRecurringTemplates(response.data)
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message)
      }
    }
  }, [])

  const fetchRules = useCallback(async () => {
    try {
      const response = await getRules()
      setRules(response.data)
      setVipTiers(response.vipTiers || [])
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message)
      }
    }
  }, [])

  const fetchBonuses = useCallback(async () => {
    try {
      const response = await getBonuses({
        page: 1,
        limit: 100,
        filter: '',
      })
      setBonuses(response.rows)
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message)
      }
    }
  }, [])

  const fetchTiers = useCallback(async () => {
    try {
      const response = await getTiers({
        page: 1,
        limit: -1,
      })
      setTiers(response.rows)
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message)
      }
    }
  }, [])

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await Promise.all([
        fetchCalendarEvents(),
        fetchRecurringTemplates(),
        fetchRules(),
        fetchBonuses(),
        fetchTiers(),
      ])
      setLoading(false)
    }
    loadData()
  }, [])

  useEffect(() => {
    if (activeTab === 'calendar') {
      fetchCalendarEvents()
    } else if (activeTab === 'recurring') {
      fetchRecurringTemplates()
    } else if (activeTab === 'rules') {
      fetchRules()
    }
  }, [activeTab])

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    setSelectedSchedule(null)
    setScheduleModalType('one-time')
    scheduleModal.openModal()
  }

  const handleSuccess = () => {
    fetchCalendarEvents()
    fetchRecurringTemplates()
    fetchRules()
  }

  const handleEventClick = (clickInfo: EventClickArg) => {
    // Find the schedule from the event
    const scheduleId = clickInfo.event.extendedProps.scheduleId
    const scheduleType = clickInfo.event.extendedProps.scheduleType
    setScheduleModalType(scheduleType as 'one-time' | 'recurring' | 'rule-based')
    // You would need to fetch the full schedule details here
    scheduleModal.openModal()
  }

  const renderEventContent = (eventInfo: EventContentArg) => {
    return (
      <div className='fc-event-main flex rounded-sm p-1'>
        <div className='fc-daygrid-event-dot'></div>
        <div className='fc-event-time'>{eventInfo.timeText}</div>
        <div className='fc-event-title'>{eventInfo.event.title}</div>
      </div>
    )
  }

  if (loading) {
    return <Loading />
  }

  return (
    <div className='space-y-6'>
      <ComponentCard title='Scheduling & Automation'>
        {/* Tabs */}
        <div className='mb-6 border-b border-gray-200 dark:border-gray-700'>
          <nav className='-mb-px flex space-x-8'>
            {[
              { id: 'calendar' as ScheduleTab, label: 'Calendar' },
              { id: 'recurring' as ScheduleTab, label: 'Recurring Templates' },
              { id: 'rules' as ScheduleTab, label: 'IF/THEN Rules' },
            ].map((tab) => (
              <button
                key={tab.id}
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

        {/* Calendar Tab */}
        {activeTab === 'calendar' && (
          <div>
            <div className='mb-4 flex justify-end'>
              <Button
                onClick={() => {
                  setSelectedSchedule(null)
                  setScheduleModalType('one-time')
                  scheduleModal.openModal()
                }}
                size='xs'
              >
                <PlusIcon />
                Create Schedule
              </Button>
            </div>
            <div className='rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]'>
              <div className='custom-calendar'>
                <FullCalendar
                  plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                  initialView='dayGridMonth'
                  headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay',
                  }}
                  events={calendarEvents}
                  selectable={true}
                  select={handleDateSelect}
                  eventClick={handleEventClick}
                  eventContent={renderEventContent}
                />
              </div>
            </div>
          </div>
        )}

        {/* Recurring Templates Tab */}
        {activeTab === 'recurring' && (
          <div>
            <div className='mb-4 flex justify-end'>
              <Button
                onClick={() => {
                  setSelectedSchedule(null)
                  setScheduleModalType('recurring')
                  scheduleModal.openModal()
                }}
                size='xs'
              >
                <PlusIcon />
                Create Template
              </Button>
            </div>
            <div className='space-y-4'>
              {recurringTemplates.length === 0 ? (
                <p className='text-center text-sm text-gray-500 dark:text-gray-400'>
                  No recurring templates found
                </p>
              ) : (
                recurringTemplates.map((template) => (
                  <div key={template._id} className='rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-white/[0.03]'>
                    <div className='flex items-center justify-between'>
                      <div>
                        <h4 className='font-medium text-gray-800 dark:text-white/90'>
                          {template.name}
                        </h4>
                        <p className='text-sm text-gray-500 dark:text-gray-400'>
                          {template.description || 'No description'}
                        </p>
                        {template.recurringPattern && (
                          <div className='mt-2 text-xs text-gray-500 dark:text-gray-400'>
                            {template.recurringPattern.frequency} - Every{' '}
                            {template.recurringPattern.interval}{' '}
                            {template.recurringPattern.frequency}
                            {template.recurringPattern.daysOfWeek &&
                              ` on ${template.recurringPattern.daysOfWeek
                                .map((d) => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d])
                                .join(', ')}`}
                          </div>
                        )}
                      </div>
                      <div className='flex items-center gap-2'>
                        <Badge color={template.status === 'active' ? 'success' : 'warning'}>
                          {template.status}
                        </Badge>
                        <button
                          onClick={() => {
                            setSelectedSchedule(template)
                            setScheduleModalType('recurring')
                            scheduleModal.openModal()
                          }}
                          className='rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                        >
                          <PencilIcon className='h-4 w-4' />
                        </button>
                        <button
                          onClick={async () => {
                            if (confirm('Are you sure you want to delete this template?')) {
                              try {
                                await deleteSchedule(template._id)
                                toast.success('Template deleted successfully')
                                fetchRecurringTemplates()
                              } catch (error) {
                                if (error instanceof Error) {
                                  toast.error(error.message)
                                }
                              }
                            }
                          }}
                          className='rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                        >
                          <TrashBinIcon className='h-4 w-4' />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* IF/THEN Rules Tab */}
        {activeTab === 'rules' && (
          <div>
            <div className='mb-4 flex justify-end'>
              <Button
                onClick={() => {
                  setSelectedSchedule(null)
                  setScheduleModalType('rule-based')
                  scheduleModal.openModal()
                }}
                size='xs'
              >
                <PlusIcon />
                Create Rule
              </Button>
            </div>
            <div className='space-y-4'>
              {rules.length === 0 ? (
                <p className='text-center text-sm text-gray-500 dark:text-gray-400'>
                  No IF/THEN rules found
                </p>
              ) : (
                rules.map((rule) => (
                  <div key={rule._id} className='rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-white/[0.03]'>
                    <div className='flex items-center justify-between'>
                      <div>
                        <h4 className='font-medium text-gray-800 dark:text-white/90'>
                          {rule.name}
                        </h4>
                        <p className='text-sm text-gray-500 dark:text-gray-400'>
                          {rule.description || 'No description'}
                        </p>
                        {rule.ruleConditions && rule.ruleConditions.length > 0 && (
                          <div className='mt-2'>
                            <div className='text-xs font-medium text-gray-600 dark:text-gray-400'>
                              IF:
                            </div>
                            {rule.ruleConditions.map((condition, idx) => (
                              <div key={idx} className='text-xs text-gray-500 dark:text-gray-400'>
                                {condition.type === 'vip_tier' &&
                                  `VIP Tier ${condition.operator} ${condition.value}`}
                                {condition.type === 'deposit' &&
                                  `Deposit ${condition.operator} ${condition.value}`}
                                {condition.type === 'wager' &&
                                  `Wager ${condition.operator} ${condition.value}`}
                                {condition.type === 'date' && `Date ${condition.operator} ${condition.value}`}
                              </div>
                            ))}
                          </div>
                        )}
                        {rule.ruleActions && rule.ruleActions.length > 0 && (
                          <div className='mt-2'>
                            <div className='text-xs font-medium text-gray-600 dark:text-gray-400'>
                              THEN:
                            </div>
                            {rule.ruleActions.map((action, idx) => (
                              <div key={idx} className='text-xs text-gray-500 dark:text-gray-400'>
                                {action.type === 'grant_bonus' &&
                                  `Grant bonus: ${action.bonusType || action.bonusId}`}
                                {action.type === 'send_notification' && `Send notification`}
                                {action.type === 'update_tier' && `Update tier`}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className='flex items-center gap-2'>
                        <Badge color={rule.status === 'active' ? 'success' : 'warning'}>
                          {rule.status}
                        </Badge>
                        <button
                          onClick={() => {
                            setSelectedSchedule(rule)
                            setScheduleModalType('rule-based')
                            scheduleModal.openModal()
                          }}
                          className='rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                        >
                          <PencilIcon className='h-4 w-4' />
                        </button>
                        <button
                          onClick={async () => {
                            if (confirm('Are you sure you want to delete this rule?')) {
                              try {
                                await deleteSchedule(rule._id)
                                toast.success('Rule deleted successfully')
                                fetchRules()
                              } catch (error) {
                                if (error instanceof Error) {
                                  toast.error(error.message)
                                }
                              }
                            }
                          }}
                          className='rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                        >
                          <TrashBinIcon className='h-4 w-4' />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </ComponentCard>

      {/* Schedule Modal */}
      <ScheduleModal
        isOpen={scheduleModal.isOpen}
        onClose={() => {
          scheduleModal.closeModal()
          setSelectedSchedule(null)
          setScheduleModalType(undefined)
        }}
        schedule={selectedSchedule}
        bonuses={bonuses}
        vipTiers={tiers}
        scheduleType={scheduleModalType}
        onSuccess={handleSuccess}
      />
    </div>
  )
}
