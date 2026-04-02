'use client'

import { useState } from 'react'
import { toast } from 'sonner'

import { initiateTransfer, ITransferRequest } from '@/api/treasury'

import Button from '@/components/ui/button/Button'
import { Modal } from '@/components/ui/modal'

interface TransferModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function TransferModal({ isOpen, onClose, onSuccess }: TransferModalProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<ITransferRequest>({
    fromAddress: '',
    toAddress: '',
    blockchain: 'bitcoin',
    amount: 0,
    unit: 'BTC',
    note: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.fromAddress || !formData.toAddress || !formData.blockchain || !formData.amount || !formData.unit) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      setLoading(true)
      await initiateTransfer(formData)
      onSuccess()
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Failed to initiate transfer')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} className='max-w-[600px] p-6'>
      <div className='p-6'>
        <h2 className='mb-4 text-xl font-semibold text-gray-800 dark:text-white/90'>Initiate Transfer</h2>
        <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>
            From Address *
          </label>
          <input
            type='text'
            value={formData.fromAddress}
            onChange={(e) => setFormData({ ...formData, fromAddress: e.target.value })}
            placeholder='Enter source wallet address'
            required
            className='w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
          />
        </div>

        <div>
          <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>
            To Address *
          </label>
          <input
            type='text'
            value={formData.toAddress}
            onChange={(e) => setFormData({ ...formData, toAddress: e.target.value })}
            placeholder='Enter destination wallet address'
            required
            className='w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
          />
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <div>
            <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>
              Blockchain *
            </label>
            <select
              value={formData.blockchain}
              onChange={(e) => setFormData({ ...formData, blockchain: e.target.value })}
              className='w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
              required
            >
              <option value='bitcoin'>Bitcoin</option>
              <option value='ethereum'>Ethereum</option>
              <option value='litecoin'>Litecoin</option>
              <option value='dogecoin'>Dogecoin</option>
              <option value='xrp'>XRP</option>
              <option value='binance-smart-chain'>Binance Smart Chain</option>
              <option value='tron'>Tron</option>
              <option value='polygon'>Polygon</option>
            </select>
          </div>

          <div>
            <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>
              Unit *
            </label>
            <input
              type='text'
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value.toUpperCase() })}
              placeholder='BTC, ETH, etc.'
              required
              className='w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
            />
          </div>
        </div>

        <div>
          <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>
            Amount *
          </label>
          <input
            type='number'
            step='any'
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
            placeholder='Enter amount'
            required
            className='w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
          />
        </div>

        <div>
          <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>
            Note (Optional)
          </label>
          <textarea
            value={formData.note}
            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
            placeholder='Add a note for this transfer'
            rows={3}
            className='w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
          />
        </div>

        <div className='flex justify-end gap-3 pt-4'>
          <Button type='button' variant='outline' onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type='submit' disabled={loading}>
            {loading ? 'Processing...' : 'Initiate Transfer'}
          </Button>
        </div>
      </form>
      </div>
    </Modal>
  )
}

