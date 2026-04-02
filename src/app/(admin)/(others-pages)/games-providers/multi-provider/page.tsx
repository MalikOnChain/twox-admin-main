import { Metadata } from 'next'

import MultiProviderPage from '@/components/pages/games-providers/MultiProviderPage'

export const metadata: Metadata = {
  title: 'Multi-Provider & Multi-Vertical | TwoX',
  description: 'Manage multi-provider and multi-vertical settings',
}

export default function MultiProvider() {
  return <MultiProviderPage />
}

