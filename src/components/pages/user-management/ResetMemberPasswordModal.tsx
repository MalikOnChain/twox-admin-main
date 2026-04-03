'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { resetMemberPassword } from '@/api/user-management'

import Switch from '@/components/form/switch/Switch'
import Label from '@/components/form/Label'
import Button from '@/components/ui/button/Button'
import { Modal } from '@/components/ui/modal'

const inputClass =
  'h-11 w-full rounded-lg border px-4 py-2.5 pr-4 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30'

type ResetMemberPasswordModalProps = {
  isOpen: boolean
  onClose: () => void
  userId: string
  username: string
  email: string
  onSuccess?: () => void
}

export default function ResetMemberPasswordModal({
  isOpen,
  onClose,
  userId,
  username,
  email,
  onSuccess,
}: ResetMemberPasswordModalProps) {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showMemberPassword, setShowMemberPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setPassword('')
      setConfirm('')
      setShowMemberPassword(false)
    }
  }, [isOpen, userId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 8 || password.length > 30) {
      toast.error('Password must be between 8 and 30 characters.')
      return
    }
    if (password !== confirm) {
      toast.error('Passwords do not match.')
      return
    }
    try {
      setSubmitting(true)
      await resetMemberPassword(userId, password)
      toast.success('Member password updated.')
      onSuccess?.()
      onClose()
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message)
      }
    } finally {
      setSubmitting(false)
    }
  }

  const inputType = showMemberPassword ? 'text' : 'password'

  return (
    <Modal isOpen={isOpen} onClose={onClose} className='m-4 max-w-[480px]'>
      <div className='no-scrollbar relative w-full max-w-[480px] overflow-y-auto rounded-3xl bg-white p-6 lg:p-8 dark:bg-gray-900'>
        <h4 className='mb-1 text-xl font-semibold text-gray-800 dark:text-white/90'>
          Reset member password
        </h4>
        <p className='mb-6 text-sm text-gray-500 dark:text-gray-400'>
          Set a new login password for{' '}
          <span className='font-medium text-gray-700 dark:text-gray-300'>{username}</span>
          <span className='block truncate text-xs'>{email}</span>
        </p>

        <form onSubmit={handleSubmit} className='space-y-5'>
          <div>
            <Label>New password</Label>
            <input
              className={inputClass}
              type={inputType}
              autoComplete='new-password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='8–30 characters'
              minLength={8}
              maxLength={30}
              required
            />
          </div>
          <div>
            <Label>Confirm password</Label>
            <input
              className={inputClass}
              type={inputType}
              autoComplete='new-password'
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder='Repeat password'
              minLength={8}
              maxLength={30}
              required
            />
          </div>

          <div className='rounded-xl border border-gray-200 px-3 py-3 dark:border-gray-800'>
            <Switch
              key={isOpen ? `${userId}-pwd` : 'closed'}
              label='Show member password'
              labelClassName='flex-row-reverse justify-between w-full'
              defaultChecked={false}
              onChange={setShowMemberPassword}
            />
            <p className='mt-2 text-xs text-gray-500 dark:text-gray-400'>
              When enabled, both fields show plain text. Turn off before saving in shared spaces.
            </p>
          </div>

          <div className='flex flex-wrap justify-end gap-3 pt-2'>
            <Button type='button' variant='outline' onClick={onClose} disabled={submitting}>
              Cancel
            </Button>
            <Button type='submit' disabled={submitting}>
              {submitting ? 'Saving…' : 'Update password'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  )
}
