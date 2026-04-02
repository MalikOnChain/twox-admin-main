import { Metadata } from 'next'

import SegmentationPage from '@/components/pages/bonuses-loyalty/SegmentationPage'

export const metadata: Metadata = {
  title: 'Segmentation | TwoX',
  description: 'Segment users for bonus targeting',
}

export default function Segmentation() {
  return <SegmentationPage />
}

