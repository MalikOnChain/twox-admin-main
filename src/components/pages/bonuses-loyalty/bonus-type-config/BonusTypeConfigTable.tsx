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
import { formatDate } from '@/lib/utils'
import { Bonus } from '@/types/bonus'
import { PencilIcon, CopyIcon, EyeIcon, TrashBinIcon } from '@/icons'

interface BonusTypeConfigTableProps {
  bonuses: Bonus[]
  totalPages: number
  page: number
  setPage: (page: number) => void
  onEdit: (bonus: Bonus) => void
  onDuplicate: (bonus: Bonus) => void
  onDisable: (bonus: Bonus) => void
  onArchive: (bonus: Bonus) => void
}

export default function BonusTypeConfigTable({
  bonuses,
  totalPages,
  page,
  setPage,
  onEdit,
  onDuplicate,
  onDisable,
  onArchive,
}: BonusTypeConfigTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success'
      case 'draft':
        return 'warning'
      case 'expired':
        return 'info'
      case 'cancelled':
        return 'error'
      default:
        return 'info'
    }
  }

  return (
    <div>
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
                Type
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
                Claims
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
            {bonuses.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className='px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400'
                >
                  No bonus types found
                </TableCell>
              </TableRow>
            ) : (
              bonuses.map((bonus) => (
                <TableRow
                  key={bonus._id}
                  className='transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/30'
                >
                  <TableCell className='px-4 py-3 text-left'>
                    <div>
                      <div className='font-medium text-gray-800 dark:text-white/90'>
                        {bonus.name}
                      </div>
                      {bonus.description && (
                        <div className='text-xs text-gray-500 dark:text-gray-400'>
                          {bonus.description}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className='px-4 py-3 text-center'>
                    <Badge color='primary'>{bonus.type || 'N/A'}</Badge>
                  </TableCell>
                  <TableCell className='px-4 py-3 text-center'>
                    <Badge color={getStatusColor(bonus.status || 'draft')}>
                      {bonus.status || 'draft'}
                    </Badge>
                  </TableCell>
                  <TableCell className='px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-400'>
                    {bonus.validFrom ? formatDate(bonus.validFrom) : '-'}
                  </TableCell>
                  <TableCell className='px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-400'>
                    {bonus.validTo ? formatDate(bonus.validTo) : '-'}
                  </TableCell>
                  <TableCell className='px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-400'>
                    {bonus.claimsCount || 0}
                  </TableCell>
                  <TableCell className='px-4 py-3 text-center'>
                    <div className='flex items-center justify-center gap-2'>
                      <button
                        onClick={() => onEdit(bonus)}
                        title='Edit'
                        className='rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                      >
                        <PencilIcon className='h-5 w-5' />
                      </button>
                      <button
                        onClick={() => onDuplicate(bonus)}
                        title='Duplicate'
                        className='rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                      >
                        <CopyIcon className='h-5 w-5' />
                      </button>
                      <button
                        onClick={() => onDisable(bonus)}
                        title={bonus.status === 'active' ? 'Disable' : 'Enable'}
                        className='rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                      >
                        <EyeIcon className='h-5 w-5' />
                      </button>
                      <button
                        onClick={() => onArchive(bonus)}
                        title='Archive'
                        className='rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                      >
                        <TrashBinIcon className='h-5 w-5' />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className='mt-4 flex justify-center'>
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}
    </div>
  )
}
