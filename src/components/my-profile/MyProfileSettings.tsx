'use client'
import React from 'react'

import { useAuth } from '@/context/AuthContext'

import Switch from '@/components/form/switch/Switch'

export default function MyProfileSettings() {
  const { user } = useAuth()

  return (
    <div className='rounded-2xl border border-gray-200 p-5 lg:p-6 dark:border-gray-800'>
      <div className='flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between'>
        <div>
          <h4 className='text-lg font-semibold text-gray-800 lg:mb-6 dark:text-white/90'>
            Security
          </h4>

          <div className='grid grid-cols-1 gap-4 lg:gap-7 2xl:gap-x-32'>
            <div>
              <Switch
                label='2FA authentication'
                defaultChecked={user.isTwoFAEnabled}
              />
            </div>

            <div>
              <Switch label='Email OTP' defaultChecked={user.isOTPEnabled} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
