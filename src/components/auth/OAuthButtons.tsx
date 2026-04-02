'use client'

import React, { useState } from 'react'
import { toast } from 'sonner'

import { signInWithGoogle } from '@/api/auth'

import LoadingSpinner from '@/components/common/LoadingSpinner'

import { GoogleIcon, SteamIcon } from '@/icons'

const OAuthButtons = () => {
  const [loading, setLoading] = useState<boolean>(false)

  const handleGoogleSignIn = async () => {
    if (loading) return
    setLoading(true)
    try {
      const res = await signInWithGoogle()
      if (res.authUrl) {
        window.location.href = res.authUrl
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Failed to sign in with Google')
      }
    }
    setLoading(false)
  }

  const handleSteamSignIn = () => {}

  return (
    <div className='grid grid-cols-1 gap-3 sm:gap-5 md:grid-cols-2'>
      <button
        onClick={handleGoogleSignIn}
        className='inline-flex items-center justify-center gap-3 rounded-lg bg-gray-100 px-7 py-3 text-sm font-normal text-gray-700 transition-colors hover:bg-gray-200 hover:text-gray-800 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10'
      >
        {loading ? (
          <LoadingSpinner className='size-5' />
        ) : (
          <>
            <GoogleIcon />
            Sign in with Google
          </>
        )}
      </button>

      <button
        onClick={handleSteamSignIn}
        className='inline-flex items-center justify-center gap-3 rounded-lg bg-gray-100 px-7 py-3 text-sm font-normal text-gray-700 transition-colors hover:bg-gray-200 hover:text-gray-800 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10'
      >
        <SteamIcon style={{ width: '24px', height: '24px' }} />
        Sign in with Steam
      </button>
    </div>
  )
}

export default OAuthButtons
