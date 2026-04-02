import React from 'react'

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { ICashbackTier } from '@/types/cashback'

interface ExpandedRowProps {
  tiers: ICashbackTier[]
}

export default function ExpandedRow({ tiers }: ExpandedRowProps) {
  return (
    <TableRow className='bg-black'>
      <TableCell colSpan={4}>
        <Table>
          <TableHeader className='border-b border-gray-100 dark:border-white/[0.05]'>
            <TableRow>
              <TableCell
                isHeader
                className='text-theme-xs px-5 py-3 text-left font-medium text-gray-500 dark:text-gray-400'
              >
                Tier Name
              </TableCell>
              <TableCell
                isHeader
                className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
              >
                Level Name
              </TableCell>
              <TableCell
                isHeader
                className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
              >
                Rate
              </TableCell>
              <TableCell
                isHeader
                className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
              >
                Cap Per Day
              </TableCell>
              <TableCell
                isHeader
                className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
              >
                Cap Per Week
              </TableCell>
              <TableCell
                isHeader
                className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
              >
                Cap Per Month
              </TableCell>
              <TableCell
                isHeader
                className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
              >
                Min Wagering
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody className='divide-y divide-gray-100 dark:divide-white/[0.05]'>
            {tiers.length > 0 ? (
              tiers.map((tier, index) => (
                <TableRow key={index}>
                  <TableCell className='bg-gray-50 px-5 py-4 text-black dark:bg-white/[0.02] dark:text-gray-400'>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>
                      {tier.tierName}
                    </p>
                  </TableCell>
                  <TableCell className='bg-gray-50 px-5 py-4 text-center text-black dark:bg-white/[0.02] dark:text-gray-400'>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>
                      {tier.tierLevel || ''}
                    </p>
                  </TableCell>
                  <TableCell className='bg-gray-50 px-5 py-4 text-center text-black dark:bg-white/[0.02] dark:text-gray-400'>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>
                      {tier.percentage}%
                    </p>
                  </TableCell>
                  <TableCell className='bg-gray-50 px-5 py-4 text-center text-black dark:bg-white/[0.02] dark:text-gray-400'>
                    {tier.cap.day}
                  </TableCell>
                  <TableCell className='bg-gray-50 px-5 py-4 text-center text-black dark:bg-white/[0.02] dark:text-gray-400'>
                    {tier.cap.week}
                  </TableCell>
                  <TableCell className='bg-gray-50 px-5 py-4 text-center text-black dark:bg-white/[0.02] dark:text-gray-400'>
                    {tier.cap.month}
                  </TableCell>
                  <TableCell className='bg-gray-50 px-5 py-4 text-center text-black dark:bg-white/[0.02] dark:text-gray-400'>
                    {tier.minWagering}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className='px-5 py-4 text-center'>
                  <p className='text-sm text-gray-500 dark:text-gray-400'>
                    No tiers found
                  </p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableCell>
    </TableRow>
  )
}
