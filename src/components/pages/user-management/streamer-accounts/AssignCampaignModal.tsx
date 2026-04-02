'use client'
import { useState } from 'react'
import { toast } from 'sonner'

import { assignStreamerCampaign, IStreamerAccount } from '@/api/user-management'

import Button from '@/components/ui/button/Button'

interface AssignCampaignModalProps {
  streamer: IStreamerAccount | null
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export default function AssignCampaignModal({
  streamer,
  isOpen,
  onClose,
  onSuccess,
}: AssignCampaignModalProps) {
  const [campaignName, setCampaignName] = useState('')
  const [campaignLink, setCampaignLink] = useState('')
  const [campaignBudget, setCampaignBudget] = useState('')
  const [loading, setLoading] = useState(false)

  if (!isOpen || !streamer) return null

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!campaignName) {
      toast.error('Campaign name is required')
      return
    }

    try {
      setLoading(true)
      await assignStreamerCampaign(streamer._id, {
        campaignName,
        campaignLink: campaignLink || undefined,
        campaignBudget: campaignBudget ? Number(campaignBudget) : undefined,
      })
      toast.success(`Assigned ${campaignName} to ${streamer.username}`)
      setCampaignName('')
      setCampaignLink('')
      setCampaignBudget('')
      onSuccess?.()
      onClose()
    } catch (error) {
      // handled upstream
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
      <div className='w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900'>
        <h3 className='mb-4 text-lg font-semibold text-gray-800 dark:text-white/90'>
          Assign Campaign - {streamer.username}
        </h3>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>
              Campaign Name
            </label>
            <input
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              placeholder='Enter campaign name'
              required
              className='w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
            />
          </div>

          <div>
            <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>
              Campaign Link (optional)
            </label>
            <input
              value={campaignLink}
              onChange={(e) => setCampaignLink(e.target.value)}
              placeholder='https://example.com'
              className='w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
            />
          </div>

          <div>
            <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>
              Campaign Budget (optional)
            </label>
            <input
              type='number'
              min='0'
              step='0.01'
              value={campaignBudget}
              onChange={(e) => setCampaignBudget(e.target.value)}
              placeholder='Enter budget'
              className='w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
            />
          </div>

          <div className='flex justify-end gap-2'>
            <Button type='button' size='sm' variant='outline' onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type='submit' size='sm' disabled={loading}>
              {loading ? 'Assigning...' : 'Assign Campaign'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

