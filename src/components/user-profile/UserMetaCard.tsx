'use client'
import moment from 'moment'
import Image from 'next/image'
import React from 'react'

import { IUserWithProfile } from '@/types/users'

export default function UserMetaCard({ user }: { user: IUserWithProfile }) {
  return (
    <>
      <div className='rounded-2xl border border-gray-200 p-5 lg:p-6 dark:border-gray-800'>
        <div className='flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between'>
          <div className='flex w-full flex-col items-center gap-6 xl:flex-row'>
            <div className='h-20 w-20 overflow-hidden rounded-full border border-gray-200 dark:border-gray-800'>
              <Image
                src={user.avatar}
                alt='user'
                width={80}
                height={80}
                className='h-full w-full'
              />
            </div>
            <div className='order-3 xl:order-2'>
              <h4 className='mb-2 text-center text-lg font-semibold text-gray-800 xl:text-left dark:text-white/90'>
                {user.username}
              </h4>
              <div className='flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left'>
                <p className='text-sm text-gray-500 dark:text-gray-400'>
                  Member since {moment(user.createdAt).format('YYYY-MM-DD')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
