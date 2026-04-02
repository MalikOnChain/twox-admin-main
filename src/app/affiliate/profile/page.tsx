import { Metadata } from 'next'
import React from 'react'

import MyProfile from '@/components/pages/profile/MyProfile'

export const metadata: Metadata = {
  title: 'Profile',
  description: 'This is Profile page',
}

export default function Profile() {
  return (
    <div>
      <div className='rounded-2xl border border-gray-200 bg-white p-5 lg:p-6 dark:border-gray-800 dark:bg-white/[0.03]'>
        <h3 className='mb-5 text-lg font-semibold text-gray-800 lg:mb-7 dark:text-white/90'>
          My Profile
        </h3>
        <MyProfile />
      </div>
    </div>
  )
}
