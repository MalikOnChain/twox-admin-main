'use client'
import { useState } from 'react'
import { toast } from 'sonner'

import { addStreamerFunds, IStreamerAccount } from '@/api/user-management'

import Button from '@/components/ui/button/Button'

interface AddFundsModalProps {
  streamer: IStreamerAccount | null
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export default function AddFundsModal({ streamer, isOpen, onClose, onSuccess }: AddFundsModalProps) {
  const [amount, setAmount] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)

  if (!isOpen || !streamer) return null

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    const parsedAmount = Number(amount)
    if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error('Please enter a valid amount')
      return
    }

    try {
      setLoading(true)
      await addStreamerFunds(streamer._id, { amount: parsedAmount, notes })
      toast.success(`Added $${parsedAmount.toFixed(2)} to ${streamer.username}`)
      setAmount('')
      setNotes('')
      onSuccess?.()
      onClose()
    } catch (error) {
      // Errors handled in API helper
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
      <div className='w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900'>
        <h3 className='mb-4 text-lg font-semibold text-gray-800 dark:text-white/90'>
          Add Funds - {streamer.username}
        </h3>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>
              Amount ($)
            </label>
            <input
              type='number'
              min='0.01'
              step='0.01'
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder='Enter amount'
              className='w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
              required
            />
          </div>

          <div>
            <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>
              Notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder='Add internal notes'
              className='w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
            />
          </div>

          <div className='flex justify-end gap-2'>
            <Button type='button' size='sm' variant='outline' onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type='submit' size='sm' disabled={loading}>
              {loading ? 'Adding...' : 'Add Funds'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

