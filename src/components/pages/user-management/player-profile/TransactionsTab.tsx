'use client'
import moment from 'moment'

import { IPlayerProfile } from '@/api/user-management'
import { formatNumber } from '@/lib/utils'

import Badge from '@/components/ui/badge/Badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface TransactionsTabProps {
  transactions: IPlayerProfile['data']['transactions']
}

export default function TransactionsTab({ transactions }: TransactionsTabProps) {
  return (
    <div className='space-y-4'>
      <h3 className='text-sm font-medium text-gray-700 dark:text-gray-300'>PIX Transactions</h3>
      <div className='overflow-x-auto'>
        <Table>
          <TableHeader>
            <TableRow className='text-white'>
              <TableCell isHeader>Type</TableCell>
              <TableCell isHeader>Amount</TableCell>
              <TableCell isHeader>Status</TableCell>
              <TableCell isHeader>Date</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.pix.slice(0, 10).map((tx: any) => (
              <TableRow key={tx._id} className='text-gray-500 dark:text-gray-400'>
                <TableCell className='text-center'>{tx.type}</TableCell>
                <TableCell className='text-center'>${formatNumber(tx.amount || 0)}</TableCell>
                <TableCell className='text-center'>
                  <Badge color={tx.status === 'PAID' ? 'success' : 'warning'} size='sm'>
                    {tx.status}
                  </Badge>
                </TableCell>
                <TableCell className='text-center'>{moment(tx.createdAt).format('MMM DD, YYYY HH:mm')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

