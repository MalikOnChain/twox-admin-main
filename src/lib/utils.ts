import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(number: number) {
  return number.toLocaleString()
}

export const formatDate = (date: Date | string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export const WEEKDAY_LABELS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

const BASE_UTM_SOURCE_OPTIONS = [
  { label: 'Google', value: 'google', icon: '/images/brand/google.svg' },
  { label: 'Facebook', value: 'facebook', icon: '/images/brand/facebook.svg' },
  { label: 'SMS', value: 'sms', icon: '/images/brand/sms.svg' },
  { label: 'Email', value: 'email', icon: '/images/brand/email.svg' },
  { label: 'WhatsApp', value: 'whatsapp', icon: '/images/brand/whatsapp.svg' },
  { label: 'Telegram', value: 'telegram', icon: '/images/brand/telegram.svg' },
  { label: 'Discord', value: 'discord', icon: '/images/brand/discord.svg' },
  {
    label: 'Instagram',
    value: 'instagram',
    icon: '/images/brand/instagram.svg',
  },
  // { label: 'Twitter', value: 'twitter', icon: '/images/brand/twitter.svg' },
  { label: 'X', value: 'x', icon: '/images/brand/x.svg' },
  { label: 'LinkedIn', value: 'linkedin', icon: '/images/brand/linkedin.svg' },
  { label: 'YouTube', value: 'youtube', icon: '/images/brand/youtube.svg' },
  { label: 'TikTok', value: 'tiktok', icon: '/images/brand/tiktok.svg' },
  { label: 'Snapchat', value: 'snapchat', icon: '/images/brand/snapchat.svg' },
  {
    label: 'Pinterest',
    value: 'pinterest',
    icon: '/images/brand/pinterest.svg',
  },
]

export const getUtmSourceOptions = (includeAll: boolean = false) => {
  if (includeAll) {
    return [...BASE_UTM_SOURCE_OPTIONS]
  }
  return BASE_UTM_SOURCE_OPTIONS
}

export const capitalizeFirstLetter = (type: unknown): string => {
  return typeof type === 'string'
    ? type.charAt(0).toUpperCase() + type.slice(1)
    : ''
}
