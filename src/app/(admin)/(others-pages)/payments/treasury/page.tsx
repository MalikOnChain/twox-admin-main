import { Metadata } from 'next'

import TreasuryPage from '@/components/pages/payments/TreasuryPage'

export const metadata: Metadata = {
  title: 'Treasury | TwoX',
  description: 'Manage treasury and wallets',
}

export default function Treasury() {
  return <TreasuryPage />
}

