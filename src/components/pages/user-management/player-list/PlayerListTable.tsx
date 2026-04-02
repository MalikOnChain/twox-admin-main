'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

import { IPlayer } from '@/api/user-management'
import { formatNumber } from '@/lib/utils'

import Pagination from '@/components/tables/Pagination'
import UserAvatar from '@/components/ui/avatar/UserAvatar'
import Badge from '@/components/ui/badge/Badge'
import { Dropdown } from '@/components/ui/dropdown/Dropdown'
import { DropdownItem } from '@/components/ui/dropdown/DropdownItem'
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { MoreDotIcon } from '@/icons'

interface PlayerListTableProps {
  players: IPlayer[]
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function PlayerListTable({
  players,
  currentPage,
  totalPages,
  onPageChange,
}: PlayerListTableProps) {
  const router = useRouter()
  const [openActionDropdown, setOpenActionDropdown] = useState<string | null>(null)

  const toggleActionDropdown = (playerId: string) => {
    setOpenActionDropdown(openActionDropdown === playerId ? null : playerId)
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high':
        return 'error'
      case 'medium':
        return 'warning'
      case 'low':
        return 'success'
      default:
        return 'primary'
    }
  }

  const getStatusColor = (player: IPlayer) => {
    if (player.isBanned) return 'error'
    if (player.lock_bet || player.lock_transaction) return 'warning'
    return 'success'
  }

  return (
    <div className='overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]'>
      <div className='max-w-full overflow-x-auto'>
        <div className='min-w-[1400px]'>
          <Table>
            <TableHeader className='border-b border-gray-100 dark:border-white/[0.05]'>
              <TableRow>
                <TableCell
                  isHeader
                  className='text-theme-xs px-4 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                >
                  Player ID
                </TableCell>
                <TableCell
                  isHeader
                  className='text-theme-xs px-4 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                >
                  Username
                </TableCell>
                <TableCell
                  isHeader
                  className='text-theme-xs px-4 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                >
                  Country
                </TableCell>
                <TableCell
                  isHeader
                  className='text-theme-xs px-4 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                >
                  Cash
                </TableCell>
                <TableCell
                  isHeader
                  className='text-theme-xs px-4 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                >
                  Bonus
                </TableCell>
                <TableCell
                  isHeader
                  className='text-theme-xs px-4 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                >
                  KYC Tier
                </TableCell>
                <TableCell
                  isHeader
                  className='text-theme-xs px-4 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                >
                  VIP
                </TableCell>
                <TableCell
                  isHeader
                  className='text-theme-xs px-4 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                >
                  Risk
                </TableCell>
                <TableCell
                  isHeader
                  className='text-theme-xs px-4 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                >
                  Status
                </TableCell>
                <TableCell
                  isHeader
                  className='text-theme-xs px-4 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                >
                  Last Login
                </TableCell>
                <TableCell
                  isHeader
                  className='text-theme-xs px-4 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className='divide-y divide-gray-100 dark:divide-white/[0.05]'>
              {players.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={11}
                    className='px-4 py-8 text-center text-gray-500 dark:text-gray-400'
                  >
                    No players found
                  </TableCell>
                </TableRow>
              ) : (
                players.map((player) => (
                  <TableRow
                    key={player._id}
                    className='cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50'
                    onClick={() => router.push(`/user-management/player-profile/${player._id}`)}
                  >
                    <TableCell className='px-4 py-3 text-center text-sm text-gray-500 dark:text-gray-400'>
                      {player._id}
                    </TableCell>
                    <TableCell className='px-4 py-3 text-center'>
                      <div className='flex items-center justify-start gap-2'>
                        <UserAvatar
                          src={player.avatar || '/images/default-avatar.png'}
                          alt={player.username}
                          size='small'
                        />
                        <span className='font-medium text-gray-800 dark:text-white/90'>
                          {player.username}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className='px-4 py-3 text-center text-sm text-gray-500 dark:text-gray-400'>
                      {player.country || 'N/A'}
                    </TableCell>
                    <TableCell className='px-4 py-3 text-center text-sm font-semibold text-gray-800 dark:text-white/90'>
                      ${formatNumber(player.cash)}
                    </TableCell>
                    <TableCell className='px-4 py-3 text-center text-sm font-semibold text-green-600 dark:text-green-400'>
                      ${formatNumber(player.bonus)}
                    </TableCell>
                    <TableCell className='px-4 py-3 text-center'>
                      <Badge
                        color={player.kycTier === 'completed' ? 'success' : 'warning'}
                        size='sm'
                      >
                        {player.kycTier || 'Pending'}
                      </Badge>
                    </TableCell>
                    <TableCell className='px-4 py-3 text-center'>
                      <Badge color='info' size='sm'>
                        {player.vip || 'None'}
                      </Badge>
                    </TableCell>
                    <TableCell className='px-4 py-3 text-center'>
                      <Badge color={getRiskColor(player.risk)} size='sm'>
                        {player.risk}
                      </Badge>
                    </TableCell>
                    <TableCell className='px-4 py-3 text-center'>
                      <Badge color={getStatusColor(player)} size='sm'>
                        {player.isBanned
                          ? 'Banned'
                          : player.lock_bet || player.lock_transaction
                            ? 'Frozen'
                            : 'Active'}
                      </Badge>
                    </TableCell>
                    <TableCell className='px-4 py-3 text-center text-xs text-gray-500 dark:text-gray-400'>
                      {player.lastLogin
                        ? new Date(player.lastLogin).toLocaleDateString()
                        : 'Never'}
                    </TableCell>
                    <TableCell className='px-4 py-3 text-center'>
                      <div className='relative'>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleActionDropdown(player._id)
                          }}
                          className='flex items-center justify-center'
                        >
                          <MoreDotIcon className='dark:text-gray-400' />
                        </button>
                        {openActionDropdown === player._id && (
                          <Dropdown
                            isOpen={openActionDropdown === player._id}
                            onClose={() => setOpenActionDropdown(null)}
                          >
                            <DropdownItem
                              onClick={() => {
                                router.push(`/user-management/player-profile/${player._id}`)
                                setOpenActionDropdown(null)
                              }}
                            >
                              View
                            </DropdownItem>
                            <DropdownItem
                              onClick={() => {
                                toast.info('Freeze/Ban functionality to be implemented')
                                setOpenActionDropdown(null)
                              }}
                            >
                              {player.isBanned ? 'Unban' : 'Freeze/Ban'}
                            </DropdownItem>
                            <DropdownItem
                              onClick={() => {
                                toast.info('Credit/Debit functionality to be implemented')
                                setOpenActionDropdown(null)
                              }}
                            >
                              Credit/Debit
                            </DropdownItem>
                            <DropdownItem
                              onClick={() => {
                                toast.info('Reset PW/2FA functionality to be implemented')
                                setOpenActionDropdown(null)
                              }}
                            >
                              Reset PW/2FA
                            </DropdownItem>
                            <DropdownItem
                              onClick={() => {
                                toast.info('Message functionality to be implemented')
                                setOpenActionDropdown(null)
                              }}
                            >
                              Message
                            </DropdownItem>
                          </Dropdown>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      {totalPages > 1 && (
        <div className='flex justify-center border-t border-gray-100 p-4 dark:border-white/[0.05]'>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  )
}

