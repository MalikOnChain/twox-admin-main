'use client'
import { useRouter } from 'next/navigation'
import React from 'react'

import ComponentCard from '@/components/common/ComponentCard'
import RolesList from '@/components/role'
import Button from '@/components/ui/button/Button'

import { PlusIcon } from '@/icons'

export default function BasicTables() {
  const router = useRouter()
  const handleClick = () => {
    router.push('/roles/create')
  }

  return (
    <ComponentCard
      title='Roles'
      action={
        <Button onClick={handleClick} size='xs'>
          <PlusIcon />
          Add Role
        </Button>
      }
    >
      <RolesList />
    </ComponentCard>
  )
}
