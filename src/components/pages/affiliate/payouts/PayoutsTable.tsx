'use client'

import Button from '@/components/ui/button/Button'
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
import { IPayout } from '@/api/affiliate-management'

interface PayoutsTableProps {
  payouts: IPayout[]
  loading: boolean
  pagination: {
    currentPage: number
    totalPages: number
  }
  onPageChange: (page: number) => void
  onOverride: (payout: IPayout) => void
}

export default function PayoutsTable({
  payouts,
  loading,
  pagination,
  onPageChange,
  onOverride,
}: PayoutsTableProps) {
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
                Partner
              </TableCell>
              <TableCell
                isHeader
                className='px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300'
              >
                Period
              </TableCell>
              <TableCell
                isHeader
                className='px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300'
              >
                Amount
              </TableCell>
              <TableCell
                isHeader
                className='px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300'
              >
                FTDs
              </TableCell>
              <TableCell
                isHeader
                className='px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300'
              >
                NGR
              </TableCell>
              <TableCell
                isHeader
                className='px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300'
              >
                ROI
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
                Actions
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody className='divide-y divide-gray-100 dark:divide-white/[0.05]'>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className='px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400'
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : payouts.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className='px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400'
                >
                  No payouts found
                </TableCell>
              </TableRow>
            ) : (
              payouts.map((payout) => {
                const partner =
                  typeof payout.partnerId === 'object'
                    ? payout.partnerId
                    : { _id: payout.partnerId, name: 'Unknown' }
                return (
                  <TableRow
                    key={payout._id}
                    className='transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/30'
                  >
                    <TableCell className='px-4 py-3 text-left'>
                      <div className='font-medium text-gray-800 dark:text-white/90'>{partner.name}</div>
                    </TableCell>
                    <TableCell className='px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-400'>
                      {formatDate(payout.period.start)} - {formatDate(payout.period.end)}
                    </TableCell>
                    <TableCell className='px-4 py-3 text-center text-sm font-semibold text-gray-800 dark:text-white/90'>
                      R$ {formatNumber(payout.amount)}
                    </TableCell>
                    <TableCell className='px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-400'>
                      {payout.metrics.ftds}
                    </TableCell>
                    <TableCell className='px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-400'>
                      R$ {formatNumber(payout.metrics.totalNGR)}
                    </TableCell>
                    <TableCell className='px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-400'>
                      {payout.metrics.roi ? `${payout.metrics.roi.toFixed(2)}%` : '-'}
                    </TableCell>
                    <TableCell className='px-4 py-3 text-center'>
                      <Badge
                        color={
                          payout.status === 'paid'
                            ? 'success'
                            : payout.status === 'approved'
                              ? 'primary'
                              : payout.status === 'cancelled'
                                ? 'error'
                                : 'warning'
                        }
                      >
                        {payout.status}
                      </Badge>
                    </TableCell>
                    <TableCell className='px-4 py-3 text-center'>
                      <Button size='xs' variant='outline' onClick={() => onOverride(payout)}>
                        Override
                      </Button>
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

