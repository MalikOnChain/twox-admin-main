'use client'

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

interface BonusesTabProps {
  bonuses: IPlayerProfile['data']['bonuses']
}

export default function BonusesTab({ bonuses }: BonusesTabProps) {
  return (
    <div className='space-y-4'>
      <div className='overflow-x-auto'>
        <Table>
          <TableHeader>
            <TableRow className='text-white'>
              <TableCell isHeader>Bonus</TableCell>
              <TableCell isHeader>Balance</TableCell>
              <TableCell isHeader>Progress</TableCell>
              <TableCell isHeader>Status</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bonuses.slice(0, 10).map((bonus: any) => (
              <TableRow key={bonus._id} className='text-gray-500 dark:text-gray-400'>
                <TableCell>{bonus.bonusId?.name || 'N/A'}</TableCell>
                <TableCell>${formatNumber(bonus.bonusBalance || 0)}</TableCell>
                <TableCell>{bonus.wageringProgress?.toFixed(1) || 0}%</TableCell>
                <TableCell>
                  <Badge color={bonus.status === 'active' ? 'success' : 'primary'} size='sm'>
                    {bonus.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

