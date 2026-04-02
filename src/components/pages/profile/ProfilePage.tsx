'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useCallback, useEffect } from 'react'
import { useState } from 'react'

import { getUserById } from '@/api/users'

import UserAddressCard from '@/components/user-profile/UserAddressCard'
import UserInfoCard from '@/components/user-profile/UserInfoCard'
import UserMetaCard from '@/components/user-profile/UserMetaCard'
import UserReviewCard from '@/components/user-profile/UserReviewCard'
import UserTransactionCard from '@/components/user-profile/UserTransactionCard'

import { ChevronLeftIcon } from '@/icons'

import { IUserWithProfile } from '@/types/users'

const ProfilePage = () => {
  const { id } = useParams()
  const [user, setUser] = useState<IUserWithProfile | null>(null)

  const fetchUser = useCallback(async () => {
    if (id) {
      const response = await getUserById({ id: id as string })
      if (response.success) {
        setUser(response.data.user)
      }
    }
  }, [id])

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  return (
    <div className='space-y-6'>
      <Link
        href='/users'
        className='inline-flex items-center text-sm text-gray-600 transition-colors duration-200 hover:text-blue-600'
      >
        <ChevronLeftIcon />
        Back to Users
      </Link>

      {user && (
        <>
          <UserMetaCard user={user} />
          <UserInfoCard user={user} fetchUser={fetchUser} />
          <UserAddressCard user={user} />
          <UserReviewCard user={user} fetchUser={fetchUser} />
          <UserTransactionCard user={user} />
        </>
      )}
    </div>
  )
}

export default ProfilePage
