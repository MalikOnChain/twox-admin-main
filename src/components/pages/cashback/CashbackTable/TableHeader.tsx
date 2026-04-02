import React from 'react'

import {
  TableCell,
  TableHeader as UITableHeader,
  TableRow,
} from '@/components/ui/table'

export default function TableHeader() {
  return (
    <UITableHeader className='border-b border-gray-100 dark:border-white/[0.05]'>
      <TableRow>
        <TableCell
          isHeader
          className='text-theme-xs px-5 py-3 text-left font-medium text-gray-500 dark:text-gray-400'
        >
          Name
        </TableCell>
        <TableCell
          isHeader
          className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
        >
          Type
        </TableCell>
        <TableCell
          isHeader
          className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
        >
          Status
        </TableCell>
        <TableCell
          isHeader
          className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
        >
          Actions
        </TableCell>
      </TableRow>
    </UITableHeader>
  )
}
