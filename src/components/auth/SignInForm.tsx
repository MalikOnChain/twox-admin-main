'use client'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { signIn } from '@/api/auth'

import { useAuth } from '@/context/AuthContext'

import {
  clearRememberedAdminLogin,
  getRememberedAdminLogin,
  saveRememberedAdminLogin,
} from '@/lib/remember-admin-login'

import OAuthButtons from '@/components/auth/OAuthButtons'
import Label from '@/components/form/Label'
import Switch from '@/components/form/switch/Switch'
import Button from '@/components/ui/button/Button'

import { EyeCloseIcon, EyeIcon } from '@/icons'

import { ISignInInput } from '@/types/auth'

export default function SignInForm() {
  const { checkAuth } = useAuth()

  const [showPassword, setShowPassword] = useState(false)
  const [rememberPassword, setRememberPassword] = useState(false)
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const searchParams = useSearchParams()

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<ISignInInput>()

  useEffect(() => {
    const saved = getRememberedAdminLogin()
    if (saved) {
      reset({ email: saved.email, password: saved.password })
      setRememberPassword(true)
    }
  }, [reset])

  const persistCredentialsIfEnabled = (email: string, password: string) => {
    if (rememberPassword) {
      saveRememberedAdminLogin(email, password)
    } else {
      clearRememberedAdminLogin()
    }
  }

  const onSubmit: SubmitHandler<ISignInInput> = async (data) => {
    if (loading) return
    setLoading(true)
    try {
      const res = await signIn(data.email, data.password)
      if (res) {
        if (res.identifier) {
          try {
            await checkAuth(res.identifier)
          } catch {
            return
          }
          persistCredentialsIfEnabled(data.email, data.password)
          router.push('/')
          return
        }

        if (res.OTPRequired && res.twoFARequired) {
          persistCredentialsIfEnabled(data.email, data.password)
          router.push(`/verify?2fa=true&otp=true&email=${data.email}`)
          return
        }

        if (res.twoFARequired) {
          persistCredentialsIfEnabled(data.email, data.password)
          router.push(`/verify?2fa=true&email=${data.email}`)
          return
        }

        if (res.OTPRequired) {
          persistCredentialsIfEnabled(data.email, data.password)
          router.push(`/verify?otp=true&email=${data.email}`)
          return
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || 'Invalid email or password')
      } else {
        toast.error('Invalid email or password')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const error = searchParams.get('error')
    if (error === 'not_linked') {
      toast.error('Your Google account is not linked to any user')
    }
  }, [searchParams])

  return (
    <div className='flex w-full flex-1 flex-col lg:w-1/2'>
      {/* <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon />
          Back to dashboard
        </Link>
      </div> */}
      <div className='mx-auto flex w-full max-w-md flex-1 flex-col justify-center'>
        <div>
          <div className='mb-5 sm:mb-8'>
            <h1 className='text-title-sm sm:text-title-md mb-2 font-semibold text-gray-800 dark:text-white/90'>
              Sign In
            </h1>
            <p className='text-sm text-gray-500 dark:text-gray-400'>
              Enter your email and password to sign in!
            </p>
          </div>

          <div className='mb-5 sm:mb-8'>
            <OAuthButtons />
          </div>

          <div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className='space-y-6'>
                <div>
                  <Label>
                    Email <span className='text-error-500'>* </span>{' '}
                  </Label>
                  <input
                    className='shadow-theme-xs dark:focus:border-brand-800 h-11 w-full appearance-none rounded-lg border px-4 py-2.5 text-sm placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30'
                    type='email'
                    {...register('email', {
                      required: 'Please enter your email.',
                      pattern: {
                        value:
                          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: 'Email must be a valid email address.',
                      },
                    })}
                  />
                  <span className='text-error-500 text-xs'>
                    {errors?.email?.message || ''}
                  </span>
                </div>
                <div>
                  <Label>
                    Password <span className='text-error-500'>* </span>{' '}
                  </Label>
                  <div className='relative'>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      {...register('password', {
                        required: 'Please enter your password.',
                        minLength: {
                          value: 8,
                          message:
                            'Password must be at least 8 characters long.',
                        },
                        maxLength: {
                          value: 30,
                          message:
                            'Password must be at most 30 characters long.',
                        },
                      })}
                      className='shadow-theme-xs dark:focus:border-brand-800 h-11 w-full appearance-none rounded-lg border py-2.5 pr-12 pl-4 text-sm placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30'
                      aria-invalid={errors.password ? 'true' : 'false'}
                    />
                    <button
                      type='button'
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      onClick={() => setShowPassword(!showPassword)}
                      className='absolute top-1/2 right-3 z-30 -translate-y-1/2 cursor-pointer rounded p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/10'
                    >
                      {showPassword ? (
                        <EyeIcon className='fill-current' />
                      ) : (
                        <EyeCloseIcon className='fill-current' />
                      )}
                    </button>
                  </div>
                  <span className='text-error-500 text-xs'>
                    {' '}
                    {errors?.password?.message || ''}
                  </span>
                </div>
                <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                  <Switch
                    key={`remember-${rememberPassword}`}
                    label='Remember password'
                    labelClassName='flex-row-reverse justify-start gap-3 text-theme-sm font-normal text-gray-700 dark:text-gray-400'
                    defaultChecked={rememberPassword}
                    onChange={(checked) => {
                      setRememberPassword(checked)
                      if (!checked) {
                        clearRememberedAdminLogin()
                      }
                    }}
                  />
                  <Link
                    href='/reset-password'
                    className='text-brand-500 hover:text-brand-600 dark:text-brand-400 shrink-0 text-sm sm:ml-auto'
                  >
                    Forgot password?
                  </Link>
                </div>
                <div>
                  <Button
                    type='submit'
                    className='w-full'
                    size='sm'
                    disabled={loading}
                  >
                    {loading ? 'Loading...' : 'Sign in'}
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
