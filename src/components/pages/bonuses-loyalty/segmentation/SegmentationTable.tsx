'use client'

import Badge from '@/components/ui/badge/Badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatNumber, formatDate } from '@/lib/utils'
import { ISegmentationUser } from '@/api/bonus-segmentation'

interface SegmentationTableProps {
  users: ISegmentationUser[]
  loading: boolean
}

export default function SegmentationTable({ users, loading }: SegmentationTableProps) {
  return (
    <div className='mt-6 overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700'>
      <Table>
        <TableHeader>
          <TableRow className='bg-gray-50 dark:bg-gray-800/50'>
            <TableCell
              isHeader
              className='px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300'
            >
              Username
            </TableCell>
            <TableCell
              isHeader
              className='px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300'
            >
              Country
            </TableCell>
            <TableCell
              isHeader
              className='px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300'
            >
              VIP
            </TableCell>
            <TableCell
              isHeader
              className='px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300'
            >
              Risk
            </TableCell>
            <TableCell
              isHeader
              className='px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300'
            >
              Balance
            </TableCell>
            <TableCell
              isHeader
              className='px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300'
            >
              Deposit Freq
            </TableCell>
            <TableCell
              isHeader
              className='px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300'
            >
              Last Login
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
          ) : users.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className='px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400'
              >
                No users found
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow
                key={user._id}
                className='transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/30'
              >
                <TableCell className='px-4 py-3 text-left'>
                  <span className='font-medium text-gray-800 dark:text-white/90'>
                    {user.username}
                  </span>
                </TableCell>
                <TableCell className='px-4 py-3 text-left'>
                  <span className='text-sm text-gray-600 dark:text-gray-400'>{user.country}</span>
                </TableCell>
                <TableCell className='px-4 py-3 text-center'>
                  <Badge color={user.vip === 'None' ? 'primary' : 'success'}>{user.vip}</Badge>
                </TableCell>
                <TableCell className='px-4 py-3 text-center'>
                  <Badge
                    color={
                      user.risk === 'high'
                        ? 'error'
                        : user.risk === 'medium'
                          ? 'warning'
                          : 'success'
                    }
                  >
                    {user.risk}
                  </Badge>
                </TableCell>
                <TableCell className='px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-400'>
                  R$ {formatNumber(user.balance)}
                </TableCell>
                <TableCell className='px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-400'>
                  {user.depositFrequency}
                </TableCell>
                <TableCell className='px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-400'>
                  {user.lastLogin ? formatDate(user.lastLogin) : '-'}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

