'use client'

import { Control, Controller } from 'react-hook-form'
import { Card } from '@/components/ui/card'
import Button from '@/components/ui/button/Button'
import Label from '@/components/form/Label'
import Input from '@/components/form/input/InputField'
import Badge from '@/components/ui/badge/Badge'

interface VipOverridesSectionProps {
  control: Control<any>
  availableOptions: {
    vipTiers: Array<{ _id: string; name: string }>
    methods: string[]
    currencies: string[]
  }
}

export default function VipOverridesSection({
  control,
  availableOptions,
}: VipOverridesSectionProps) {
  return (
    <Card>
      <div className='mb-4 flex items-center justify-between'>
        <h3 className='text-lg font-semibold text-gray-800 dark:text-white/90'>VIP Overrides</h3>
        <Controller
          name='paymentSettings.vipOverrides'
          control={control}
          render={({ field }) => (
            <Button
              type='button'
              size='sm'
              variant='outline'
              onClick={() => {
                const current = field.value || []
                const availableTiers = availableOptions.vipTiers.filter(
                  (t: any) => !current.some((vo: any) => vo.tierId === t._id)
                )
                if (availableTiers.length > 0) {
                  field.onChange([
                    ...current,
                    {
                      tierId: availableTiers[0]._id,
                      tierName: availableTiers[0].name,
                      methodLimits: [],
                      fees: {},
                      dailyCaps: {},
                    },
                  ])
                }
              }}
            >
              Add VIP Override
            </Button>
          )}
        />
      </div>
      <Controller
        name='paymentSettings.vipOverrides'
        control={control}
        render={({ field }) => (
          <div className='space-y-4'>
            {field.value && field.value.length > 0 ? (
              field.value.map((override: any, index: number) => {
                const tier = availableOptions.vipTiers.find(
                  (t: any) => t._id === override.tierId
                )
                return (
                  <div
                    key={index}
                    className='rounded-lg border border-gray-200 p-4 dark:border-gray-700'
                  >
                    <div className='mb-3 flex items-center justify-between'>
                      <Badge size='sm' color='warning'>
                        {override.tierName || tier?.name || 'VIP Tier'}
                      </Badge>
                      <Button
                        type='button'
                        size='sm'
                        variant='outline'
                        onClick={() => {
                          const updated = [...(field.value || [])]
                          updated.splice(index, 1)
                          field.onChange(updated)
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                    <div className='space-y-4'>
                      {/* VIP Method Limits */}
                      <div>
                        <div className='mb-2 flex items-center justify-between'>
                          <h4 className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                            Method Limits Override
                          </h4>
                          <Controller
                            name={`paymentSettings.vipOverrides.${index}.methodLimits`}
                            control={control}
                            render={({ field: f }) => (
                              <Button
                                type='button'
                                size='sm'
                                variant='outline'
                                onClick={() => {
                                  const current = f.value || []
                                  f.onChange([
                                    ...current,
                                    {
                                      method: availableOptions.methods[0] || 'pix',
                                      currency: availableOptions.currencies[0] || 'BRL',
                                      depositMin: 0,
                                      depositMax: 0,
                                      withdrawMin: 0,
                                      withdrawMax: 0,
                                    },
                                  ])
                                }}
                              >
                                Add Limit
                              </Button>
                            )}
                          />
                        </div>
                        <Controller
                          name={`paymentSettings.vipOverrides.${index}.methodLimits`}
                          control={control}
                          render={({ field: f }) => (
                            <div className='space-y-2'>
                              {f.value && f.value.length > 0 ? (
                                f.value.map((limit: any, limitIndex: number) => (
                                  <div
                                    key={limitIndex}
                                    className='rounded-lg border border-gray-200 p-3 dark:border-gray-700'
                                  >
                                    <div className='mb-2 flex items-center justify-between'>
                                      <div className='flex gap-2'>
                                        <select
                                          value={limit.method || ''}
                                          onChange={(e) => {
                                            const updated = [...(f.value || [])]
                                            updated[limitIndex].method = e.target.value
                                            f.onChange(updated)
                                          }}
                                          className='rounded-lg border border-gray-300 bg-white px-2 py-1 text-xs dark:border-gray-600 dark:bg-gray-800 dark:text-white'
                                        >
                                          {availableOptions.methods.map((m: string) => (
                                            <option key={m} value={m}>
                                              {m}
                                            </option>
                                          ))}
                                        </select>
                                        <select
                                          value={limit.currency || ''}
                                          onChange={(e) => {
                                            const updated = [...(f.value || [])]
                                            updated[limitIndex].currency = e.target.value
                                            f.onChange(updated)
                                          }}
                                          className='rounded-lg border border-gray-300 bg-white px-2 py-1 text-xs dark:border-gray-600 dark:bg-gray-800 dark:text-white'
                                        >
                                          {availableOptions.currencies.map((c: string) => (
                                            <option key={c} value={c}>
                                              {c}
                                            </option>
                                          ))}
                                        </select>
                                      </div>
                                      <Button
                                        type='button'
                                        size='sm'
                                        variant='outline'
                                        onClick={() => {
                                          const updated = [...(f.value || [])]
                                          updated.splice(limitIndex, 1)
                                          f.onChange(updated)
                                        }}
                                      >
                                        Remove
                                      </Button>
                                    </div>
                                    <div className='grid grid-cols-4 gap-2'>
                                      <Input
                                        type='number'
                                        placeholder='Dep Min'
                                        value={limit.depositMin || ''}
                                        onChange={(e) => {
                                          const updated = [...(f.value || [])]
                                          updated[limitIndex].depositMin = Number(e.target.value)
                                          f.onChange(updated)
                                        }}
                                      />
                                      <Input
                                        type='number'
                                        placeholder='Dep Max'
                                        value={limit.depositMax || ''}
                                        onChange={(e) => {
                                          const updated = [...(f.value || [])]
                                          updated[limitIndex].depositMax = Number(e.target.value)
                                          f.onChange(updated)
                                        }}
                                      />
                                      <Input
                                        type='number'
                                        placeholder='W/D Min'
                                        value={limit.withdrawMin || ''}
                                        onChange={(e) => {
                                          const updated = [...(f.value || [])]
                                          updated[limitIndex].withdrawMin = Number(e.target.value)
                                          f.onChange(updated)
                                        }}
                                      />
                                      <Input
                                        type='number'
                                        placeholder='W/D Max'
                                        value={limit.withdrawMax || ''}
                                        onChange={(e) => {
                                          const updated = [...(f.value || [])]
                                          updated[limitIndex].withdrawMax = Number(e.target.value)
                                          f.onChange(updated)
                                        }}
                                      />
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <p className='text-xs text-gray-500 dark:text-gray-400'>
                                  No method limits override
                                </p>
                              )}
                            </div>
                          )}
                        />
                      </div>
                      {/* VIP Fees */}
                      <div>
                        <h4 className='mb-2 text-sm font-medium text-gray-700 dark:text-gray-300'>
                          Fees Override
                        </h4>
                        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                          <div>
                            <Label>Deposit Fee %</Label>
                            <Controller
                              name={`paymentSettings.vipOverrides.${index}.fees.depositFeePercent`}
                              control={control}
                              render={({ field: f }) => (
                                <Input
                                  type='number'
                                  step={0.01}
                                  value={f.value || ''}
                                  onChange={(e) =>
                                    f.onChange(
                                      e.target.value ? Number(e.target.value) : undefined
                                    )
                                  }
                                  placeholder='Leave empty to use default'
                                />
                              )}
                            />
                          </div>
                          <div>
                            <Label>Withdrawal Fee %</Label>
                            <Controller
                              name={`paymentSettings.vipOverrides.${index}.fees.withdrawFeePercent`}
                              control={control}
                              render={({ field: f }) => (
                                <Input
                                  type='number'
                                  step={0.01}
                                  value={f.value || ''}
                                  onChange={(e) =>
                                    f.onChange(
                                      e.target.value ? Number(e.target.value) : undefined
                                    )
                                  }
                                  placeholder='Leave empty to use default'
                                />
                              )}
                            />
                          </div>
                        </div>
                      </div>
                      {/* VIP Daily Caps */}
                      <div>
                        <h4 className='mb-2 text-sm font-medium text-gray-700 dark:text-gray-300'>
                          Daily Caps Override
                        </h4>
                        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                          <div>
                            <Label>Deposit Cap</Label>
                            <Controller
                              name={`paymentSettings.vipOverrides.${index}.dailyCaps.depositCap`}
                              control={control}
                              render={({ field: f }) => (
                                <Input
                                  type='number'
                                  value={f.value || ''}
                                  onChange={(e) =>
                                    f.onChange(
                                      e.target.value ? Number(e.target.value) : undefined
                                    )
                                  }
                                  placeholder='Leave empty to use default'
                                />
                              )}
                            />
                          </div>
                          <div>
                            <Label>Withdrawal Cap</Label>
                            <Controller
                              name={`paymentSettings.vipOverrides.${index}.dailyCaps.withdrawCap`}
                              control={control}
                              render={({ field: f }) => (
                                <Input
                                  type='number'
                                  value={f.value || ''}
                                  onChange={(e) =>
                                    f.onChange(
                                      e.target.value ? Number(e.target.value) : undefined
                                    )
                                  }
                                  placeholder='Leave empty to use default'
                                />
                              )}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            ) : (
              <p className='text-sm text-gray-500 dark:text-gray-400'>
                No VIP overrides configured. Click "Add VIP Override" to add one.
              </p>
            )}
          </div>
        )}
      />
    </Card>
  )
}

