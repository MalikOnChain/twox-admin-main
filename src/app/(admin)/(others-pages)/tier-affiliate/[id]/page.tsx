'use client'

import { useParams } from 'next/navigation'

import ReferredUsersByTier from '@/components/pages/tier-affiliate/referred-users'

const DetailPage = () => {
  const { id } = useParams<{ id: string }>()

  return <ReferredUsersByTier id={id} />
}

export default DetailPage
