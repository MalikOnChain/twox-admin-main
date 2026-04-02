'use client'

import { Control, Controller } from 'react-hook-form'
import { Card } from '@/components/ui/card'
import Button from '@/components/ui/button/Button'
import Label from '@/components/form/Label'
import Input from '@/components/form/input/InputField'
import Badge from '@/components/ui/badge/Badge'

interface MethodLimitsSectionProps {
  control: Control<any>
  availableOptions: {
    methods: string[]
    currencies: string[]
  }
  defaultDepositMin: number
  defaultWithdrawMin: number
  defaultWithdrawMax: number
}

export default function MethodLimitsSection({
  control,
  availableOptions,
  defaultDepositMin,
  defaultWithdrawMin,
  defaultWithdrawMax,
}: MethodLimitsSectionProps) {
  return (
    <Card>
      <div className='mb-4 flex items-center justify-between'>
        <h3 className='text-lg font-semibold text-gray-800 dark:text-white/90'>
          Min/Max Limits per Method & Currency
        </h3>
        <Controller
          name='paymentSettings.methodLimits'
          control={control}
          render={({ field }) => (
            <Button
              type='button'
              size='sm'
              variant='outline'
              onClick={() => {
                const current = field.value || []
                field.onChange([
                  ...current,
                  {
                    method: availableOptions.methods[0] || 'pix',
                    currency: availableOptions.currencies[0] || 'BRL',
                    depositMin: defaultDepositMin || 0,
                    depositMax: 0,
                    withdrawMin: defaultWithdrawMin || 0,
                    withdrawMax: defaultWithdrawMax || 0,
                  },
                ])
              }}
            >
              Add Method
            </Button>
          )}
        />
      </div>
      <Controller
        name='paymentSettings.methodLimits'
        control={control}
        render={({ field }) => (
          <div className='space-y-4'>
            {field.value && field.value.length > 0 ? (
              field.value.map((limit: any, index: number) => (
                <div
                  key={index}
                  className='rounded-lg border border-gray-200 p-4 dark:border-gray-700'
                >
                  <div className='mb-3 flex items-center justify-between'>
                    <div className='flex items-end gap-3'>
                      <div>
                        <Label>Method</Label>
                        <Controller
                          name={`paymentSettings.methodLimits.${index}.method`}
                          control={control}
                          render={({ field: f }) => (
                            <select
                              value={f.value || ''}
                              onChange={(e) => f.onChange(e.target.value)}
                              className='rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
                            >
                              {availableOptions.methods.map((m: string) => (
                                <option key={m} value={m}>
                                  {m}
                                </option>
                              ))}
                            </select>
                          )}
                        />
                      </div>
                      <div>
                        <Label>Currency</Label>
                        <Controller
                          name={`paymentSettings.methodLimits.${index}.currency`}
                          control={control}
                          render={({ field: f }) => (
                            <select
                              value={f.value || ''}
                              onChange={(e) => f.onChange(e.target.value)}
                              className='rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
                            >
                              {availableOptions.currencies.map((c: string) => (
                                <option key={c} value={c}>
                                  {c}
                                </option>
                              ))}
                            </select>
                          )}
                        />
                      </div>
                    </div>
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
                  <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
                    <div>
                      <Label>Deposit Min</Label>
                      <Controller
                        name={`paymentSettings.methodLimits.${index}.depositMin`}
                        control={control}
                        render={({ field: f }) => (
                          <Input
                            type='number'
                            value={f.value || 0}
                            onChange={(e) => f.onChange(Number(e.target.value))}
                            placeholder={defaultDepositMin?.toString() || '0'}
                          />
                        )}
                      />
                    </div>
                    <div>
                      <Label>Deposit Max</Label>
                      <Controller
                        name={`paymentSettings.methodLimits.${index}.depositMax`}
                        control={control}
                        render={({ field: f }) => (
                          <Input
                            type='number'
                            value={f.value || 0}
                            onChange={(e) => f.onChange(Number(e.target.value))}
                          />
                        )}
                      />
                    </div>
                    <div>
                      <Label>Withdraw Min</Label>
                      <Controller
                        name={`paymentSettings.methodLimits.${index}.withdrawMin`}
                        control={control}
                        render={({ field: f }) => (
                          <Input
                            type='number'
                            value={f.value || 0}
                            onChange={(e) => f.onChange(Number(e.target.value))}
                            placeholder={defaultWithdrawMin?.toString() || '0'}
                          />
                        )}
                      />
                    </div>
                    <div>
                      <Label>Withdraw Max</Label>
                      <Controller
                        name={`paymentSettings.methodLimits.${index}.withdrawMax`}
                        control={control}
                        render={({ field: f }) => (
                          <Input
                            type='number'
                            value={f.value || 0}
                            onChange={(e) => f.onChange(Number(e.target.value))}
                            placeholder={defaultWithdrawMax?.toString() || '0'}
                          />
                        )}
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className='text-sm text-gray-500 dark:text-gray-400'>
                No method limits configured. Click "Add Method" to add one.
              </p>
            )}
          </div>
        )}
      />
    </Card>
  )
}

