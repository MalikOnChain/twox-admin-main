'use client'

import { useState } from 'react'
import { toast } from 'sonner'

import { generateSettlementReport } from '@/api/treasury'
import { formatNumber } from '@/lib/utils'

import Button from '@/components/ui/button/Button'
import Loading from '@/components/common/Loading'
import { Modal } from '@/components/ui/modal'

interface SettlementReportModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SettlementReportModal({ isOpen, onClose }: SettlementReportModalProps) {
  const [loading, setLoading] = useState(false)
  const [reportData, setReportData] = useState<any>(null)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const handleGenerate = async () => {
    try {
      setLoading(true)
      const response = await generateSettlementReport(
        startDate || undefined,
        endDate || undefined
      )
      setReportData(response.data)
      toast.success('Settlement report generated successfully')
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Failed to generate settlement report')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    if (!reportData) return

    const reportText = `
SETTLEMENT REPORT
Generated: ${new Date(reportData.generatedAt).toLocaleString()}
Period: ${new Date(reportData.period.start).toLocaleDateString()} - ${new Date(reportData.period.end).toLocaleDateString()}

WALLET BALANCES
Hot Wallets: ${JSON.stringify(reportData.walletBalances.hot, null, 2)}
Warm Wallets: ${JSON.stringify(reportData.walletBalances.warm, null, 2)}
Cold Wallets: ${JSON.stringify(reportData.walletBalances.cold, null, 2)}

TRANSACTIONS
Fiat: ${JSON.stringify(reportData.transactions.fiat, null, 2)}
Crypto: ${JSON.stringify(reportData.transactions.crypto, null, 2)}
    `.trim()

    const blob = new Blob([reportText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `settlement-report-${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} className='max-w-[600px] p-6'>
      <div className='p-6'>
        <h2 className='mb-4 text-xl font-semibold text-gray-800 dark:text-white/90'>
          Settlement Report
        </h2>

        {!reportData ? (
          <div className='space-y-4'>
            <div>
              <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>
                Start Date (Optional)
              </label>
              <input
                type='date'
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className='w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
              />
            </div>

            <div>
              <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>
                End Date (Optional)
              </label>
              <input
                type='date'
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className='w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
              />
            </div>

            <div className='flex justify-end gap-3 pt-4'>
              <Button type='button' variant='outline' onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              <Button onClick={handleGenerate} disabled={loading}>
                {loading ? 'Generating...' : 'Generate Report'}
              </Button>
            </div>
          </div>
        ) : (
          <div className='space-y-4'>
            {loading ? (
              <Loading />
            ) : (
              <>
                <div className='rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800'>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>
                    <strong>Period:</strong>{' '}
                    {new Date(reportData.period.start).toLocaleDateString()} -{' '}
                    {new Date(reportData.period.end).toLocaleDateString()}
                  </p>
                  <p className='mt-2 text-sm text-gray-600 dark:text-gray-400'>
                    <strong>Generated:</strong>{' '}
                    {new Date(reportData.generatedAt).toLocaleString()}
                  </p>
                </div>

                <div className='max-h-96 space-y-4 overflow-y-auto'>
                  <div>
                    <h3 className='mb-2 text-lg font-semibold text-gray-800 dark:text-white/90'>
                      Wallet Balances
                    </h3>
                    <div className='space-y-2 text-sm'>
                      <div>
                        <strong>Hot Wallets:</strong>{' '}
                        {reportData.walletBalances.hot.length} currencies
                      </div>
                      <div>
                        <strong>Warm Wallets:</strong>{' '}
                        {reportData.walletBalances.warm.length} currencies
                      </div>
                      <div>
                        <strong>Cold Wallets:</strong>{' '}
                        {reportData.walletBalances.cold.length} currencies
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className='mb-2 text-lg font-semibold text-gray-800 dark:text-white/90'>
                      Transactions Summary
                    </h3>
                    <div className='space-y-2 text-sm'>
                      <div>
                        <strong>Fiat Transactions:</strong> {reportData.transactions.fiat.length} groups
                      </div>
                      <div>
                        <strong>Crypto Transactions:</strong>{' '}
                        {reportData.transactions.crypto.length} groups
                      </div>
                    </div>
                  </div>
                </div>

                <div className='flex justify-end gap-3 pt-4'>
                  <Button variant='outline' onClick={() => setReportData(null)}>
                    Generate New Report
                  </Button>
                  <Button onClick={handleDownload}>Download Report</Button>
                  <Button variant='outline' onClick={onClose}>
                    Close
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </Modal>
  )
}

