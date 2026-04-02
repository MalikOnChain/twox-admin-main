'use client'
import moment from 'moment'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { getRecentBigWins, IBigWin } from '@/api/metrics'

import { formatNumber } from '@/lib/utils'

import Loading from '@/components/common/Loading'
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default function RecentBigWinsTable() {
  const [bigWins, setBigWins] = useState<IBigWin[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBigWins = async () => {
      try {
        setLoading(true)
        // Fetch 5 items to display 3-5 items
        const result = await getRecentBigWins({ limit: 5, minWinAmount: 100 })
        const wins = result.data || []
        // Limit to 5 items max for display
        setBigWins(wins.slice(0, 5))
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message)
        } else {
          toast.error('Error fetching recent big wins')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchBigWins()
  }, [])

  if (loading) {
    return <Loading />
  }

  return (
    <div className='rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/[0.03]'>
      <div className='mb-4 flex items-center justify-between'>
        <h3 className='text-lg font-semibold text-gray-800 dark:text-white/90'>
          Recent Big Wins
        </h3>
        <Link
          href='/finance'
          className='text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400'
        >
          View All →
        </Link>
      </div>

      <div className='overflow-x-auto'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell
                isHeader
                className='text-theme-xs px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400'
              >
                Game
              </TableCell>
              <TableCell
                isHeader
                className='text-theme-xs px-4 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
              >
                Player
              </TableCell>
              <TableCell
                isHeader
                className='text-theme-xs px-4 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
              >
                Bet Amount
              </TableCell>
              <TableCell
                isHeader
                className='text-theme-xs px-4 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
              >
                Win Amount
              </TableCell>
              <TableCell
                isHeader
                className='text-theme-xs px-4 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
              >
                Profit
              </TableCell>
              <TableCell
                isHeader
                className='text-theme-xs px-4 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
              >
                Multiplier
              </TableCell>
              <TableCell
                isHeader
                className='text-theme-xs px-4 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
              >
                Time
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className='divide-y divide-gray-100 dark:divide-white/[0.05]'>
            {bigWins.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className='px-4 py-8 text-center text-gray-500 dark:text-gray-400'
                >
                  No big wins found
                </TableCell>
              </TableRow>
            ) : (
              bigWins.map((win) => (
                <TableRow key={win._id}>
                  <TableCell className='px-4 py-3 text-left'>
                    <div className='flex items-center gap-3'>
                      <Link
                        href={`/game-providers/blueocean/${win.providerCode}/${win.gameId}`}
                        className='flex items-center gap-3 hover:text-blue-500 dark:hover:text-blue-400'
                      >
                        <div className='flex h-10 w-10 items-center justify-center rounded bg-gray-100 dark:bg-gray-800'>
                          <span className='text-xs font-semibold text-gray-600 dark:text-gray-400'>
                            {win.gameName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className='flex flex-col'>
                          <span className='text-sm font-medium text-gray-800 dark:text-white/90'>
                            {win.gameName}
                          </span>
                          <span className='text-xs text-gray-500 dark:text-gray-400'>
                            {win.provider}
                          </span>
                        </div>
                      </Link>
                    </div>
                  </TableCell>
                  <TableCell className='px-4 py-3 text-center'>
                    <Link
                      href={`/profile/${win.userId}`}
                      className='text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400'
                    >
                      {win.username || 'Unknown'}
                    </Link>
                  </TableCell>
                  <TableCell className='px-4 py-3 text-center text-gray-500 dark:text-gray-400'>
                    ${formatNumber(win.betAmount)}
                  </TableCell>
                  <TableCell className='px-4 py-3 text-center font-semibold text-green-600 dark:text-green-400'>
                    ${formatNumber(win.winAmount)}
                  </TableCell>
                  <TableCell className='px-4 py-3 text-center font-semibold text-green-600 dark:text-green-400'>
                    ${formatNumber(win.profit)}
                  </TableCell>
                  <TableCell className='px-4 py-3 text-center'>
                    <span className='rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-400'>
                      {win.multiplier}x
                    </span>
                  </TableCell>
                  <TableCell className='px-4 py-3 text-center text-sm text-gray-500 dark:text-gray-400'>
                    {moment(win.createdAt).fromNow()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className='mt-6 flex flex-col gap-4 border-t border-gray-200 pt-4 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between'>
        <div className='flex flex-wrap items-center gap-2'>
          <span className='text-sm font-medium text-gray-600 dark:text-gray-400'>Quick Links:</span>
          <Link
            href='/finance'
            className='inline-flex items-center gap-1 rounded-md bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 hover:text-blue-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-blue-400'
          >
            Finance
            <span className='text-xs'>→</span>
          </Link>
          <Link
            href='/users'
            className='inline-flex items-center gap-1 rounded-md bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 hover:text-blue-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-blue-400'
          >
            Players
            <span className='text-xs'>→</span>
          </Link>
          <Link
            href='/game-providers/blueocean'
            className='inline-flex items-center gap-1 rounded-md bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 hover:text-blue-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-blue-400'
          >
            Games
            <span className='text-xs'>→</span>
          </Link>
          <Link
            href='/operating-providers'
            className='inline-flex items-center gap-1 rounded-md bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 hover:text-blue-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-blue-400'
          >
            Fees
            <span className='text-xs'>→</span>
          </Link>
        </div>
        <span className='text-sm text-gray-500 dark:text-gray-400'>
          Showing {bigWins.length} {bigWins.length === 1 ? 'win' : 'wins'}
        </span>
      </div>
    </div>
  )
}

