import Image from 'next/image'
import React from 'react'
import { Control, Controller } from 'react-hook-form'
import { toast } from 'sonner'

import { getUsers } from '@/api/users'

import AuthComplete from '@/components/form/AuthComplete'

import { CloseIcon } from '@/icons'

const UserAuthComplete = ({ control }: { control: Control<any> }) => {
  const fetchUsers = async (query: string) => {
    try {
      const response = await getUsers({ page: 1, limit: 10, filter: query })
      return response.rows
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Error fetching users')
      }
      return []
    }
  }

  return (
    <Controller
      name='eligibleUsers'
      control={control}
      render={({ field }) => (
        <AuthComplete
          label='Assign Users'
          fetchOptions={fetchUsers}
          onChange={(options) =>
            field.onChange(options.map((option) => option._id))
          }
          placeholder='Search for users...'
          minSearchLength={2}
          getOptionValue={(user) => user._id}
          getOptionLabel={(user) => user.username}
          renderOption={({ option, isSelected }) => (
            <div
              className={`flex items-center p-2 ${isSelected ? 'bg-blue-50 dark:bg-blue-900/30' : ''}`}
            >
              {option.data.avatar && (
                <Image
                  src={option.data.avatar}
                  width={0}
                  height={0}
                  alt=''
                  sizes='100vw'
                  className='mr-2 h-8 w-8 rounded-full'
                />
              )}
              <div>
                <div className='font-medium text-gray-500'>
                  {option.data.username}
                </div>
                {option.data.email && (
                  <div className='text-xs text-gray-500'>
                    {option.data.email}
                  </div>
                )}
              </div>
            </div>
          )}
          renderSelectedItem={({ item, onRemove }) => (
            <div className='flex items-center rounded-full bg-blue-50 p-1 text-sm dark:bg-blue-900/20'>
              {item.avatar && (
                <Image
                  width={0}
                  height={0}
                  src={item.avatar}
                  alt=''
                  sizes='100vw'
                  className='mr-1 h-5 w-5 rounded-full'
                />
              )}
              <span className='text-gray-500'>{item.username}</span>
              <button onClick={onRemove}>
                <CloseIcon
                  className='text-gray-500 hover:text-gray-700'
                  style={{ fill: 'currentColor' }}
                />
              </button>
            </div>
          )}
        />
      )}
    />
  )
}

export default UserAuthComplete
