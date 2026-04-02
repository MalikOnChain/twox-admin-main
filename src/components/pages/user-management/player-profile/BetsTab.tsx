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

interface BetsTabProps {
  bets: IPlayerProfile['data']['bets']
}

export default function BetsTab({ bets }: BetsTabProps) {
  return (
    <div className='space-y-4'>
      <div className='overflow-x-auto'>
        <Table>
          <TableHeader>
            <TableRow className='text-white'>
              <TableCell isHeader>Game</TableCell>
              <TableCell isHeader>Bet Amount</TableCell>
              <TableCell isHeader>Win Amount</TableCell>
              <TableCell isHeader>Date</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bets.slice(0, 10).map((bet: any) => (
              <TableRow key={bet._id} className='text-gray-500 dark:text-gray-400'>
                <TableCell>{bet.game?.name || 'Unknown'}</TableCell>
                <TableCell>${formatNumber(bet.betAmount || 0)}</TableCell>
                <TableCell>${formatNumber(bet.winAmount || 0)}</TableCell>
                <TableCell>{moment(bet.createdAt).format('MMM DD, YYYY HH:mm')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

