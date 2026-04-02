'use client'

import { useParams } from 'next/navigation'

import ReferredUsersByUser from '@/components/pages/user-affiliate/referred-users'

const DetailPage = () => {
  const { id } = useParams<{ id: string }>()

  return <ReferredUsersByUser id={id} />
}

export default DetailPage
