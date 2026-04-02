'use client'

import { formatNumber } from '@/lib/utils'
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import Badge from '@/components/ui/badge/Badge'

interface FeeBreakdownTableProps {
  breakdown: Array<{
    method: string
    currency: string
    txCount: number
    volume: number
    fees: number
    feePercent: number
  }>
}

const formatCurrency = (amount: number) => `$${formatNumber(amount)}`

export default function FeeBreakdownTable({ breakdown }: FeeBreakdownTableProps) {
  return (
    <div className='mt-6'>
      <h3 className='mb-4 text-lg font-semibold text-gray-800 dark:text-white/90'>
        Fee Breakdown
      </h3>
      <div className='overflow-x-auto'>
        <Table>
          <TableHeader>
            <TableRow className='text-white'>
              <TableCell isHeader>Method</TableCell>
              <TableCell isHeader>Currency</TableCell>
              <TableCell isHeader>Tx Count</TableCell>
              <TableCell isHeader>Volume</TableCell>
              <TableCell isHeader>Fees</TableCell>
              <TableCell isHeader>Fee %</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {breakdown.length > 0 ? (
              breakdown.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className='text-center'>
                    <Badge size='sm' color='primary'>
                      {item.method}
                    </Badge>
                  </TableCell>
                  <TableCell className='text-center'>
                    <Badge size='sm' color='info'>
                      {item.currency}
                    </Badge>
                  </TableCell>
                  <TableCell className='text-center text-gray-500 dark:text-gray-400'>
                    {formatNumber(item.txCount)}
                  </TableCell>
                  <TableCell className='text-center text-gray-500 dark:text-gray-400'>
                    {formatCurrency(item.volume)}
                  </TableCell>
                  <TableCell className='text-center font-semibold text-gray-800 dark:text-white/90'>
                    {formatCurrency(item.fees)}
                  </TableCell>
                  <TableCell className='text-center text-gray-500 dark:text-gray-400'>
                    {item.feePercent.toFixed(2)}%
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className='text-center text-gray-500 dark:text-gray-400'>
                  No data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

