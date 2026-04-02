'use client'

import { useState, useCallback, useEffect } from 'react'
import { toast } from 'sonner'
import dynamic from 'next/dynamic'

import {
  issueCredit,
  getCreditLedger,
  getCreditStats,
  ICreditTransaction,
  ICreditStats,
  IIssueCreditData,
} from '@/api/manual-credit'
import { getUsers } from '@/api/users'

import ComponentCard from '@/components/common/ComponentCard'
import Loading from '@/components/common/Loading'
import Button from '@/components/ui/button/Button'
import Badge from '@/components/ui/badge/Badge'
import Input from '@/components/form/input/InputField'
import Label from '@/components/form/Label'
import Pagination from '@/components/tables/Pagination'
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Modal } from '@/components/ui/modal'
import { formatNumber, formatDate } from '@/lib/utils'
import { useModal } from '@/hooks/useModal'
import { PlusIcon } from '@/icons'

// Dynamically import charts to avoid SSR issues
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

export default function ManualCreditPage() {
  const [loading, setLoading] = useState(true)
  const [transactions, setTransactions] = useState<ICreditTransaction[]>([])
  const [stats, setStats] = useState<ICreditStats | null>(null)
  const [users, setUsers] = useState<Array<{ _id: string; username: string; email?: string }>>([])
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 50,
  })
  const [filters, setFilters] = useState({
    userId: '',
    tag: '',
    startDate: '',
    endDate: '',
  })
  const [days, setDays] = useState(30)
  const issueModal = useModal()

  const [formData, setFormData] = useState<IIssueCreditData>({
    userId: '',
    amount: 0,
    reason: '',
    tag: 'bonus',
    expiryDate: '',
    wageringMultiplier: 0,
    notes: '',
  })

  const fetchUsers = useCallback(async () => {
    try {
      const response = await getUsers({ page: 1, limit: 1000, filter: '' })
      setUsers(response.rows || [])
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message)
      }
    }
  }, [])

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const [ledgerRes, statsRes] = await Promise.allSettled([
        getCreditLedger({
          page: pagination.currentPage,
          limit: pagination.itemsPerPage,
          ...filters,
        }),
        getCreditStats({ days }),
      ])

      if (ledgerRes.status === 'fulfilled') {
        setTransactions(ledgerRes.value.data)
        setPagination(ledgerRes.value.pagination)
      }
      if (statsRes.status === 'fulfilled') {
        setStats(statsRes.value.data)
      }
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message)
      }
    } finally {
      setLoading(false)
    }
  }, [pagination.currentPage, pagination.itemsPerPage, filters, days])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleIssueCredit = async () => {
    try {
      if (!formData.userId || !formData.amount || !formData.reason) {
        toast.error('Please fill in all required fields')
        return
      }

      await issueCredit(formData)
      toast.success('Credit issued successfully')
      issueModal.closeModal()
      setFormData({
        userId: '',
        amount: 0,
        reason: '',
        tag: 'bonus',
        expiryDate: '',
        wageringMultiplier: 0,
        notes: '',
      })
      fetchData()
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message)
      }
    }
  }

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, currentPage: page }))
  }

  if (loading && !stats) {
    return <Loading />
  }

  const statsChartOptions = stats?.byTag && stats.byTag.length > 0
    ? {
        chart: { type: 'donut' as const },
        labels: stats.byTag.map((s) => s.tag.toUpperCase()),
        series: stats.byTag.map((s) => s.amount),
      }
    : null

  return (
    <div className='space-y-6'>
      <ComponentCard title='Manual Credit Issuance'>
        {/* Stats Cards */}
        {stats && (
          <div className='mb-6 grid grid-cols-1 gap-4 md:grid-cols-4'>
            <div className='rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-white/[0.03]'>
              <div className='text-sm text-gray-500 dark:text-gray-400'>Total Issued</div>
              <div className='mt-1 text-2xl font-semibold text-gray-800 dark:text-white'>
                R$ {formatNumber(stats.total)}
              </div>
              <div className='mt-1 text-xs text-gray-500 dark:text-gray-400'>
                {stats.count} transactions
              </div>
            </div>
            {stats.byTag.map((tagStat) => (
              <div
                key={tagStat.tag}
                className='rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-white/[0.03]'
              >
                <div className='text-sm text-gray-500 dark:text-gray-400'>
                  {tagStat.tag.toUpperCase()}
                </div>
                <div className='mt-1 text-2xl font-semibold text-gray-800 dark:text-white'>
                  R$ {formatNumber(tagStat.amount)}
                </div>
                <div className='mt-1 text-xs text-gray-500 dark:text-gray-400'>
                  {tagStat.count} transactions
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Chart */}
        {statsChartOptions && (
          <div className='mb-6 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-white/[0.03]'>
            <h4 className='mb-4 text-sm font-semibold text-gray-800 dark:text-white'>
              Credits by Tag
            </h4>
            <Chart
              options={statsChartOptions}
              series={statsChartOptions.series}
              type='donut'
              height={300}
            />
          </div>
        )}

        {/* Issue Credit Button */}
        <div className='mb-6 flex justify-end'>
          <Button onClick={issueModal.openModal} size='xs'>
            <PlusIcon />
            Issue Credit
          </Button>
        </div>

        {/* Filters */}
        <div className='mb-6 flex gap-4'>
          <div className='flex-1'>
            <Label>User</Label>
            <select
              value={filters.userId}
              onChange={(e) => setFilters((prev) => ({ ...prev, userId: e.target.value }))}
              className='mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
            >
              <option value=''>All Users</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.username} {user.email && `(${user.email})`}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label>Tag</Label>
            <select
              value={filters.tag}
              onChange={(e) => setFilters((prev) => ({ ...prev, tag: e.target.value }))}
              className='mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
            >
              <option value=''>All Tags</option>
              <option value='bonus'>Bonus</option>
              <option value='comp'>Comp</option>
              <option value='maintenance'>Maintenance</option>
            </select>
          </div>
          <div>
            <Label>Start Date</Label>
            <Input
              type='date'
              value={filters.startDate}
              onChange={(e) => setFilters((prev) => ({ ...prev, startDate: e.target.value }))}
            />
          </div>
          <div>
            <Label>End Date</Label>
            <Input
              type='date'
              value={filters.endDate}
              onChange={(e) => setFilters((prev) => ({ ...prev, endDate: e.target.value }))}
            />
          </div>
        </div>

        {/* Ledger Table */}
        <div className='mt-6 overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700'>
          <Table>
            <TableHeader>
              <TableRow className='bg-gray-50 dark:bg-gray-800/50'>
                <TableCell isHeader className='px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300'>
                  Date
                </TableCell>
                <TableCell isHeader className='px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300'>
                  User
                </TableCell>
                <TableCell isHeader className='px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300'>
                  Amount
                </TableCell>
                <TableCell isHeader className='px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300'>
                  Tag
                </TableCell>
                <TableCell isHeader className='px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300'>
                  Reason
                </TableCell>
                <TableCell isHeader className='px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300'>
                  Wagering
                </TableCell>
                <TableCell isHeader className='px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300'>
                  Status
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className='divide-y divide-gray-100 dark:divide-white/[0.05]'>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className='px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400'>
                    Loading...
                  </TableCell>
                </TableRow>
              ) : transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className='px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400'>
                    No credit transactions found
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((transaction) => {
                  const user =
                    typeof transaction.userId === 'object'
                      ? transaction.userId
                      : { _id: transaction.userId, username: 'Unknown' }
                  return (
                    <TableRow
                      key={transaction._id}
                      className='transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/30'
                    >
                      <TableCell className='px-4 py-3 text-left text-sm text-gray-600 dark:text-gray-400'>
                        {formatDate(transaction.createdAt)}
                      </TableCell>
                      <TableCell className='px-4 py-3 text-left'>
                        <div>
                          <div className='font-medium text-gray-800 dark:text-white/90'>
                            {user.username}
                          </div>
                          {user.email && (
                            <div className='text-xs text-gray-500 dark:text-gray-400'>{user.email}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className='px-4 py-3 text-center text-sm font-semibold text-gray-800 dark:text-white/90'>
                        R$ {formatNumber(transaction.amount)}
                      </TableCell>
                      <TableCell className='px-4 py-3 text-center'>
                        <Badge
                          color={
                            transaction.metadata?.tag === 'bonus'
                              ? 'primary'
                              : transaction.metadata?.tag === 'comp'
                                ? 'success'
                                : 'warning'
                          }
                        >
                          {transaction.metadata?.tag || 'N/A'}
                        </Badge>
                      </TableCell>
                      <TableCell className='px-4 py-3 text-left text-sm text-gray-600 dark:text-gray-400'>
                        {transaction.metadata?.reason || '-'}
                      </TableCell>
                      <TableCell className='px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-400'>
                        {transaction.metadata?.wageringMultiplier
                          ? `${transaction.metadata.wageringMultiplier}x`
                          : '-'}
                      </TableCell>
                      <TableCell className='px-4 py-3 text-center'>
                        <Badge
                          color={
                            transaction.status === 'COMPLETED'
                              ? 'success'
                              : transaction.status === 'PENDING'
                                ? 'warning'
                                : 'error'
                          }
                        >
                          {transaction.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className='mt-4 flex justify-center'>
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </ComponentCard>

      {/* Issue Credit Modal */}
      <Modal isOpen={issueModal.isOpen} onClose={issueModal.closeModal} className='max-w-2xl'>
        <div className='p-6'>
          <h2 className='mb-6 text-xl font-semibold text-gray-800 dark:text-white'>
            Issue Manual Credit
          </h2>

          <div className='space-y-4'>
            <div>
              <Label>User *</Label>
              <select
                value={formData.userId}
                onChange={(e) => setFormData((prev) => ({ ...prev, userId: e.target.value }))}
                className='mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
              >
                <option value=''>Select a user</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.username} {user.email && `(${user.email})`}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label>Amount *</Label>
              <Input
                type='number'
                min={0}
                step={0.01}
                value={formData.amount || ''}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, amount: Number(e.target.value) }))
                }
                placeholder='Enter amount'
              />
            </div>

            <div>
              <Label>Reason *</Label>
              <Input
                value={formData.reason}
                onChange={(e) => setFormData((prev) => ({ ...prev, reason: e.target.value }))}
                placeholder='Enter reason for credit'
              />
            </div>

            <div>
              <Label>Tag *</Label>
              <select
                value={formData.tag}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    tag: e.target.value as 'bonus' | 'comp' | 'maintenance',
                  }))
                }
                className='mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
              >
                <option value='bonus'>Bonus</option>
                <option value='comp'>Comp</option>
                <option value='maintenance'>Maintenance</option>
              </select>
            </div>

            {formData.tag === 'bonus' && (
              <>
                <div>
                  <Label>Wagering Multiplier</Label>
                  <Input
                    type='number'
                    min={0}
                    value={formData.wageringMultiplier || ''}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        wageringMultiplier: Number(e.target.value),
                      }))
                    }
                    placeholder='e.g., 30 for 30x'
                  />
                </div>

                <div>
                  <Label>Expiry Date</Label>
                  <Input
                    type='datetime-local'
                    value={formData.expiryDate}
                    onChange={(e) => setFormData((prev) => ({ ...prev, expiryDate: e.target.value }))}
                  />
                </div>
              </>
            )}

            <div>
              <Label>Notes</Label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                rows={3}
                className='mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
                placeholder='Additional notes'
              />
            </div>
          </div>

          <div className='mt-6 flex justify-end gap-2'>
            <Button variant='outline' onClick={issueModal.closeModal}>
              Cancel
            </Button>
            <Button onClick={handleIssueCredit}>Issue Credit</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
