'use client'

import Button from '@/components/ui/button/Button'
import Input from '@/components/form/input/InputField'
import Label from '@/components/form/Label'
import { Modal } from '@/components/ui/modal'
import { formatNumber } from '@/lib/utils'
import { IPayout } from '@/api/affiliate-management'

interface OverridePayoutModalProps {
  isOpen: boolean
  payout: IPayout | null
  amount: string
  notes: string
  onClose: () => void
  onAmountChange: (value: string) => void
  onNotesChange: (value: string) => void
  onSubmit: () => void
}

export default function OverridePayoutModal({
  isOpen,
  payout,
  amount,
  notes,
  onClose,
  onAmountChange,
  onNotesChange,
  onSubmit,
}: OverridePayoutModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className='max-w-md'>
      <div className='p-6'>
        <h2 className='mb-6 text-xl font-semibold text-gray-800 dark:text-white'>Override Payout</h2>
        {payout && (
          <div className='space-y-4'>
            <div>
              <Label>Partner</Label>
              <div className='text-sm text-gray-600 dark:text-gray-400'>
                {typeof payout.partnerId === 'object' ? payout.partnerId.name : 'Unknown'}
              </div>
            </div>
            <div>
              <Label>Original Amount</Label>
              <div className='text-sm text-gray-600 dark:text-gray-400'>R$ {formatNumber(payout.amount)}</div>
            </div>
            <div>
              <Label>New Amount *</Label>
              <Input
                type='number'
                min={0}
                step={0.01}
                value={amount}
                onChange={(e) => onAmountChange(e.target.value)}
                placeholder='Enter new amount'
              />
            </div>
            <div>
              <Label>Notes</Label>
              <textarea
                value={notes}
                onChange={(e) => onNotesChange(e.target.value)}
                rows={3}
                className='mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
                placeholder='Reason for override'
              />
            </div>
          </div>
        )}
        <div className='mt-6 flex justify-end gap-2'>
          <Button variant='outline' onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSubmit}>Override</Button>
        </div>
      </div>
    </Modal>
  )
}

