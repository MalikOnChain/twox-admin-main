import api from '@/lib/api'
import { handleApiError } from '@/lib/error'

export interface EmailTemplate {
  _id: string
  name: string
  subject: string
  html: string
  requiredVariables: string[]
  createdAt?: string
  updatedAt?: string
}

interface EmailTemplateListResponse {
  success: boolean
  rows: EmailTemplate[]
  pagination: {
    totalPages: number
    currentPage: number
  }
}

interface EmailTemplateDetailResponse {
  success: boolean
  template: EmailTemplate
  message?: string
}

interface EmailTemplateCreateResponse {
  success: boolean
  message: string
  template?: EmailTemplate
}

interface EmailTemplateUpdateResponse {
  success: boolean
  message: string
  template: EmailTemplate
}

interface EmailTemplateDeleteResponse {
  success: boolean
  message: string
}

/**
 * Get all email templates with pagination
 */
export const getEmailTemplates = async ({
  page = 1,
  limit = 10,
}: {
  page?: number
  limit?: number
}): Promise<EmailTemplateListResponse> => {
  try {
    const res = await api.get<EmailTemplateListResponse>(
      '/email-template/list',
      {
        params: {
          page,
          limit,
        },
      }
    )
    return res.data
  } catch (error) {
    handleApiError(error, 'Failed to get email templates')
  }
}

/**
 * Create a new email template
 */
export const createEmailTemplate = async (templateData: {
  name: string
  subject: string
  html: string
  requiredVariables: string[]
}): Promise<EmailTemplateCreateResponse> => {
  try {
    const res = await api.post<EmailTemplateCreateResponse>(
      '/email-template/create',
      templateData
    )
    return res.data
  } catch (error) {
    handleApiError(error, 'Failed to create email template')
  }
}

/**
 * Get email template by ID
 */
export const getEmailTemplateDetail = async (
  id: string
): Promise<EmailTemplateDetailResponse> => {
  try {
    const res = await api.get<EmailTemplateDetailResponse>(
      `/email-template/${id}`
    )
    return res.data
  } catch (error) {
    handleApiError(error, 'Failed to get email template details')
  }
}

/**
 * Update an email template
 */
export const updateEmailTemplate = async (
  id: string,
  templateData: {
    subject: string
    html: string
    requiredVariables: string[]
  }
): Promise<EmailTemplateUpdateResponse> => {
  try {
    const res = await api.post<EmailTemplateUpdateResponse>(
      `/email-template/update/${id}`,
      templateData
    )
    return res.data
  } catch (error) {
    handleApiError(error, 'Failed to update email template')
  }
}

/**
 * Delete an email template
 */
export const deleteEmailTemplate = async (
  id: string
): Promise<EmailTemplateDeleteResponse> => {
  try {
    const res = await api.delete<EmailTemplateDeleteResponse>(
      `/email-template/delete/${id}`
    )
    return res.data
  } catch (error) {
    handleApiError(error, 'Failed to delete email template')
  }
}
