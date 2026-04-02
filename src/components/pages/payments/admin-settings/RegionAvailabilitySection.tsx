'use client'

import { Control, Controller } from 'react-hook-form'
import { Card } from '@/components/ui/card'
import Button from '@/components/ui/button/Button'
import Label from '@/components/form/Label'
import Switch from '@/components/form/switch/Switch'
import Badge from '@/components/ui/badge/Badge'

interface RegionAvailabilitySectionProps {
  control: Control<any>
  availableOptions: {
    regions: string[]
    methods: string[]
  }
}

export default function RegionAvailabilitySection({
  control,
  availableOptions,
}: RegionAvailabilitySectionProps) {
  return (
    <Card>
      <div className='mb-4 flex items-center justify-between'>
        <h3 className='text-lg font-semibold text-gray-800 dark:text-white/90'>
          Region Availability
        </h3>
        <Controller
          name='paymentSettings.regionAvailability'
          control={control}
          render={({ field }) => (
            <Button
              type='button'
              size='sm'
              variant='outline'
              onClick={() => {
                const current = field.value || []
                const availableRegions = availableOptions.regions.filter(
                  (r: string) => !current.some((ra: any) => ra.region === r)
                )
                if (availableRegions.length > 0) {
                  field.onChange([
                    ...current,
                    {
                      region: availableRegions[0],
                      methods: [],
                      enabled: true,
                    },
                  ])
                }
              }}
            >
              Add Region
            </Button>
          )}
        />
      </div>
      <Controller
        name='paymentSettings.regionAvailability'
        control={control}
        render={({ field }) => (
          <div className='space-y-4'>
            {field.value && field.value.length > 0 ? (
              field.value.map((region: any, index: number) => (
                <div
                  key={index}
                  className='rounded-lg border border-gray-200 p-4 dark:border-gray-700'
                >
                  <div className='mb-3 flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                      <Badge size='sm' color='success'>
                        {region.region}
                      </Badge>
                      <Controller
                        name={`paymentSettings.regionAvailability.${index}.enabled`}
                        control={control}
                        render={({ field: f }) => (
                          <Switch
                            label={f.value ? 'Enabled' : 'Disabled'}
                            defaultChecked={f.value}
                            onChange={(e) => f.onChange(e)}
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
                  <div>
                    <Label>Available Methods</Label>
                    <div className='mt-2 flex flex-wrap gap-2'>
                      {availableOptions.methods.map((method: string) => (
                        <Controller
                          key={method}
                          name={`paymentSettings.regionAvailability.${index}.methods`}
                          control={control}
                          render={({ field: f }) => {
                            const isSelected = f.value?.includes(method) || false
                            return (
                              <button
                                type='button'
                                onClick={() => {
                                  const current = f.value || []
                                  if (isSelected) {
                                    f.onChange(current.filter((m: string) => m !== method))
                                  } else {
                                    f.onChange([...current, method])
                                  }
                                }}
                                className={`rounded-lg border px-3 py-1 text-sm ${
                                  isSelected
                                    ? 'border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-900/20 dark:text-blue-300'
                                    : 'border-gray-300 bg-white text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300'
                                }`}
                              >
                                {method}
                              </button>
                            )
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className='text-sm text-gray-500 dark:text-gray-400'>
                No region availability configured. Click "Add Region" to add one.
              </p>
            )}
          </div>
        )}
      />
    </Card>
  )
}

