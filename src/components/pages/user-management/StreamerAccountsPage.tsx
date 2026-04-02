'use client'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

import {
  getStreamerAccounts,
  IStreamerAccount,
} from '@/api/user-management'

import Loading from '@/components/common/Loading'
import Button from '@/components/ui/button/Button'

import StreamerAccountsTable from './streamer-accounts/StreamerAccountsTable'

export default function StreamerAccountsPage() {
  const [loading, setLoading] = useState(true)
  const [streamers, setStreamers] = useState<IStreamerAccount[]>([])

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const response = await getStreamerAccounts()
      setStreamers(response.data)
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Error fetching streamer accounts')
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
        <div className='mb-4 flex items-center justify-between'>
          <h2 className='text-xl font-semibold text-gray-800 dark:text-white/90'>
            Streamer/Influencer Accounts
          </h2>
          <Button
            size='sm'
            onClick={() => toast.info('Add streamer account functionality to be implemented')}
          >
            Add Account
          </Button>
        </div>

        {loading ? (
          <Loading />
        ) : (
          <StreamerAccountsTable streamers={streamers} onRefresh={fetchData} />
        )}
      </div>
    </div>
  )
}
