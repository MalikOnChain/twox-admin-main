'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Controller, useForm } from 'react-hook-form'
import ComponentCard from '@/components/common/ComponentCard'
import Button from '@/components/ui/button/Button'
import Input from '@/components/form/input/InputField'
import Label from '@/components/form/Label'
import Switch from '@/components/form/switch/Switch'
import Loading from '@/components/common/Loading'
import {
  getWinnersFeedSettings,
  updateWinnersFeedSettings,
  getWinners,
  featureWinner,
  hideWinner,
  exportWinnersAnalytics,
  IWinnersFeedSettings,
} from '@/api/cms'

export default function WinnersFeedCard() {
  const [settings, setSettings] = useState<IWinnersFeedSettings | null>(null)
  const [winners, setWinners] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingWinners, setIsLoadingWinners] = useState(false)
  const [activeTab, setActiveTab] = useState<'settings' | 'winners'>('settings')

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty, isSubmitting },
  } = useForm({
    defaultValues: {
      isEnabled: true,
      minWinAmount: 0,
      minBetAmount: 0,
      maskUsername: false,
      maskPattern: 'partial' as 'partial' | 'full',
      showAmount: true,
      showGame: true,
      showTime: true,
      maxItems: 50,
    },
  })

  const fetchSettings = async () => {
    try {
      setIsLoading(true)
      const response = await getWinnersFeedSettings()
      setSettings(response.settings)
      reset({
        isEnabled: response.settings.isEnabled,
        minWinAmount: response.settings.inclusionCriteria.minWinAmount || 0,
        minBetAmount: response.settings.inclusionCriteria.minBetAmount || 0,
        maskUsername: response.settings.maskRules.maskUsername,
        maskPattern: response.settings.maskRules.maskPattern || 'partial',
        showAmount: response.settings.maskRules.showAmount,
        showGame: response.settings.maskRules.showGame,
        showTime: response.settings.maskRules.showTime,
        maxItems: response.settings.displaySettings.maxItems || 50,
      })
    } catch (error) {
      toast.error('Failed to fetch winners feed settings')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchWinners = async () => {
    try {
      setIsLoadingWinners(true)
      const response = await getWinners({ page: 1, limit: 100 })
      console.log('Winners response:', response)
      if (response && response.winners) {
        setWinners(response.winners)
      } else {
        setWinners([])
      }
    } catch (error) {
      console.error('Error fetching winners:', error)
      toast.error('Failed to fetch winners')
      setWinners([])
    } finally {
      setIsLoadingWinners(false)
    }
  }

  useEffect(() => {
    fetchSettings()
  }, [])

  useEffect(() => {
    if (activeTab === 'winners') {
      fetchWinners()
    }
  }, [activeTab])

  const onSubmit = async (data: any) => {
    try {
      const response = await updateWinnersFeedSettings({
        isEnabled: data.isEnabled,
        inclusionCriteria: {
          minWinAmount: data.minWinAmount,
          minBetAmount: data.minBetAmount || undefined,
        },
        maskRules: {
          maskUsername: data.maskUsername,
          maskPattern: data.maskPattern,
          showAmount: data.showAmount,
          showGame: data.showGame,
          showTime: data.showTime,
        },
        displaySettings: {
          maxItems: data.maxItems,
        },
      })
      setSettings(response.settings)
      toast.success('Winners feed settings updated successfully')
      fetchSettings()
    } catch (error) {
      toast.error('Failed to update winners feed settings')
    }
  }

  const handleExport = async () => {
    try {
      await exportWinnersAnalytics()
      toast.success('Analytics export initiated')
    } catch (error) {
      toast.error('Failed to export analytics')
    }
  }

  if (isLoading) {
    return <Loading />
  }

  return (
    <ComponentCard title='Winners Feed'>
      <div className='space-y-4'>
        <div className='border-b border-gray-200 dark:border-gray-700'>
          <div className='flex gap-4'>
            <button
              onClick={() => setActiveTab('settings')}
              className={`border-b-2 px-4 py-2 ${
                activeTab === 'settings'
                  ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
              }`}
            >
              Settings
            </button>
            <button
              onClick={() => setActiveTab('winners')}
              className={`border-b-2 px-4 py-2 ${
                activeTab === 'winners'
                  ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
              }`}
            >
              Winners List
            </button>
          </div>
        </div>

        {activeTab === 'settings' && (
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            <div className='flex items-center gap-2'>
              <Controller
                name='isEnabled'
                control={control}
                render={({ field }) => (
                  <Switch
                    defaultChecked={field.value}
                    onChange={(checked) => field.onChange(checked)}
                  />
                )}
              />
              <Label>Enable Winners Feed</Label>
            </div>

            <div className='space-y-4'>
              <h3 className='font-semibold text-gray-800 dark:text-white'>Inclusion Criteria</h3>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <Label>Minimum Win Amount</Label>
                  <Controller
                    name='minWinAmount'
                    control={control}
                    render={({ field }) => (
                      <Input
                        type='number'
                        step={0.01}
                        min={0}
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        className='mt-2'
                      />
                    )}
                  />
                </div>
                <div>
                  <Label>Minimum Bet Amount (Optional)</Label>
                  <Controller
                    name='minBetAmount'
                    control={control}
                    render={({ field }) => (
                      <Input
                        type='number'
                        step={0.01}
                        min={0}
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        className='mt-2'
                      />
                    )}
                  />
                </div>
              </div>
            </div>

            <div className='space-y-4'>
              <h3 className='font-semibold text-gray-800 dark:text-white'>Mask Rules</h3>
              <div className='flex items-center gap-2'>
                <Controller
                  name='maskUsername'
                  control={control}
                  render={({ field }) => (
                    <Switch
                      defaultChecked={field.value}
                      onChange={(checked) => field.onChange(checked)}
                    />
                  )}
                />
                <Label>Mask Username</Label>
              </div>

              <div>
                <Label>Mask Pattern</Label>
                <Controller
                  name='maskPattern'
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      className='mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white'
                    >
                      <option value='partial'>Partial (show first 2 chars)</option>
                      <option value='full'>Full (show only ***)</option>
                    </select>
                  )}
                />
              </div>

              <div className='space-y-2'>
                <div className='flex items-center gap-2'>
                  <Controller
                    name='showAmount'
                    control={control}
                    render={({ field }) => (
                      <Switch
                        defaultChecked={field.value}
                        onChange={(checked) => field.onChange(checked)}
                      />
                    )}
                  />
                  <Label>Show Amount</Label>
                </div>
                <div className='flex items-center gap-2'>
                  <Controller
                    name='showGame'
                    control={control}
                    render={({ field }) => (
                      <Switch
                        defaultChecked={field.value}
                        onChange={(checked) => field.onChange(checked)}
                      />
                    )}
                  />
                  <Label>Show Game</Label>
                </div>
                <div className='flex items-center gap-2'>
                  <Controller
                    name='showTime'
                    control={control}
                    render={({ field }) => (
                      <Switch
                        defaultChecked={field.value}
                        onChange={(checked) => field.onChange(checked)}
                      />
                    )}
                  />
                  <Label>Show Time</Label>
                </div>
              </div>
            </div>

            <div className='space-y-4'>
              <h3 className='font-semibold text-gray-800 dark:text-white'>Display Settings</h3>
              <div>
                <Label>Max Items</Label>
                <Controller
                  name='maxItems'
                  control={control}
                  render={({ field }) => (
                    <Input
                      type='number'
                      min={1}
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                      className='mt-2'
                    />
                  )}
                />
              </div>
            </div>

            <div className='flex justify-between'>
              <Button type='button' variant='outline' onClick={handleExport}>
                Export Analytics
              </Button>
              <Button type='submit' size='sm' disabled={!isDirty || isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Settings'}
              </Button>
            </div>
          </form>
        )}

        {activeTab === 'winners' && (
          <div className='space-y-4'>
            <div className='flex justify-between'>
              <p className='text-sm text-gray-500 dark:text-gray-400'>
                Manage featured and hidden winners
              </p>
            </div>

            {isLoadingWinners ? (
              <Loading />
            ) : winners.length === 0 ? (
              <p className='text-center text-gray-500 dark:text-gray-400'>No winners found</p>
            ) : (
              <div className='space-y-2'>
                {winners.map((winner: any) => (
                  <div
                    key={winner.id}
                    className='flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-700'
                  >
                    <div>
                      <p className='font-semibold'>{winner.player || '***'}</p>
                      <p className='text-sm text-gray-500'>
                        {winner.gameName} - ${winner.winAmount}
                      </p>
                    </div>
                    <div className='flex gap-2'>
                      <Button
                        size='sm'
                        variant='outline'
                        onClick={async () => {
                          try {
                            await featureWinner(winner.id)
                            toast.success('Winner featured successfully')
                            fetchWinners()
                          } catch (error) {
                            toast.error('Failed to feature winner')
                          }
                        }}
                      >
                        Feature
                      </Button>
                      <Button
                        size='sm'
                        variant='outline'
                        onClick={async () => {
                          try {
                            await hideWinner(winner.id)
                            toast.success('Winner hidden successfully')
                            fetchWinners()
                          } catch (error) {
                            toast.error('Failed to hide winner')
                          }
                        }}
                      >
                        Hide
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </ComponentCard>
  )
}

