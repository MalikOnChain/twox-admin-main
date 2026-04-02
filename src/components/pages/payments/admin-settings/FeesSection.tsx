'use client'

import { Control, Controller } from 'react-hook-form'
import { Card } from '@/components/ui/card'
import Button from '@/components/ui/button/Button'
import Label from '@/components/form/Label'
import Input from '@/components/form/input/InputField'

interface FeesSectionProps {
  control: Control<any>
  availableOptions: {
    methods: string[]
    currencies: string[]
  }
}

export default function FeesSection({ control, availableOptions }: FeesSectionProps) {
  return (
    <Card>
      <div className='mb-4 flex items-center justify-between'>
        <h3 className='text-lg font-semibold text-gray-800 dark:text-white/90'>Fees</h3>
        <Controller
          name='paymentSettings.fees.methodFees'
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
                    feePercent: 0,
                    fixedFee: 0,
                  },
                ])
              }}
            >
              Add Method Fee
            </Button>
          )}
        />
      </div>
      <div className='mb-4 grid grid-cols-1 gap-4 md:grid-cols-2'>
        <div>
          <Label>Default Deposit Fee %</Label>
          <Controller
            name='paymentSettings.fees.depositFeePercent'
            control={control}
            render={({ field }) => (
              <Input
                type='number'
                step={0.01}
                value={field.value || 0}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            )}
          />
        </div>
        <div>
          <Label>Default Withdrawal Fee %</Label>
          <Controller
            name='paymentSettings.fees.withdrawFeePercent'
            control={control}
            render={({ field }) => (
              <Input
                type='number'
                step={0.01}
                value={field.value || 0}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            )}
          />
        </div>
      </div>
      <div>
        <h4 className='mb-2 text-sm font-medium text-gray-700 dark:text-gray-300'>
          Method-Specific Fees
        </h4>
        <Controller
          name='paymentSettings.fees.methodFees'
          control={control}
          render={({ field }) => (
            <div className='space-y-3'>
              {field.value && field.value.length > 0 ? (
                field.value.map((fee: any, index: number) => (
                  <div
                    key={index}
                    className='flex items-end gap-3 rounded-lg border border-gray-200 p-3 dark:border-gray-700'
                  >
                    <div className='flex-1'>
                      <Label>Method</Label>
                      <Controller
                        name={`paymentSettings.fees.methodFees.${index}.method`}
                        control={control}
                        render={({ field: f }) => (
                          <select
                            value={f.value || ''}
                            onChange={(e) => f.onChange(e.target.value)}
                            className='w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
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
                    <div className='flex-1'>
                      <Label>Currency</Label>
                      <Controller
                        name={`paymentSettings.fees.methodFees.${index}.currency`}
                        control={control}
                        render={({ field: f }) => (
                          <select
                            value={f.value || ''}
                            onChange={(e) => f.onChange(e.target.value)}
                            className='w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
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
                    <div className='flex-1'>
                      <Label>Fee %</Label>
                      <Controller
                        name={`paymentSettings.fees.methodFees.${index}.feePercent`}
                        control={control}
                        render={({ field: f }) => (
                          <Input
                            type='number'
                            step={0.01}
                            value={f.value || 0}
                            onChange={(e) => f.onChange(Number(e.target.value))}
                          />
                        )}
                      />
                    </div>
                    <div className='flex-1'>
                      <Label>Fixed Fee (Optional)</Label>
                      <Controller
                        name={`paymentSettings.fees.methodFees.${index}.fixedFee`}
                        control={control}
                        render={({ field: f }) => (
                          <Input
                            type='number'
                            step={0.01}
                            value={f.value || 0}
                            onChange={(e) => f.onChange(Number(e.target.value))}
                          />
                        )}
                      />
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
                ))
              ) : (
                <p className='text-sm text-gray-500 dark:text-gray-400'>
                  No method-specific fees configured. Click "Add Method Fee" to add one.
                </p>
              )}
            </div>
          )}
        />
      </div>
    </Card>
  )
}

