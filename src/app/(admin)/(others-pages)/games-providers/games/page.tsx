import { Metadata } from 'next'

import GamesPage from '@/components/pages/games-providers/GamesPage'

export const metadata: Metadata = {
  title: 'Games / Game Detail | TwoX',
  description: 'Manage games and view game details',
}

export default function Games() {
  return <GamesPage />
}

