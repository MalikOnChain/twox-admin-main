'use client'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { connectGoogle, disconnectGoogle } from '@/api/google'

import { useAuth } from '@/context/AuthContext'

import LoadingSpinner from '@/components/common/LoadingSpinner'
import Button from '@/components/ui/button/Button'

import { GoogleIcon, SteamIcon } from '@/icons'

export default function MyProfileConnections() {
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const searchParams = useSearchParams()

  const handleGoogleConnect = async () => {
    if (loading) return
    try {
      setLoading(true)
      const { authUrl } = await connectGoogle()
      window.location.href = authUrl
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleDisconnect = async () => {
    if (loading) return
    try {
      setLoading(true)
      await disconnectGoogle()
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleSteamConnect = () => {
    setLoading(true)
  }

  const handleGoogleClick = () => {
    if (user.googleId) {
      handleGoogleDisconnect()
    } else {
      handleGoogleConnect()
    }
  }
  useEffect(() => {
    const error = searchParams.get('error')
    const google_connected = searchParams.get('google_connected')

    if (error) {
      toast.error(error)
    }

    if (google_connected === 'true') {
      toast.success('Google account connected successfully')
    }
  }, [searchParams])

  return (
    <div className='rounded-2xl border border-gray-200 p-5 lg:p-6 dark:border-gray-800'>
      <div className='flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between'>
        <div>
          <h4 className='text-lg font-semibold text-gray-800 lg:mb-6 dark:text-white/90'>
            Connect Accounts
          </h4>

          <div className='grid grid-cols-1 gap-3 sm:gap-5 md:grid-cols-2'>
            <Button onClick={handleGoogleClick} size='sm' variant='outline'>
              {loading ? (
                <LoadingSpinner className='size-5' />
              ) : (
                <>
                  <GoogleIcon />
                  {user.googleId
                    ? 'Disconnect Google Account'
                    : 'Connect Google Account'}
                </>
              )}
            </Button>

            <Button
              onClick={handleSteamConnect}
              size='sm'
              variant='outline'
              disabled
            >
              <SteamIcon style={{ width: '24px', height: '24px' }} />
              Connect Steam Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
