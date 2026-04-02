'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import * as z from 'zod'

import ComponentCard from '@/components/common/ComponentCard'
import IPCountrySelect from '@/components/form/IPCountrySelect'
import Label from '@/components/form/Label'
import Button from '@/components/ui/button/Button'

import { CountryProps, SiteSettings } from '@/types/site-settings'

// Define the form schema
const createFormSchema = () => {
  return z.object({
    allowedCountries: z.array(z.string()),
  })
}

type FormValues = z.infer<ReturnType<typeof createFormSchema>>

interface GEOIPSettingsCardProps {
  countries: CountryProps[]
  settings: Pick<SiteSettings, 'allowedCountries'>
  onSubmit: (data: FormValues) => void
}

const GEOIPSettingsCard = ({
  countries,
  settings,
  onSubmit,
}: GEOIPSettingsCardProps) => {
  // Create schema with initial values
  const formSchema = React.useMemo(() => createFormSchema(), [])

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    trigger,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      allowedCountries: settings.allowedCountries,
    },
    mode: 'onChange',
  })

  useEffect(() => {
    if (settings) {
      reset({ allowedCountries: settings.allowedCountries })
    } else {
      reset({ allowedCountries: [] })
    }
  }, [settings, reset])

  const onFormSubmit = handleSubmit(async (data: FormValues) => {
    await onSubmit(data)
    reset()
  })

  return (
    <ComponentCard title='Country IP Access'>
      <form onSubmit={onFormSubmit} className='space-y-6'>
        <div>
          <Label htmlFor='allowedCountries' className='flex justify-between'>
            Country List
            <span
              onClick={() => {
                setValue('allowedCountries', [])
                trigger('allowedCountries')
              }}
              className='text-blue-500 hover:text-red-500 hover:underline'
            >
              Clear All
            </span>
          </Label>
          <Controller
            name='allowedCountries'
            control={control}
            render={({ field }) => (
              <IPCountrySelect
                options={countries.map((c) => ({
                  value: c.code,
                  label: c.name,
                }))}
                onChange={(selected) =>
                  field.onChange(selected.map((c) => c.value))
                }
                value={countries
                  .filter((c) => field.value.includes(c.code))
                  .map((c) => ({
                    value: c.code,
                    label: c.name,
                  }))}
                isCountry={true}
              />
            )}
          />
          {errors.allowedCountries && (
            <p className='mt-1 text-xs text-red-500'>
              {errors.allowedCountries.message}
            </p>
          )}
        </div>
        <div className='flex justify-end'>
          <Button type='submit' size='sm' disabled={!isDirty || isSubmitting}>
            {isSubmitting ? 'Updating...' : 'Update'}
          </Button>
        </div>
      </form>
    </ComponentCard>
  )
}

export default GEOIPSettingsCard
