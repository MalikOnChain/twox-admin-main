'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { EmailTemplate } from '@/api/email-template'

import LoadingSpinner from '@/components/common/LoadingSpinner'
import Input from '@/components/form/input/InputField'
import Label from '@/components/form/Label'
import Button from '@/components/ui/button/Button'
import { Modal } from '@/components/ui/modal'

const emailTemplateFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  subject: z.string().min(1, 'Subject is required'),
  html: z.string().min(1, 'HTML content is required'),
  requiredVariables: z.array(z.string()),
})

type EmailTemplateFormValues = z.infer<typeof emailTemplateFormSchema>

const EmailTemplateDetailModal = ({
  isOpen,
  closeModal,
  detail,
  onSubmit,
}: {
  isOpen: boolean
  closeModal?: () => void
  detail?: EmailTemplate
  onSubmit: (data: Partial<EmailTemplate>) => Promise<boolean>
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [detailInfo, setDetailInfo] = useState<EmailTemplate | null>(null)
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EmailTemplateFormValues>({
    resolver: zodResolver(emailTemplateFormSchema),
    defaultValues: {
      name: detail?.name || '',
      subject: detail?.subject || '',
      html: detail?.html || '',
      requiredVariables: detail?.requiredVariables || [],
    },
  })

  useEffect(() => {
    if (isOpen) {
      setDetailInfo(detail)
      if (detail) {
        reset({
          name: detail.name,
          subject: detail.subject,
          html: detail.html,
          requiredVariables: detail.requiredVariables,
        })
      } else {
        reset({
          name: '',
          subject: '',
          html: '',
          requiredVariables: [],
        })
      }
    }
  }, [detail, isOpen, reset])

  const handleOnSubmit = async (data: EmailTemplateFormValues) => {
    setIsLoading(true)
    try {
      const isSuccess = await onSubmit(data)
      if (isSuccess) {
        reset()
        handleClose()
      }
    } catch (error) {
      console.error('Error submitting email template:', error)
      toast.error('Failed to save email template')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    reset({
      name: '',
      subject: '',
      html: '',
      requiredVariables: [],
    })
    closeModal()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      showCloseButton={true}
      className='m-4 max-w-[700px]'
      position='start'
    >
      <div className='overflow-hidden rounded-3xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]'>
        <div className='max-w-full overflow-x-auto p-5'>
          <form onSubmit={handleSubmit(handleOnSubmit)}>
            <div>
              <div className='mb-5 px-2 pr-14'>
                <h4 className='text-2xl font-semibold text-gray-800 dark:text-white/90'>
                  {detailInfo?._id ? 'Update' : 'Add'} Email Template
                </h4>
              </div>
              <div className='divide-y divide-gray-600'>
                <div className='grid grid-cols-1 space-y-1 pb-4'>
                  {/* Name */}
                  <div>
                    <Label>Name</Label>
                    <Controller
                      name='name'
                      control={control}
                      render={({ field }) => (
                        <Input
                          type='text'
                          placeholder='Template Name'
                          value={field.value}
                          onChange={field.onChange}
                          error={Boolean(errors.name?.message)}
                          errorMessage={errors.name?.message || ''}
                        />
                      )}
                    />
                  </div>
                  {/* Subject */}
                  <div>
                    <Label>Subject</Label>
                    <Controller
                      name='subject'
                      control={control}
                      render={({ field }) => (
                        <Input
                          type='text'
                          placeholder='Email Subject'
                          value={field.value}
                          onChange={field.onChange}
                          error={Boolean(errors.subject?.message)}
                          errorMessage={errors.subject?.message || ''}
                        />
                      )}
                    />
                  </div>
                  {/* HTML Content */}
                  <div>
                    <Label>HTML Content</Label>
                    <Controller
                      name='html'
                      control={control}
                      render={({ field }) => (
                        <textarea
                          className='w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                          placeholder='Email HTML Content'
                          value={field.value}
                          onChange={field.onChange}
                          rows={10}
                        />
                      )}
                    />
                    {errors.html?.message && (
                      <p className='mt-1 text-sm text-red-500'>
                        {errors.html.message}
                      </p>
                    )}
                  </div>
                  {/* Required Variables */}
                  <div>
                    <Label>Required Variables (comma-separated)</Label>
                    <Controller
                      name='requiredVariables'
                      control={control}
                      render={({ field }) => (
                        <Input
                          type='text'
                          placeholder='e.g. name, email, code'
                          value={field.value.join(', ')}
                          onChange={(e) => {
                            const values = e.target.value
                              .split(',')
                              .map((v) => v.trim())
                              .filter(Boolean)
                            field.onChange(values)
                          }}
                          error={Boolean(errors.requiredVariables?.message)}
                          errorMessage={errors.requiredVariables?.message || ''}
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
              <div className='flex items-center gap-3 px-2 lg:justify-end'>
                <Button
                  className='mt-4 w-full'
                  size='sm'
                  disabled={isLoading}
                  type='submit'
                >
                  {isLoading ? (
                    <LoadingSpinner className='mx-auto size-5' />
                  ) : detailInfo?._id ? (
                    'Update'
                  ) : (
                    'Save'
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  )
}

export default EmailTemplateDetailModal
