import { Metadata } from 'next'

import WagerRaceDetail from '@/components/pages/wagerRace/wagerRaceDetail'

export const metadata: Metadata = {
  title: 'Wager Race Detail',
  description: 'This is Wager Race Detail page',
}

export default function WagerRaceDetailPage() {
  return <WagerRaceDetail />
}
