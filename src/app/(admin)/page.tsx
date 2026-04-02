import type { Metadata } from 'next'

import Dashboard from '@/components/ecommerce'

export const metadata: Metadata = {
  title: 'iGaming Dashboard | Two X Admin',
  description: 'Two X Admin',
}

export default function Ecommerce() {
  return <Dashboard />
}
