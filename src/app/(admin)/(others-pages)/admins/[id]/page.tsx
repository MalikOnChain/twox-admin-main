'use client'

import { useParams } from 'next/navigation'

import AdminDetailView from '@/components/admin/view'

const DetailPage = () => {
  const { id } = useParams<{ id: string }>()

  return <AdminDetailView id={id} />
}

export default DetailPage
