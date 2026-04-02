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
import { IDeal } from '@/api/affiliate-management'

interface DealsTableProps {
  deals: IDeal[]
  loading: boolean
  pagination: {
    currentPage: number
    totalPages: number
  }
  onPageChange: (page: number) => void
}

export default function DealsTable({ deals, loading, pagination, onPageChange }: DealsTableProps) {
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
                Name
              </TableCell>
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
                Deal Type
              </TableCell>
              <TableCell
                isHeader
                className='px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300'
              >
                Terms
              </TableCell>
              <TableCell
                isHeader
                className='px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300'
              >
                Valid From
              </TableCell>
              <TableCell
                isHeader
                className='px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300'
              >
                Valid To
              </TableCell>
              <TableCell
                isHeader
                className='px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300'
              >
                Status
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody className='divide-y divide-gray-100 dark:divide-white/[0.05]'>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className='px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400'
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : deals.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className='px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400'
                >
                  No deals found
                </TableCell>
              </TableRow>
            ) : (
              deals.map((deal) => {
                const partner =
                  typeof deal.partnerId === 'object' ? deal.partnerId : { _id: deal.partnerId, name: 'Unknown' }
                const termsText =
                  deal.dealType === 'revenue_share'
                    ? `${deal.terms.revenueShare?.rate || 0}%`
                    : deal.dealType === 'cpa'
                      ? `R$ ${formatNumber(deal.terms.cpa?.amount || 0)}`
                      : `Hybrid: ${deal.terms.hybrid?.revenueShareRate || 0}% / R$ ${formatNumber(deal.terms.hybrid?.cpaAmount || 0)}`
                return (
                  <TableRow
                    key={deal._id}
                    className='transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/30'
                  >
                    <TableCell className='px-4 py-3 text-left'>
                      <div>
                        <div className='font-medium text-gray-800 dark:text-white/90'>{deal.name}</div>
                        {deal.description && (
                          <div className='text-xs text-gray-500 dark:text-gray-400'>{deal.description}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className='px-4 py-3 text-left text-sm text-gray-600 dark:text-gray-400'>
                      {partner.name}
                    </TableCell>
                    <TableCell className='px-4 py-3 text-center'>
                      <Badge color='primary'>{deal.dealType}</Badge>
                    </TableCell>
                    <TableCell className='px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-400'>
                      {termsText}
                    </TableCell>
                    <TableCell className='px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-400'>
                      {formatDate(deal.validFrom)}
                    </TableCell>
                    <TableCell className='px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-400'>
                      {deal.validTo ? formatDate(deal.validTo) : 'No expiry'}
                    </TableCell>
                    <TableCell className='px-4 py-3 text-center'>
                      <Badge
                        color={
                          deal.status === 'active'
                            ? 'success'
                            : deal.status === 'expired'
                              ? 'error'
                              : 'warning'
                        }
                      >
                        {deal.status}
                      </Badge>
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

