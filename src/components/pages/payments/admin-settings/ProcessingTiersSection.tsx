'use client'

import { Control, Controller } from 'react-hook-form'
import { Card } from '@/components/ui/card'
import Button from '@/components/ui/button/Button'
import Label from '@/components/form/Label'
import Input from '@/components/form/input/InputField'
import Badge from '@/components/ui/badge/Badge'

interface ProcessingTiersSectionProps {
  control: Control<any>
}

export default function ProcessingTiersSection({ control }: ProcessingTiersSectionProps) {
  return (
    <Card>
      <div className='mb-4 flex items-center justify-between'>
        <h3 className='text-lg font-semibold text-gray-800 dark:text-white/90'>
          Processing Tiers
        </h3>
        <Controller
          name='paymentSettings.processingTiers'
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
                    tier: `Tier ${current.length + 1}`,
                    minAmount: 0,
                    maxAmount: 0,
                    processingTime: 0,
                    description: '',
                  },
                ])
              }}
            >
              Add Tier
            </Button>
          )}
        />
      </div>
      <Controller
        name='paymentSettings.processingTiers'
        control={control}
        render={({ field }) => (
          <div className='space-y-4'>
            {field.value && field.value.length > 0 ? (
              field.value.map((tier: any, index: number) => (
                <div
                  key={index}
                  className='rounded-lg border border-gray-200 p-4 dark:border-gray-700'
                >
                  <div className='mb-3 flex items-center justify-between'>
                    <Badge size='sm' color='info'>
                      {tier.tier}
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
                  <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
                    <div>
                      <Label>Tier Name</Label>
                      <Controller
                        name={`paymentSettings.processingTiers.${index}.tier`}
                        control={control}
                        render={({ field: f }) => (
                          <Input
                            type='text'
                            value={f.value}
                            onChange={(e) => f.onChange(e.target.value)}
                          />
                        )}
                      />
                    </div>
                    <div>
                      <Label>Min Amount</Label>
                      <Controller
                        name={`paymentSettings.processingTiers.${index}.minAmount`}
                        control={control}
                        render={({ field: f }) => (
                          <Input
                            type='number'
                            value={f.value}
                            onChange={(e) => f.onChange(Number(e.target.value))}
                          />
                        )}
                      />
                    </div>
                    <div>
                      <Label>Max Amount</Label>
                      <Controller
                        name={`paymentSettings.processingTiers.${index}.maxAmount`}
                        control={control}
                        render={({ field: f }) => (
                          <Input
                            type='number'
                            value={f.value}
                            onChange={(e) => f.onChange(Number(e.target.value))}
                          />
                        )}
                      />
                    </div>
                    <div>
                      <Label>Processing Time (minutes)</Label>
                      <Controller
                        name={`paymentSettings.processingTiers.${index}.processingTime`}
                        control={control}
                        render={({ field: f }) => (
                          <Input
                            type='number'
                            value={f.value}
                            onChange={(e) => f.onChange(Number(e.target.value))}
                          />
                        )}
                      />
                    </div>
                  </div>
                  <div className='mt-3'>
                    <Label>Description (Optional)</Label>
                    <Controller
                      name={`paymentSettings.processingTiers.${index}.description`}
                      control={control}
                      render={({ field: f }) => (
                        <Input
                          type='text'
                          value={f.value || ''}
                          onChange={(e) => f.onChange(e.target.value)}
                          placeholder='Tier description'
                        />
                      )}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className='text-sm text-gray-500 dark:text-gray-400'>
                No processing tiers configured. Click "Add Tier" to add one.
              </p>
            )}
          </div>
        )}
      />
    </Card>
  )
}

