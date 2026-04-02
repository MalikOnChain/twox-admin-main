import { Metadata } from 'next'

import DepositsWithdrawalsPage from '@/components/pages/payments/DepositsWithdrawalsPage'

export const metadata: Metadata = {
  title: 'Deposits / Withdrawals | TwoX',
  description: 'Manage deposits and withdrawals',
}

export default function DepositsWithdrawals() {
  return <DepositsWithdrawalsPage />
}

