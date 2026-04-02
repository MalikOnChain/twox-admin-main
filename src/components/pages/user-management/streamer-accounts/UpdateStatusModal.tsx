'use client'
import { useState } from 'react'
import { toast } from 'sonner'

import { IStreamerAccount, updateStreamerStatus } from '@/api/user-management'

import Button from '@/components/ui/button/Button'

interface UpdateStatusModalProps {
  streamer: IStreamerAccount | null
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export default function UpdateStatusModal({
  streamer,
  isOpen,
  onClose,
  onSuccess,
}: UpdateStatusModalProps) {
  const [status, setStatus] = useState<'active' | 'paused'>('paused')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)

  if (!isOpen || !streamer) return null

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    try {
      setLoading(true)
      await updateStreamerStatus(streamer._id, { status, notes })
      toast.success(
        status === 'paused'
          ? `${streamer.username} has been paused`
          : `${streamer.username} has been reactivated`
      )
      setNotes('')
      onSuccess?.()
      onClose()
    } catch (error) {
      // handled in helper
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
      <div className='w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900'>
        <h3 className='mb-4 text-lg font-semibold text-gray-800 dark:text-white/90'>
          Update Status - {streamer.username}
        </h3>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as 'active' | 'paused')}
              className='w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
            >
              <option value='paused'>Pause</option>
              <option value='active'>Activate</option>
            </select>
          </div>

          <div>
            <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>
              Notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className='w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
            />
          </div>

          <div className='flex justify-end gap-2'>
            <Button type='button' size='sm' variant='outline' onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type='submit' size='sm' disabled={loading}>
              {loading ? 'Updating...' : 'Update Status'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

