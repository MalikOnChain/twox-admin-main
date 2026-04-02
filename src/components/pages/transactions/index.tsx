'use client'

import moment from 'moment'
import { useParams } from 'next/navigation'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

import {
  approveWithdrawal,
  getSeedData,
  getTransactions,
} from '@/api/transactions'

import ComponentCard from '@/components/common/ComponentCard'
import { InputSearch } from '@/components/common/InputSearch'
import TransactionsTable from '@/components/tables/TransactionsTable'
import PixKeyCell from '@/components/tables/TransactionsTable/PixKeyCell'
import StatusCell from '@/components/tables/TransactionsTable/StatusCell'
import UserCell from '@/components/tables/TransactionsTable/UserCell'
import { Card } from '@/components/ui/card'

export default function Transactions() {
  const { type } = useParams()

  const title = useMemo(
    () => (type === 'deposit' ? 'Deposits' : 'Withdrawals'),
    [type]
  )

  const tableColumns = useMemo(
    () => [
      {
        id: 'user',
        label: 'User',
        col: 2,
        render: (item: any) => <UserCell user={item.userId} />,
      },
      {
        id: 'amount',
        label: 'Amount',
        col: 2,
        render: (item) => Number(item.amount).toFixed(2),
      },
      {
        id: 'pixKey',
        label: 'PIX Key',
        col: 2,
        disabled: type === 'deposit',
        render: (item) => <PixKeyCell pixKey={item.pixKey} />,
      },
      {
        id: 'time',
        label: 'Time',
        col: 2,
        render: (item) => moment(item.updatedAt).format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        id: 'status',
        label: 'Status',
        col: 2,
        render: (item) => <StatusCell item={item} />,
      },
      {
        id: 'action',
        label: 'Action',
        col: 2,
        disabled: type === 'deposit',
        render: (item) => (
          <>
            {item.status === 0 ? (
              <button
                className='hover:text-brand-500'
                onClick={() => handleApproveWithdrawal(item._id)}
              >
                Approve
              </button>
            ) : null}
          </>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [type]
  )

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [tableData, setTableData] = useState<any[]>([])
  const [totalPages, setTotalPages] = useState<number>(0)
  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(5)
  const [searchTerm, setSearchTerm] = useState<string>('')

  const [seedData, setSeedData] = useState<any>({
    paid: {
      count: 0,
      totalAmount: 0,
    },
    pending: {
      count: 0,
      totalAmount: 0,
    },
    health: {
      percent: 0,
      description: '',
    },
  })

  useEffect(() => {
    try {
      getSeedData({ type: type as string }).then((res) => {
        const paid = {
          count: res.paid.count,
          totalAmount: Number(res.paid.totalAmount).toFixed(2),
        }
        const pending = {
          count: res.pending.count,
          totalAmount: Number(res.pending.totalAmount).toFixed(2),
        }
        const rate = Math.max(
          Math.min(
            Math.ceil(
              (res.paid.count / (res.paid.count + res.pending.count || 1)) * 100
            ),
            100
          ),
          0
        )

        const health = {
          percent: rate,
          description:
            rate < 50
              ? 'Approval rate is low!'
              : rate < 70
                ? 'Approval rate is moderate!'
                : 'Approval rate is good!',
        }

        setSeedData({ paid, pending, health })
      })
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Error fetching seed data')
      }
    }
  }, [type])

  const fetchTransactions = async ({
    page,
    search,
  }: {
    page: number
    search?: string
  }) => {
    try {
      setIsLoading(true)

      const filters: any = {
        type: type as string,
        search: search || searchTerm || undefined,
      }

      const response = await getTransactions({
        page,
        limit,
        filters,
      })

      setTableData(response.rows)
      setTotalPages(response.pagination.totalPages)
      setPage(response.pagination.currentPage)
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Error fetching transactions')
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTransactions({ page })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit])

  const handleChangePage = (page: number) => {
    setPage(page)
    fetchTransactions({ page })
  }

  const handleChangePageLimit = (limit: number) => {
    setLimit(limit)
  }

  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value)
    fetchTransactions({ page: 1, search: value })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleApproveWithdrawal = async (transactionId: string) => {
    try {
      setIsLoading(true)

      await approveWithdrawal(transactionId)
      fetchTransactions({ page })
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Error approving withdrawal')
      }
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <ComponentCard
      title={title}
      inputSearchElement={<InputSearch fetchData={handleSearch} />}
    >
      <div className='grid grid-cols-1 gap-4 lg:grid-cols-3'>
        <Card>
          <h3 className='text-sm font-medium text-gray-400'>Approved</h3>
          <p className='text-2xl font-bold text-white'>{seedData.paid.count}</p>
          <p className='text-sm text-gray-400'>
            Total Approved | R${seedData.paid.totalAmount}
          </p>
        </Card>
        <Card>
          <h3 className='text-sm font-medium text-gray-400'>Pending</h3>
          <p className='text-2xl font-bold text-white'>
            {seedData.pending.count}
          </p>
          <p className='text-sm text-gray-400'>
            Total Outstanding | R${seedData.pending.totalAmount}
          </p>
        </Card>
        <Card>
          <h3 className='text-sm font-medium text-gray-400'>Health</h3>
          <p className='text-2xl font-bold text-white'>
            {seedData.health.percent}%
          </p>
          <p className='text-sm text-gray-400'>{seedData.health.description}</p>
        </Card>
      </div>
      <TransactionsTable
        columns={tableColumns}
        rows={tableData}
        totalPages={totalPages}
        setPage={handleChangePage}
        setLimit={handleChangePageLimit}
        limit={limit}
        page={page}
        isLoading={isLoading}
      />
    </ComponentCard>
  )
}
