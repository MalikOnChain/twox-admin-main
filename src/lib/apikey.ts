import { z } from 'zod'

import { APIKeysFilterOptions } from '@/types/apikey'

export const apikeyFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  label: z.string().min(1, 'Label is required'),
  apiKey: z.string().min(1, 'Apikey is required'),
  status: z.boolean().optional(),
  scope: z.enum([
    APIKeysFilterOptions.MainBackEnd,
    APIKeysFilterOptions.MainFrontEnd,
    APIKeysFilterOptions.AdminBackEnd,
    APIKeysFilterOptions.AdminFrontEnd,
  ]),
  expiryDate: z.date(),
  createdBy: z.string().min(1, 'createdBy is required'),
})

export type ApikeyFormValues = z.infer<typeof apikeyFormSchema>
