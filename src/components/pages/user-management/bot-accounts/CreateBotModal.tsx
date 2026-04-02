'use client'
import { useState } from 'react'
import { toast } from 'sonner'

import { createBotAccount } from '@/api/user-management'

import Button from '@/components/ui/button/Button'

interface CreateBotModalProps {
  isOpen: boolean
  onClose: () => void
  onCreated?: () => void
}

const DEFAULT_FORM = {
  username: '',
  avatar: '',
  wager: 10,
  rank: 'Bronze',
  minBet: 0.2,
  maxBet: 20,
  minMultiplier: 1.1,
  maxMultiplier: 50,
}

export default function CreateBotModal({ isOpen, onClose, onCreated }: CreateBotModalProps) {
  const [form, setForm] = useState(DEFAULT_FORM)
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleChange = (field: keyof typeof DEFAULT_FORM, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]:
        typeof prev[field] === 'number'
          ? Number(value)
          : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.username.trim()) {
      toast.error('Username is required')
      return
    }
    if (!form.rank.trim()) {
      toast.error('Rank is required')
      return
    }
    try {
      setLoading(true)
      await createBotAccount(form)
      toast.success('Bot account created successfully')
      setForm(DEFAULT_FORM)
      onCreated?.()
      onClose()
    } catch (error) {
      // errors handled by API helper
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
      <div className='w-full max-w-2xl rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900'>
        <div className='mb-4 flex items-center justify-between'>
          <h3 className='text-xl font-semibold text-gray-800 dark:text-white/90'>
            Create Bot Account
          </h3>
          <button
            type='button'
            className='text-gray-500 hover:text-gray-700 dark:text-gray-400'
            onClick={() => {
              if (!loading) {
                onClose()
              }
            }}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div>
              <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>
                Username
              </label>
              <input
                type='text'
                value={form.username}
                onChange={(e) => handleChange('username', e.target.value)}
                className='w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
                required
              />
            </div>
            <div>
              <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>
                Avatar URL
              </label>
              <input
                type='text'
                value={form.avatar}
                onChange={(e) => handleChange('avatar', e.target.value)}
                placeholder='/images/default-avatar.png'
                className='w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
              />
            </div>
            <div>
              <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>
                Wager Amount
              </label>
              <input
                type='number'
                value={form.wager}
                min={0.01}
                step={0.01}
                onChange={(e) => handleChange('wager', e.target.value)}
                className='w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
                required
              />
            </div>
            <div>
              <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>
                Rank
              </label>
              <input
                type='text'
                value={form.rank}
                onChange={(e) => handleChange('rank', e.target.value)}
                className='w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
                required
              />
            </div>
            <div>
              <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>
                Min Bet
              </label>
              <input
                type='number'
                value={form.minBet}
                min={0.01}
                step={0.01}
                onChange={(e) => handleChange('minBet', e.target.value)}
                className='w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
                required
              />
            </div>
            <div>
              <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>
                Max Bet
              </label>
              <input
                type='number'
                value={form.maxBet}
                min={0.01}
                step={0.01}
                onChange={(e) => handleChange('maxBet', e.target.value)}
                className='w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
                required
              />
            </div>
            <div>
              <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>
                Min Multiplier
              </label>
              <input
                type='number'
                value={form.minMultiplier}
                min={0.1}
                step={0.1}
                onChange={(e) => handleChange('minMultiplier', e.target.value)}
                className='w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
                required
              />
            </div>
            <div>
              <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>
                Max Multiplier
              </label>
              <input
                type='number'
                value={form.maxMultiplier}
                min={0.1}
                step={0.1}
                onChange={(e) => handleChange('maxMultiplier', e.target.value)}
                className='w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
                required
              />
            </div>
          </div>

          <div className='flex justify-end gap-3 pt-2'>
            <Button
              type='button'
              variant='outline'
              size='sm'
              onClick={() => {
                if (!loading) onClose()
              }}
            >
              Cancel
            </Button>
            <Button type='submit' size='sm' disabled={loading}>
              {loading ? 'Creating...' : 'Create Bot'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

