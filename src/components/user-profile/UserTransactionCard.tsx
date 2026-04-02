'use client'

import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

import { getTransactions } from '@/api/users'

import {
  TRANSACTION_COLUMNS,
  TRANSACTION_TABS,
  TRANSACTION_TYPES,
} from '@/lib/transaction'

import TransactionsTable from '@/components/tables/TransactionsTable'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { IUserWithProfile } from '@/types/users'

const RenderTable = (user: IUserWithProfile, tab: string) => {
  const [transactions, setTransactions] = useState<any[]>([])
  const [totalPages, setTotalPages] = useState<number>(0)
  const [page, setPage] = useState<number>(1)
  const [isLoadingTx, setIsLoadingTx] = useState<boolean>(true)
  const [limit] = useState<number>(5)

  const fetchTransactions = useCallback(
    async (page: number, limit: number, type: string, userId: string) => {
      try {
        setIsLoadingTx(true)
        const response = await getTransactions({ page, limit, type, userId })
        setTransactions(response.rows)
        setTotalPages(response.pagination.totalPages)
        setPage(response.pagination.currentPage)
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message)
        } else {
          toast.error('Error fetching FTD summary')
        }
      } finally {
        setIsLoadingTx(false)
      }
    },
    []
  )

  useEffect(() => {
    fetchTransactions(page, limit, tab, user._id)
  }, [page, limit, tab, user, fetchTransactions])

  switch (tab) {
    case TRANSACTION_TYPES.GAME:
      return (
        <div className='max-w-full'>
          <TransactionsTable
            columns={TRANSACTION_COLUMNS[tab]}
            rows={transactions}
            totalPages={totalPages}
            setPage={setPage}
            page={page}
            isLoading={isLoadingTx}
          />
        </div>
      )
    case TRANSACTION_TYPES.PIX:
      return (
        <div className='max-w-full'>
          <TransactionsTable
            columns={TRANSACTION_COLUMNS[tab]}
            rows={transactions}
            totalPages={totalPages}
            setPage={setPage}
            page={page}
            isLoading={isLoadingTx}
          />
        </div>
      )
    case TRANSACTION_TYPES.SERVICE:
      return (
        <div className='max-w-full'>
          <TransactionsTable
            columns={TRANSACTION_COLUMNS[tab]}
            rows={transactions}
            totalPages={totalPages}
            setPage={setPage}
            page={page}
            isLoading={isLoadingTx}
          />
        </div>
      )
    default:
      return <p className='text-muted-foreground text-sm'>Unknown Tab.</p>
  }
}

export default function UserTransactionCard({
  user,
}: {
  user: IUserWithProfile
}) {
  return (
    <div className='rounded-2xl border border-gray-200 p-5 lg:p-6 dark:border-gray-800'>
      <div className='flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between'>
        <div className='w-full overflow-hidden'>
          <h4 className='text-lg font-semibold text-gray-800 lg:mb-6 dark:text-white/90'>
            Transactions information
          </h4>
          <Tabs defaultValue='game'>
            <TabsList>
              {TRANSACTION_TABS.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {TRANSACTION_TABS.map(({ value }) => (
              <TabsContent key={value} value={value}>
                {RenderTable(user, value)}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  )
}
