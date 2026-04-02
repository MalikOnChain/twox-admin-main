'use client'

import { useParams } from 'next/navigation'

import RoleDetail from '@/components/role/detail'
const DetailPage = () => {
  const { id } = useParams<{ id: string }>()

  return <RoleDetail id={id} />
}

export default DetailPage
