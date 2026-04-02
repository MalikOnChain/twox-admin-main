import { Metadata } from 'next'

import Marketing from '@/components/marketing'

export const metadata: Metadata = {
  title: 'UTM Analytics',
  description: 'This is UTM Analytics  page',
}

export default function BasicTables() {
  return <Marketing />
}
