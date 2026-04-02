'use client'

import React from 'react'

import { useAuth } from '@/context/AuthContext'

import { useModal } from '@/hooks/useModal'

import AdminDetail from '@/components/admin/details'
import ComponentCard from '@/components/common/ComponentCard'
import MyProfileConnections from '@/components/my-profile/MyProfileConnections'
import MyProfileInfo from '@/components/my-profile/MyProfileInfo'
import MyProfileSettings from '@/components/my-profile/MyProfileSettings'
import Button from '@/components/ui/button/Button'

import { PencilIcon } from '@/icons'

const MyProfile = () => {
  const AdminFormModal = useModal()
  const { user, getLoggedInUser } = useAuth()

  return (
    <ComponentCard
      title='My profile'
      action={
        <Button onClick={AdminFormModal.openModal} size='xs'>
          <PencilIcon />
          Edit
        </Button>
      }
    >
      <MyProfileInfo />
      <MyProfileSettings />
      <MyProfileConnections />

      <AdminDetail
        id={user._id}
        isOpen={AdminFormModal.isOpen}
        closeModal={AdminFormModal.closeModal}
        handleSave={getLoggedInUser}
        detail={user}
      />
    </ComponentCard>
  )
}

export default MyProfile
