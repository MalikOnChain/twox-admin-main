import { z } from 'zod'

export const bannerFormSchema = z.object({
  title: z.string().min(1, 'Title is required'), // Title is required and cannot be empty
  image: z.string().optional().nullable(), // Image URL is required
  position: z.string().min(1, 'Position is required'), // Position is required
  language: z
    .object({
      code: z
        .enum(['en', 'es', 'fr', 'de', 'it', 'ar', 'pt', 'zh'])
        .optional()
        .nullable(),
      name: z
        .enum(
          [
            'English',
            'Spanish',
            'French',
            'German',
            'Italian',
            'Arabic',
            'Portuguese',
            'Chinese',
          ],
          {
            errorMap: () => ({ message: 'Invalid language name' }),
          }
        )
        .optional()
        .nullable(),
    })
    .optional()
    .nullable(),

  device: z.enum(['mobile', 'desktop', 'tablet', 'smartwatch'], {
    errorMap: () => ({ message: 'Invalid device type' }), // Ensure device is one of the valid options
  }),
  section: z.enum(
    [
      'home',
      'promotions',
      'games',
      'sports',
      'casino',
      'bonuses',
      'responsible-gambling',
      'new-user-registration',
      'payment-methods',
      'mobile-app',
      'live-betting',
      'vip-program',
      'events',
      'affiliate',
      'blog-news',
      'footer',
    ],
    {
      errorMap: () => ({ message: 'Invalid section type' }), // Ensure section is one of the valid options
    }
  ),
  bannerData: z
    .object({
      title: z.string().optional(),
      subtitle: z.string().optional(),
      highlight: z.string().optional(),
      features: z.array(z.string()).optional(),
    })
    .optional(),
})

export type BannerFormValues = z.infer<typeof bannerFormSchema>

export const languageOptions = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'ar', name: 'Arabic' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'zh', name: 'Chinese' },
]

export const deviceOptions = [
  { value: 'mobile', label: 'mobile' },
  { value: 'desktop', label: 'desktop' },
  { value: 'tablet', label: 'tablet' },
  { value: 'smartwatch', label: 'smartwatch' },
]

export const sectionOptions = [
  { value: 'home', label: 'home' },
  { value: 'promotions', label: 'promotions' },
  { value: 'games', label: 'games' },
  { value: 'sports', label: 'sports' },
  { value: 'casino', label: 'casino' },
  { value: 'bonuses', label: 'bonuses' },
  {
    value: 'responsible-gambling',
    label: 'responsible-gambling',
  },
  {
    value: 'new-user-registration',
    label: 'new-user-registration',
  },
  {
    value: 'payment-methods',
    label: 'rayment-methods',
  },
  { value: 'mobile-app', label: 'mobile app' },
  { value: 'live-betting', label: 'live-betting' },
  { value: 'vip-program', label: 'vip-program' },
  { value: 'events', label: 'events' },
  { value: 'affiliate', label: 'affiliate' },
  { value: 'blog-news', label: 'blog-news' },
  { value: 'footer', label: 'footer' },
]
