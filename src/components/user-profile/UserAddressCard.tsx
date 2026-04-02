'use client'
import React from 'react'

import { IUserWithProfile } from '@/types/users'

export default function UserAddressCard({ user }: { user: IUserWithProfile }) {
  return (
    <>
      <div className='rounded-2xl border border-gray-200 p-5 lg:p-6 dark:border-gray-800'>
        <div className='flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between'>
          <div>
            <h4 className='text-lg font-semibold text-gray-800 lg:mb-6 dark:text-white/90'>
              Address
            </h4>

            <div className='grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32'>
              <div>
                <p className='mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400'>
                  Country
                </p>
                <p className='text-sm font-medium text-gray-800 dark:text-white/90'>
                  {user.profile?.country || 'N/A'}
                </p>
              </div>

              <div>
                <p className='mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400'>
                  City/State
                </p>
                <p className='text-sm font-medium text-gray-800 dark:text-white/90'>
                  {user.profile?.city || 'N/A'}
                </p>
              </div>
              <div>
                <p className='mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400'>
                  Postal Code
                </p>
                <p className='text-sm font-medium text-gray-800 dark:text-white/90'>
                  {user.profile?.postalCode || 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
