'use client'
import { useState } from 'react'
import { toast } from 'sonner'

import Button from '@/components/ui/button/Button'

interface ScheduleReviewModalProps {
  tierId: string
  tierName: string
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export default function ScheduleReviewModal({
  tierId,
  tierName,
  isOpen,
  onClose,
  onSuccess,
}: ScheduleReviewModalProps) {
  const [reviewDate, setReviewDate] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!reviewDate) {
      toast.error('Please select a review date')
      return
    }

    const selectedDate = new Date(reviewDate)
    if (selectedDate < new Date()) {
      toast.error('Review date must be in the future')
      return
    }

    setLoading(true)
    try {
      // TODO: Implement API call to schedule review
      // await scheduleTierReview(tierId, reviewDate, notes)
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      
      toast.success(`Review scheduled for ${tierName} tier on ${new Date(reviewDate).toLocaleDateString()}`)
      setReviewDate('')
      setNotes('')
      onClose()
      onSuccess?.()
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Failed to schedule review')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
      <div className='w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900'>
        <h3 className='mb-4 text-lg font-semibold text-gray-800 dark:text-white/90'>
          Schedule Review - {tierName}
        </h3>
        
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>
              Review Date
            </label>
            <input
              type='datetime-local'
              value={reviewDate}
              onChange={(e) => setReviewDate(e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
              className='w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
              required
            />
          </div>

          <div>
            <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder='Add notes about this review'
              rows={3}
              className='w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
            />
          </div>

          <div className='flex gap-2 justify-end'>
            <Button
              type='button'
              size='sm'
              variant='outline'
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type='submit' size='sm' disabled={loading}>
              {loading ? 'Scheduling...' : 'Schedule Review'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

