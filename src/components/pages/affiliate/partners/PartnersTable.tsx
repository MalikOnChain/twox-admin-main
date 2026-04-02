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
import { formatDate } from '@/lib/utils'
import { IPartner } from '@/api/affiliate-management'

interface PartnersTableProps {
  partners: IPartner[]
  loading: boolean
  pagination: {
    currentPage: number
    totalPages: number
  }
  syncing: string | null
  onPageChange: (page: number) => void
  onViewDetails: (partner: IPartner) => void
  onSync: (partnerId: string) => void
}

export default function PartnersTable({
  partners,
  loading,
  pagination,
  syncing,
  onPageChange,
  onViewDetails,
  onSync,
}: PartnersTableProps) {
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
                className='px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300'
              >
                Code
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
                Deal Type
              </TableCell>
              <TableCell
                isHeader
                className='px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300'
              >
                Last Sync
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
                  colSpan={7}
                  className='px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400'
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : partners.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className='px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400'
                >
                  No partners found
                </TableCell>
              </TableRow>
            ) : (
              partners.map((partner) => (
                <TableRow
                  key={partner._id}
                  className='transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/30'
                >
                  <TableCell className='px-4 py-3 text-left'>
                    <div>
                      <div className='font-medium text-gray-800 dark:text-white/90'>{partner.name}</div>
                      {partner.contactEmail && (
                        <div className='text-xs text-gray-500 dark:text-gray-400'>{partner.contactEmail}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className='px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-400'>
                    {partner.code}
                  </TableCell>
                  <TableCell className='px-4 py-3 text-center'>
                    <Badge
                      color={
                        partner.status === 'active'
                          ? 'success'
                          : partner.status === 'suspended'
                            ? 'error'
                            : 'warning'
                      }
                    >
                      {partner.status}
                    </Badge>
                  </TableCell>
                  <TableCell className='px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-400'>
                    {partner.commissionRate}%
                  </TableCell>
                  <TableCell className='px-4 py-3 text-center'>
                    <Badge color='primary'>{partner.dealType}</Badge>
                  </TableCell>
                  <TableCell className='px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-400'>
                    {partner.lastSyncAt ? formatDate(partner.lastSyncAt) : '-'}
                  </TableCell>
                  <TableCell className='px-4 py-3 text-center'>
                    <div className='flex items-center justify-center gap-2'>
                      <Button size='xs' variant='outline' onClick={() => onViewDetails(partner)}>
                        View Details
                      </Button>
                      {partner.affeliosId && (
                        <Button
                          size='xs'
                          variant='outline'
                          onClick={() => onSync(partner._id)}
                          disabled={syncing === partner._id}
                        >
                          {syncing === partner._id ? 'Syncing...' : 'Sync'}
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
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

