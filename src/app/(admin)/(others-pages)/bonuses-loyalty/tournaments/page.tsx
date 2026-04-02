import { Metadata } from 'next'

import TournamentsPage from '@/components/pages/bonuses-loyalty/TournamentsPage'

export const metadata: Metadata = {
  title: 'Tournaments | TwoX',
  description: 'Manage tournaments and competitions',
}

export default function Tournaments() {
  return <TournamentsPage />
}

