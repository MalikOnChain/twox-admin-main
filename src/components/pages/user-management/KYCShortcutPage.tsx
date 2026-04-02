'use client'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

import {
  getKYCShortcut,
  IKYCShortcut,
} from '@/api/user-management'

import Loading from '@/components/common/Loading'

import KYCTable from './kyc-shortcut/KYCTable'

export default function KYCShortcutPage() {
  const [loading, setLoading] = useState(true)
  const [kycList, setKycList] = useState<IKYCShortcut[]>([])
  const [statusFilter, setStatusFilter] = useState<string>('')

  const fetchKYC = useCallback(async () => {
    try {
      setLoading(true)
      const response = await getKYCShortcut(statusFilter ? { status: statusFilter } : undefined)
      setKycList(response.data)
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Error fetching KYC data')
      }
    } finally {
      setLoading(false)
    }
  }, [statusFilter])

  useEffect(() => {
    fetchKYC()
  }, [fetchKYC])


  return (
    <div className='space-y-6'>
      <div className='rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/[0.03]'>
        <div className='mb-4 flex items-center justify-between'>
          <h2 className='text-xl font-semibold text-gray-800 dark:text-white/90'>
            KYC Shortcut
          </h2>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className='rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
          >
            <option value=''>All Status</option>
            <option value='pending'>Pending</option>
            <option value='approved'>Approved</option>
            <option value='rejected'>Rejected</option>
          </select>
        </div>

        {loading ? (
          <Loading />
        ) : (
          <KYCTable kycList={kycList} onUpdate={fetchKYC} />
        )}
      </div>
    </div>
  )
}
