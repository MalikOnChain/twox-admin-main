'use client'
import moment from 'moment'

import { IPlayerProfile } from '@/api/user-management'
import { formatNumber } from '@/lib/utils'

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface ReferralsTabProps {
  referrals: IPlayerProfile['data']['referrals']
}

export default function ReferralsTab({ referrals }: ReferralsTabProps) {
  return (
    <div className='space-y-4'>
      <div>
        <h3 className='mb-2 text-sm font-medium text-gray-700 dark:text-gray-300'>
          Total Earnings: ${formatNumber(referrals.totalEarnings)}
        </h3>
        <p className='mb-4 text-sm text-gray-500 dark:text-gray-400'>
          Total Referrals: {referrals.referrals.length}
        </p>
      </div>
      <div className='overflow-x-auto'>
        <Table>
          <TableHeader>
            <TableRow className='text-white'>
              <TableCell isHeader>Username</TableCell>
              <TableCell isHeader>Email</TableCell>
              <TableCell isHeader>Joined</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {referrals.referrals.slice(0, 10).map((ref: any) => (
              <TableRow key={ref._id} className='text-gray-500 dark:text-gray-400'>
                <TableCell className='text-center'>{ref.username}</TableCell>
                <TableCell className='text-center'>{ref.email || 'N/A'}</TableCell>
                <TableCell className='text-center'>{moment(ref.createdAt).format('MMM DD, YYYY')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

