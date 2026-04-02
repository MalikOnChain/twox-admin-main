import { Metadata } from 'next'
import React from 'react'

import MyProfile from '@/components/pages/profile/MyProfile'

export const metadata: Metadata = {
  title: 'Profile',
  description: 'This is Profile page',
}

export default function Profile() {
  return <MyProfile />
}
