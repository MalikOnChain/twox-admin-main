import { Metadata } from 'next'

import SchedulingPage from '@/components/pages/bonuses-loyalty/SchedulingPage'

export const metadata: Metadata = {
  title: 'Scheduling & Automation | TwoX',
  description: 'Schedule and automate bonus campaigns',
}

export default function Scheduling() {
  return <SchedulingPage />
}

