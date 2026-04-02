'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { resendOTP, verify } from '@/api/auth'

import { useAuth } from '@/context/AuthContext'

import Label from '@/components/form/Label'
import Button from '@/components/ui/button/Button'

import { AuthVerification, IVerifyInput } from '@/types/auth'

export default function VerifyForm() {
  const router = useRouter()
  const { checkAuth } = useAuth()
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm<IVerifyInput>({
    defaultValues: {
      otp: '',
      token: '',
    },
  })
  const [loading, setLoading] = useState(false)
  const [countdown, setCountdown] = useState(30)
  const [canSubmit, setCanSubmit] = useState(false)
  const searchParams = useSearchParams()
  const [authVerification, setAuthVerification] = useState<AuthVerification>({
    OTPRequired: false,
    twoFARequired: false,
    email: '',
  })

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1)
      }, 1000)
    }
    return () => {
      if (timer) clearInterval(timer)
    }
  }, [countdown])

  const handleResend = async () => {
    if (countdown > 0) return
    try {
      setCountdown(30)
      const res = await resendOTP(authVerification.email)
      toast.success(res.message)
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Failed to resend OTP')
      }
    }
  }

  const onSubmit: SubmitHandler<IVerifyInput> = async (data) => {
    if (loading || !canSubmit) return
    setLoading(true)
    try {
      const res = await verify(authVerification.email, data.otp, data.token)
      if (res.identifier) {
        await checkAuth(res.identifier)
      } else {
        toast.error('Failed to verify OTP')
      }
      router.push('/')
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Failed to verify OTP')
      }
    }
    setLoading(false)
  }

  useEffect(() => {
    const twoFARequired = searchParams.get('2fa')
    const OTPRequired = searchParams.get('otp')
    const email = searchParams.get('email')

    if (searchParams.size <= 0) {
      router.push('/signin')
      return
    }

    if (!email) {
      router.push('/signin')
      return
    }

    setAuthVerification({
      email: email,
      OTPRequired: OTPRequired === 'true',
      twoFARequired: twoFARequired === 'true',
    })
  }, [searchParams, setAuthVerification, router])

  const OTP = watch('otp')
  const token = watch('token')

  useEffect(() => {
    setCanSubmit(
      authVerification.OTPRequired &&
        authVerification.twoFARequired &&
        authVerification.email.length > 0 &&
        OTP.length === 6 &&
        token.length === 6
    )
  }, [authVerification, OTP, token])

  return (
    <div className='flex w-full flex-1 flex-col lg:w-1/2'>
      <div className='mx-auto flex w-full max-w-md flex-1 flex-col justify-center'>
        <div>
          <div className='mb-5 sm:mb-8'>
            <h1 className='text-title-sm sm:text-title-md mb-2 font-semibold text-gray-800 dark:text-white/90'>
              {authVerification.OTPRequired
                ? 'Email verification'
                : authVerification.twoFARequired
                  ? '2FA verification'
                  : 'Email & 2FA verification'}
            </h1>
            <p className='text-sm text-gray-500 dark:text-gray-400'>
              We need to verify your otpCode and authenticate code to proceed.
            </p>
          </div>
          <div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className='space-y-6'>
                {authVerification.OTPRequired && (
                  <div>
                    <Label className='flex items-center justify-between'>
                      <div className='flex items-center gap-2'>
                        <span>OTP Code</span>
                        <span className='text-error-500'>*</span>
                      </div>
                      <div
                        onClick={handleResend}
                        className={`mr-2 ${
                          countdown > 0
                            ? 'cursor-not-allowed text-gray-400'
                            : 'cursor-pointer text-gray-200 hover:scale-105 hover:text-gray-500'
                        }`}
                        role='button'
                        tabIndex={countdown > 0 ? -1 : 0}
                        aria-disabled={countdown > 0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && countdown === 0) {
                            handleResend()
                          }
                        }}
                      >
                        Resend
                      </div>
                    </Label>
                    <div className='relative'>
                      <input
                        className='shadow-theme-xs dark:focus:border-brand-800 h-11 w-full appearance-none rounded-lg border px-4 py-2.5 text-sm placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30'
                        type='text'
                        {...register('otp', {
                          required: 'Please enter OTP code.',
                          pattern: {
                            value: /^[0-9]{6}$/,
                            message: 'OTP code must be 6 characters',
                          },
                        })}
                      />
                      {countdown > 0 && (
                        <span className='absolute top-6 right-4 z-30 -translate-y-1/2 text-gray-400'>
                          {countdown}s
                        </span>
                      )}
                    </div>
                    <span className='text-error-500 text-xs'>
                      {' '}
                      {errors?.otp?.message || ''}
                    </span>
                  </div>
                )}
                {authVerification.twoFARequired && (
                  <div>
                    <Label>
                      Authenticate Code{' '}
                      <span className='text-error-500'>*</span>{' '}
                    </Label>
                    <div className='relative'>
                      <input
                        className='shadow-theme-xs dark:focus:border-brand-800 h-11 w-full appearance-none rounded-lg border px-4 py-2.5 text-sm placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30'
                        type='text'
                        {...register('token', {
                          required: 'Please enter Authenticator code.',
                          pattern: {
                            value: /^[0-9]{6}$/,
                            message: 'Authenticator code must be 6 characters',
                          },
                        })}
                      />
                    </div>
                    <span className='text-error-500 text-xs'>
                      {' '}
                      {errors?.token?.message || ''}
                    </span>
                  </div>
                )}
                <div>
                  <Button
                    type='submit'
                    className='w-full'
                    size='sm'
                    disabled={loading || !canSubmit}
                  >
                    {loading ? 'Loading...' : 'Verify'}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
