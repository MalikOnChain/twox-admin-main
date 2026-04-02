'use client'
import { useState } from 'react'
import { toast } from 'sonner'

import { IStreamerAccount, setStreamerOverride } from '@/api/user-management'

import Button from '@/components/ui/button/Button'

interface SetOverrideModalProps {
  streamer: IStreamerAccount | null
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export default function SetOverrideModal({
  streamer,
  isOpen,
  onClose,
  onSuccess,
}: SetOverrideModalProps) {
  const [rtp, setRtp] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)

  if (!isOpen || !streamer) return null

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    const parsedRtp = Number(rtp)
    if (Number.isNaN(parsedRtp) || parsedRtp <= 0) {
      toast.error('Please enter a valid RTP override value')
      return
    }

    try {
      setLoading(true)
      await setStreamerOverride(streamer._id, {
        rtp: parsedRtp,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        notes,
      })
      toast.success(`Override set for ${streamer.username}`)
      setRtp('')
      setStartDate('')
      setEndDate('')
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
      <div className='w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900'>
        <h3 className='mb-4 text-lg font-semibold text-gray-800 dark:text-white/90'>
          Set Override - {streamer.username}
        </h3>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>
              RTP Override (%)
            </label>
            <input
              type='number'
              min='0.1'
              step='0.1'
              value={rtp}
              onChange={(e) => setRtp(e.target.value)}
              required
              className='w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
            />
          </div>

          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div>
              <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>
                Start Date
              </label>
              <input
                type='datetime-local'
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className='w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
              />
            </div>
            <div>
              <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>
                End Date
              </label>
              <input
                type='datetime-local'
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className='w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
              />
            </div>
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
              {loading ? 'Saving...' : 'Save Override'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

