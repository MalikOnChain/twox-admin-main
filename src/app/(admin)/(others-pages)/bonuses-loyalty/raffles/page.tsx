import { Metadata } from 'next'

import RafflesPage from '@/components/pages/bonuses-loyalty/RafflesPage'

export const metadata: Metadata = {
  title: 'Raffles | TwoX',
  description: 'Manage raffles and draws',
}

export default function Raffles() {
  return <RafflesPage />
}

