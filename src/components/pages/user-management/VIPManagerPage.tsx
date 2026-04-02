'use client'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

import { getVIPManager, IVIPTier } from '@/api/user-management'

import Loading from '@/components/common/Loading'
import Button from '@/components/ui/button/Button'

import MigrationChart from './vip-manager/MigrationChart'
import VIPTiersTable from './vip-manager/VIPTiersTable'

export default function VIPManagerPage() {
  const [loading, setLoading] = useState(true)
  const [tiers, setTiers] = useState<IVIPTier[]>([])
  const [migration, setMigration] = useState<any[]>([])

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const response = await getVIPManager()
      setTiers(response.data.tiers)
      setMigration(response.data.migration)
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Error fetching VIP manager data')
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])


  return (
    <div className='space-y-6'>
      <div className='rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/[0.03]'>
        <div className='mb-4'>
          <h2 className='text-xl font-semibold text-gray-800 dark:text-white/90'>
            VIP Manager
          </h2>
        </div>

        {loading ? (
          <Loading />
        ) : (
          <>
            <VIPTiersTable tiers={tiers} onRefresh={fetchData} />
            <MigrationChart data={migration} />
          </>
        )}
      </div>
    </div>
  )
}
