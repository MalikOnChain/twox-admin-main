'use client'

import Badge from '@/components/ui/badge/Badge'
import Pagination from '@/components/tables/Pagination'
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatNumber, formatDate } from '@/lib/utils'
import { IMiniAffiliate } from '@/api/affiliate-management'

interface MiniAffiliatesTableProps {
  miniAffiliates: IMiniAffiliate[]
  loading: boolean
  pagination: {
    currentPage: number
    totalPages: number
  }
  onPageChange: (page: number) => void
}

export default function MiniAffiliatesTable({
  miniAffiliates,
  loading,
  pagination,
  onPageChange,
}: MiniAffiliatesTableProps) {
  return (
    <>
      <div className='mt-6 overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700'>
        <Table>
          <TableHeader>
            <TableRow className='bg-gray-50 dark:bg-gray-800/50'>
              <TableCell
                isHeader
                className='px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300'
              >
                Player
              </TableCell>
              <TableCell
                isHeader
                className='px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300'
              >
                Referral Code
              </TableCell>
              <TableCell
                isHeader
                className='px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300'
              >
                Status
              </TableCell>
              <TableCell
                isHeader
                className='px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300'
              >
                Commission Rate
              </TableCell>
              <TableCell
                isHeader
                className='px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300'
              >
                Total Referrals
              </TableCell>
              <TableCell
                isHeader
                className='px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300'
              >
                Total Earnings
              </TableCell>
              <TableCell
                isHeader
                className='px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300'
              >
                Total Paid
              </TableCell>
              <TableCell
                isHeader
                className='px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300'
              >
                Pending Payout
              </TableCell>
              <TableCell
                isHeader
                className='px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300'
              >
                Last Payout
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody className='divide-y divide-gray-100 dark:divide-white/[0.05]'>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className='px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400'
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : miniAffiliates.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className='px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400'
                >
                  No mini-affiliates found
                </TableCell>
              </TableRow>
            ) : (
              miniAffiliates.map((affiliate) => {
                const user =
                  typeof affiliate.userId === 'object'
                    ? affiliate.userId
                    : { _id: affiliate.userId, username: 'Unknown' }
                return (
                  <TableRow
                    key={affiliate._id}
                    className='transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/30'
                  >
                    <TableCell className='px-4 py-3 text-left'>
                      <div>
                        <div className='font-medium text-gray-800 dark:text-white/90'>{user.username}</div>
                        {user.email && (
                          <div className='text-xs text-gray-500 dark:text-gray-400'>{user.email}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className='px-4 py-3 text-center font-medium text-gray-600 dark:text-gray-400'>
                      {affiliate.referralCode}
                    </TableCell>
                    <TableCell className='px-4 py-3 text-center'>
                      <Badge
                        color={
                          affiliate.status === 'active'
                            ? 'success'
                            : affiliate.status === 'suspended'
                              ? 'error'
                              : 'warning'
                        }
                      >
                        {affiliate.status}
                      </Badge>
                    </TableCell>
                    <TableCell className='px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-400'>
                      {affiliate.commissionRate}%
                    </TableCell>
                    <TableCell className='px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-400'>
                      {affiliate.totalReferrals}
                    </TableCell>
                    <TableCell className='px-4 py-3 text-center text-sm font-semibold text-gray-800 dark:text-white/90'>
                      R$ {formatNumber(affiliate.totalEarnings)}
                    </TableCell>
                    <TableCell className='px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-400'>
                      R$ {formatNumber(affiliate.totalPaid)}
                    </TableCell>
                    <TableCell className='px-4 py-3 text-center text-sm font-semibold text-success-600 dark:text-success-400'>
                      R$ {formatNumber(affiliate.pendingPayout)}
                    </TableCell>
                    <TableCell className='px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-400'>
                      {affiliate.lastPayoutAt ? formatDate(affiliate.lastPayoutAt) : '-'}
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {pagination.totalPages > 1 && (
        <div className='mt-4 flex justify-center'>
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </>
  )
}

