'use client'

import React, { useCallback, useState } from 'react'
import { toast } from 'sonner'

import {
  createEmailTemplate,
  getEmailTemplates,
  updateEmailTemplate,
} from '@/api/email-template'
import { EmailTemplate } from '@/api/email-template'

import { useModal } from '@/hooks/useModal'

import ComponentCard from '@/components/common/ComponentCard'
import EmailTemplateDetailModal from '@/components/pages/email-template/EmailTemplateDetailModal'
import EmailTemplateTable from '@/components/pages/email-template/EmailTemplateTable'
import Button from '@/components/ui/button/Button'

import { PlusIcon } from '@/icons'

export default function EmailTemplatePage() {
  const [templateData, setTemplateData] = useState<EmailTemplate[]>([])
  const [page, setPage] = useState<number>(1)
  const [limit] = useState<number>(10)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate>(null)
  const CreateTemplateModal = useModal()

  const handleEdit = (template: EmailTemplate) => {
    setSelectedTemplate(template)
    CreateTemplateModal.openModal()
  }

  const fetchTemplates = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await getEmailTemplates({
        page,
        limit,
      })

      if (response.success) {
        setTemplateData(response.rows)
        setTotalPages(response.pagination.totalPages)
        setPage(response.pagination.currentPage)
      }
    } catch (error) {
      console.error('Error fetching email templates:', error)
    } finally {
      setIsLoading(false)
    }
  }, [page, limit])

  const handleOnSubmit = async (data: Partial<EmailTemplate>) => {
    try {
      if (selectedTemplate) {
        const res = await updateEmailTemplate(selectedTemplate._id, {
          subject: data.subject,
          html: data.html,
          requiredVariables: data.requiredVariables,
        })
        if (res.success) {
          toast.success('Email template updated successfully')
        } else {
          toast.error(res.message)
        }
      } else {
        const res = await createEmailTemplate({
          name: data.name,
          subject: data.subject,
          html: data.html,
          requiredVariables: data.requiredVariables,
        })
        if (res.success) {
          toast.success('Email template created successfully')
        } else {
          toast.error(res.message)
        }
      }
      fetchTemplates()
      return true
    } catch (error) {
      console.error('Error updating email template:', error)
      return false
    }
  }

  const handleModalClose = () => {
    CreateTemplateModal.closeModal()
    if (selectedTemplate) {
      setSelectedTemplate(null)
    }
  }

  return (
    <div>
      <div className='space-y-6'>
        <ComponentCard
          title='Email Templates'
          action={
            <Button onClick={CreateTemplateModal.openModal} size='xs'>
              <PlusIcon />
              Add Template
            </Button>
          }
        >
          <EmailTemplateTable
            templateData={templateData}
            totalPages={totalPages}
            page={page}
            setPage={setPage}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            fetchTemplates={fetchTemplates}
            onEdit={handleEdit}
          />
          <EmailTemplateDetailModal
            isOpen={CreateTemplateModal.isOpen}
            closeModal={handleModalClose}
            detail={selectedTemplate}
            onSubmit={handleOnSubmit}
          />
        </ComponentCard>
      </div>
    </div>
  )
}
