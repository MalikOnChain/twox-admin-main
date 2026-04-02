'use client'
import { toast } from 'sonner'

import Button from '@/components/ui/button/Button'

export default function NotesTab() {
  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h3 className='text-sm font-medium text-gray-700 dark:text-gray-300'>Notes & Audit Trail</h3>
        <Button
          size='sm'
          onClick={() => toast.info('Add note functionality to be implemented')}
        >
          Add Note
        </Button>
      </div>
      <div className='rounded-lg border border-gray-200 p-4 dark:border-gray-700'>
        <p className='text-sm text-gray-500 dark:text-gray-400'>
          Notes and audit trail functionality to be implemented. This will track all admin actions, notes, and changes made to the user account.
        </p>
      </div>
    </div>
  )
}

