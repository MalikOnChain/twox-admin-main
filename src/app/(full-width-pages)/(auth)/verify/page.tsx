import { Metadata } from 'next'

import VerifyForm from '@/components/auth/VerifyForm'

export const metadata: Metadata = {
  title: 'Two X | Verify Page',
  description: 'This is Two X Verify Page',
}

export default function Verify() {
  return <VerifyForm />
}
