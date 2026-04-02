import { z } from 'zod'
// 🧾 Zod schema
export const operatingProviderFormSchema = z.object({
  name: z.string().min(2, 'Provider name is required'),
  description: z.string().min(2, 'Description is required'),
})

export type OperatingProviderFormValues = z.infer<
  typeof operatingProviderFormSchema
>

export const operatingProviderInvoiceFormSchema = z.object({
  providerId: z.string().min(2, 'Provider is required'),
  amount: z.number().min(0, 'Amount is required'),
  issueDate: z.string().min(2, 'Issue date is required'),
  description: z.string(),
})

export type OperatingProviderInvoiceFormValues = z.infer<
  typeof operatingProviderInvoiceFormSchema
>
