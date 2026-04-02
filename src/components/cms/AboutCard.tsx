'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import * as z from 'zod'

import ComponentCard from '@/components/common/ComponentCard'
import RichTextEditor from '@/components/form/RichTextEditor'
import Button from '@/components/ui/button/Button'

import { SiteSettings } from '@/types/site-settings'

// Define the form schema
const createFormSchema = () => {
  return z.object({
    about: z.string().min(50, 'About must be at least 50 characters'),
  })
}

type FormValues = z.infer<ReturnType<typeof createFormSchema>>

interface AboutCardProps {
  settings: Pick<SiteSettings, 'about'>
  onSubmit: (data: FormValues) => void
}

const AboutCard = ({ settings, onSubmit }: AboutCardProps) => {
  // Create schema with initial values
  const formSchema = React.useMemo(() => createFormSchema(), [])

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      about: settings.about,
    },
    mode: 'onChange',
  })

  const onFormSubmit = handleSubmit(async (data: FormValues) => {
    if (errors.about?.message) return

    await onSubmit(data)
    reset()
  })

  useEffect(() => {
    reset(settings)
  }, [settings, reset])

  return (
    <ComponentCard title='About Settings'>
      <form onSubmit={onFormSubmit} className='space-y-6'>
        <Controller
          name='about'
          control={control}
          render={({ field }) => (
            <RichTextEditor value={field.value} onChange={field.onChange} />
          )}
        />
        {Boolean(errors.about?.message) && (
          <p className='text-error-500 mt-1.5 text-xs'>
            {errors.about?.message}
          </p>
        )}
        <style jsx global>{`
          .rsw-ce {
            background-color: white;
            min-height: 500px;
          }
        `}</style>
        <div className='flex justify-end'>
          <Button type='submit' size='sm' disabled={!isDirty || isSubmitting}>
            {isSubmitting ? 'Updating...' : 'Update'}
          </Button>
        </div>
      </form>
    </ComponentCard>
  )
}

export default AboutCard
