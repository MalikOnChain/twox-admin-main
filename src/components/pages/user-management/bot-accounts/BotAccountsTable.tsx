'use client'
import { toast } from 'sonner'

import { IBotAccount } from '@/api/user-management'
import { formatNumber } from '@/lib/utils'

import Pagination from '@/components/tables/Pagination'
import UserAvatar from '@/components/ui/avatar/UserAvatar'
import Badge from '@/components/ui/badge/Badge'
import Button from '@/components/ui/button/Button'
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface BotAccountsTableProps {
  bots: IBotAccount[]
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function BotAccountsTable({
  bots,
  currentPage,
  totalPages,
  onPageChange,
}: BotAccountsTableProps) {
  return (
    <>
      <div className='mb-6 overflow-x-auto'>
        <Table>
          <TableHeader>
            <TableRow className='text-white'>
              <TableCell isHeader>Bot</TableCell>
              <TableCell isHeader>Rank</TableCell>
              <TableCell isHeader>Wager</TableCell>
              <TableCell isHeader>Bet Range</TableCell>
              <TableCell isHeader>Multiplier Range</TableCell>
              <TableCell isHeader>Stats</TableCell>
              <TableCell isHeader>Actions</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bots.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className='text-center text-gray-500 dark:text-gray-400'>
                  No bot accounts found
                </TableCell>
              </TableRow>
            ) : (
              bots.map((bot) => (
                <TableRow key={bot._id}>
                  <TableCell className='text-center'>
                    <div className='flex items-center gap-2'>
                      <UserAvatar
                        src={bot.avatar || '/images/default-avatar.png'}
                        alt={bot.username}
                        size='small'
                      />
                      <div>
                        <p className='font-medium text-gray-800 dark:text-white/90'>{bot.username}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className='text-center'>
                    <Badge color='info' size='sm'>
                      {bot.rank}
                    </Badge>
                  </TableCell>
                  <TableCell className='font-semibold text-gray-800 dark:text-white/90 text-center'>
                    ${formatNumber(bot.wager)}
                  </TableCell>
                  <TableCell className='text-center'>
                    <p className='text-xs text-gray-600 dark:text-gray-400'>
                      ${bot.minBet} - ${bot.maxBet}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p className='text-xs text-gray-600 dark:text-gray-400 text-center'>
                      {bot.minMultiplier}x - {bot.maxMultiplier}x
                    </p>
                  </TableCell>
                  <TableCell>
                    <div className='space-y-1'>
                      <p className='text-xs text-gray-500 dark:text-gray-400'>Bets: {bot.stats.bets}</p>
                      <p className='text-xs text-gray-500 dark:text-gray-400'>
                        Transactions: {bot.stats.transactions}
                      </p>
                      <p className='text-xs font-semibold text-gray-800 dark:text-white/90'>
                        Balance: ${formatNumber(bot.stats.balance)}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className='flex gap-2 justify-center items-center'>
                      <Button
                        size='sm'
                        variant='outline'
                        onClick={() => toast.info('Activate/Pause functionality to be implemented')}
                      >
                        {bot.status === 'active' ? 'Pause' : 'Activate'}
                      </Button>
                      <Button
                        size='sm'
                        variant='outline'
                        onClick={() => toast.info('Inject/Retrieve funds functionality to be implemented')}
                      >
                        Funds
                      </Button>
                      <Button
                        size='sm'
                        variant='outline'
                        onClick={() => toast.info('View bot log functionality to be implemented')}
                      >
                        View Log
                      </Button>
                      <Button
                        size='sm'
                        variant='outline'
                        onClick={() => toast.info('Export functionality to be implemented')}
                      >
                        Export
                      </Button>
                      <Button
                        size='sm'
                        variant='outline'
                        className='text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300'
                        onClick={() => toast.info('Delete functionality to be implemented')}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className='flex justify-center border-t border-gray-100 p-4 dark:border-white/[0.05]'>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
        </div>
      )}
    </>
  )
}

