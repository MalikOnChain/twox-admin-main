import { Metadata } from 'next'

import AdminPaymentSettingsPage from '@/components/pages/payments/AdminPaymentSettingsPage'

export const metadata: Metadata = {
  title: 'Admin Payment Settings | TwoX',
  description: 'Admin-only payment settings',
}

export default function AdminPaymentSettings() {
  return <AdminPaymentSettingsPage />
}

