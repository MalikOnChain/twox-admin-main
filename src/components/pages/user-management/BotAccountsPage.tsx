'use client'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

import {
  getBotAccounts,
  IBotAccount,
} from '@/api/user-management'

import Loading from '@/components/common/Loading'
import Button from '@/components/ui/button/Button'

import BotAccountsTable from './bot-accounts/BotAccountsTable'
import BotCharts from './bot-accounts/BotCharts'
import CreateBotModal from './bot-accounts/CreateBotModal'

export default function BotAccountsPage() {
  const [loading, setLoading] = useState(true)
  const [bots, setBots] = useState<IBotAccount[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const response = await getBotAccounts({
        page,
        limit: 20,
        status: statusFilter || undefined,
      })
      setBots(response.data)
      setTotalPages(response.pagination.totalPages)
      setPage(response.pagination.currentPage)
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Error fetching bot accounts')
      }
    } finally {
      setLoading(false)
    }
  }, [page, statusFilter])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }


  return (
    <div className='space-y-6'>
      <div className='rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/[0.03]'>
        <div className='mb-4 flex items-center justify-between'>
          <h2 className='text-xl font-semibold text-gray-800 dark:text-white/90'>
            Bot Accounts
          </h2>
          <div className='flex gap-2'>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
                setPage(1)
              }}
              className='rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
            >
              <option value=''>All Status</option>
              <option value='active'>Active</option>
              <option value='paused'>Paused</option>
            </select>
            <Button
              size='sm'
              onClick={() => setIsCreateOpen(true)}
            >
              Create Bot
            </Button>
          </div>
        </div>

        {loading ? (
          <Loading />
        ) : (
          <>
            <BotAccountsTable
              bots={bots}
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
            <BotCharts />
          </>
        )}
      </div>
      <CreateBotModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreated={() => {
          fetchData()
        }}
      />
    </div>
  )
}
