'use client'

import moment from 'moment'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

import {
  approveWithdrawal,
  getSeedData,
  getTransactionCharts,
  getTransactions,
} from '@/api/transactions'

import ComponentCard from '@/components/common/ComponentCard'
import { InputSearch } from '@/components/common/InputSearch'
import Loading from '@/components/common/Loading'
import TransactionsTable from '@/components/tables/TransactionsTable'
import PixKeyCell from '@/components/tables/TransactionsTable/PixKeyCell'
import StatusCell from '@/components/tables/TransactionsTable/StatusCell'
import UserCell from '@/components/tables/TransactionsTable/UserCell'
import Button from '@/components/ui/button/Button'
import Badge from '@/components/ui/badge/Badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

import TransactionFilters from './deposits-withdrawals/TransactionFilters'
import SummaryCards from './deposits-withdrawals/SummaryCards'
import TransactionCharts from './deposits-withdrawals/TransactionCharts'

export default function DepositsWithdrawalsPage() {
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw'>('deposit')
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [tableData, setTableData] = useState<any[]>([])
  const [totalPages, setTotalPages] = useState<number>(0)
  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(20)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [selectedRows, setSelectedRows] = useState<string[]>([])

  // Filters
  const [filters, setFilters] = useState({
    method: '',
    currency: '',
    status: '',
    country: '',
  })

  const [seedData, setSeedData] = useState<any>({
    paid: { count: 0, totalAmount: 0 },
    pending: { count: 0, totalAmount: 0 },
    health: { percent: 0, description: '' },
  })

  const [chartData, setChartData] = useState<any>({
    volume: { labels: [], counts: [], amounts: [] },
    methodSplit: { labels: [], counts: [], amounts: [] },
    processingTime: { labels: [], counts: [] },
  })
  const [chartsLoading, setChartsLoading] = useState(false)

  const title = useMemo(
    () => (activeTab === 'deposit' ? 'Deposits' : 'Withdrawals'),
    [activeTab]
  )

  useEffect(() => {
    const fetchSeedData = async () => {
      try {
        const res = await getSeedData({ type: activeTab })
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
            Math.ceil((res.paid.count / (res.paid.count + res.pending.count || 1)) * 100),
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
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message)
        } else {
          toast.error('Error fetching seed data')
        }
      }
    }
    fetchSeedData()
  }, [activeTab])

  const fetchTransactions = useCallback(
    async ({
      page: pageNum,
      search,
    }: {
      page: number
      search?: string
    }) => {
      try {
        setIsLoading(true)
        const transactionFilters: any = {
          type: activeTab,
          search: search || searchTerm || undefined,
          ...filters,
        }
        const response = await getTransactions({
          page: pageNum,
          limit,
          filters: transactionFilters,
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
    },
    [activeTab, limit, searchTerm, filters]
  )

  useEffect(() => {
    // Reset to page 1 when filters or tab change, then fetch
    setPage(1)
  }, [activeTab, filters.method, filters.currency, filters.status, filters.country])

  useEffect(() => {
    // Fetch when page, limit, activeTab, or filters change
    fetchTransactions({ page })
  }, [page, limit, activeTab, filters, fetchTransactions])

  // Fetch chart data
  useEffect(() => {
    const fetchCharts = async () => {
      try {
        setChartsLoading(true)
        const response = await getTransactionCharts({
          type: activeTab,
          days: 30,
        })
        setChartData(response.data)
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message)
        } else {
          toast.error('Error fetching chart data')
        }
      } finally {
        setChartsLoading(false)
      }
    }
    fetchCharts()
  }, [activeTab])

  const handleChangePage = (pageNum: number) => {
    setPage(pageNum)
    fetchTransactions({ page: pageNum })
  }

  const handleChangePageLimit = (limitNum: number) => {
    setLimit(limitNum)
  }

  const handleSearch = useCallback(
    (value: string) => {
      setSearchTerm(value)
      fetchTransactions({ page: 1, search: value })
    },
    [fetchTransactions]
  )

  const handleApproveWithdrawal = useCallback(async (transactionId: string) => {
    try {
      setIsLoading(true)
      await approveWithdrawal(transactionId)
      fetchTransactions({ page })
      toast.success('Withdrawal approved successfully')
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Error approving withdrawal')
      }
    } finally {
      setIsLoading(false)
    }
  }, [page, fetchTransactions])

  const handleBulkApprove = async () => {
    if (selectedRows.length === 0) {
      toast.error('Please select transactions to approve')
      return
    }
    try {
      setIsLoading(true)
      // TODO: Implement bulk approve API
      toast.info(`Bulk approve ${selectedRows.length} transactions - functionality to be implemented`)
      setSelectedRows([])
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Error bulk approving transactions')
      }
    } finally {
      setIsLoading(false)
    }
  }

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
        render: (item: any) => `${item.currency || 'BRL'} ${Number(item.amount).toFixed(2)}`,
      },
      {
        id: 'method',
        label: 'Method',
        col: 2,
        render: (item: any) => (
          <Badge size='sm' color='primary'>
            {item.method || 'N/A'}
          </Badge>
        ),
      },
      {
        id: 'pixKey',
        label: 'PIX Key',
        col: 2,
        disabled: activeTab === 'deposit',
        render: (item: any) => <PixKeyCell pixKey={item.pixKey} />,
      },
      {
        id: 'time',
        label: 'Time',
        col: 2,
        render: (item: any) => moment(item.updatedAt).format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        id: 'status',
        label: 'Status',
        col: 2,
        render: (item: any) => <StatusCell item={item} />,
      },
      {
        id: 'action',
        label: 'Action',
        col: 2,
        render: (item: any) => (
          <div className='flex gap-2'>
            {item.status === 0 && activeTab === 'withdraw' && (
              <Button
                size='sm'
                variant='outline'
                onClick={() => handleApproveWithdrawal(item._id)}
              >
                Approve
              </Button>
            )}
            {item.status === 0 && (
              <>
                <Button
                  size='sm'
                  variant='outline'
                  onClick={() => toast.info(`Hold ${item._id} - functionality to be implemented`)}
                >
                  Hold
                </Button>
                <Button
                  size='sm'
                  variant='outline'
                  onClick={() => toast.info(`Reject ${item._id} - functionality to be implemented`)}
                >
                  Reject
                </Button>
              </>
            )}
            {item.status === 1 && activeTab === 'deposit' && (
              <Button
                size='sm'
                variant='outline'
                onClick={() => toast.info(`Refund ${item._id} - functionality to be implemented`)}
              >
                Refund
              </Button>
            )}
          </div>
        ),
      },
    ],
    [activeTab, handleApproveWithdrawal]
  )

  if (isLoading && tableData.length === 0) {
    return <Loading />
  }

  return (
    <div className='space-y-6'>
      <ComponentCard
        title={title}
        inputSearchElement={<InputSearch fetchData={handleSearch} />}
      >
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'deposit' | 'withdraw')}>
          <TabsList>
            <TabsTrigger value='deposit'>Deposits</TabsTrigger>
            <TabsTrigger value='withdraw'>Withdrawals</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Filters */}
        <TransactionFilters filters={filters} onFilterChange={setFilters} />

        {/* Bulk Actions */}
        {selectedRows.length > 0 && (
          <div className='mt-4 flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-900/20'>
            <span className='text-sm text-blue-800 dark:text-blue-200'>
              {selectedRows.length} transaction(s) selected
            </span>
            <Button size='sm' onClick={handleBulkApprove}>
              Bulk Approve
            </Button>
          </div>
        )}

        {/* Stats Cards */}
        <SummaryCards seedData={seedData} />

        {/* Charts */}
        <TransactionCharts chartData={chartData} loading={chartsLoading} />

        {/* Transactions Table */}
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
    </div>
  )
}

