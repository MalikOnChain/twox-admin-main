'use client'

import { useRouter } from 'next/navigation'
import { IGame, updateGameStatus } from '@/api/games-providers'
import { formatNumber } from '@/lib/utils'
import { toast } from 'sonner'

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import Badge from '@/components/ui/badge/Badge'
import Switch from '@/components/form/switch/Switch'

interface GamesTableProps {
  games: IGame[]
  onToggleStatus: (game: IGame) => Promise<void>
}

export default function GamesTable({ games, onToggleStatus }: GamesTableProps) {
  const router = useRouter()

  return (
    <div className='mt-6 overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700'>
      <Table>
        <TableHeader>
          <TableRow className='bg-gray-50 dark:bg-gray-800/50'>
            <TableCell isHeader className='px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300'>
              Name
            </TableCell>
            <TableCell isHeader className='px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300'>
              Provider
            </TableCell>
            <TableCell isHeader className='px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300'>
              RTP
            </TableCell>
            <TableCell isHeader className='px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300'>
              Bets 24h
            </TableCell>
            <TableCell isHeader className='px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300'>
              GGR
            </TableCell>
            <TableCell isHeader className='px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300'>
              Hold %
            </TableCell>
            <TableCell isHeader className='px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300'>
              Status
            </TableCell>
            <TableCell isHeader className='px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300'>
              Actions
            </TableCell>
          </TableRow>
        </TableHeader>
        <TableBody className='divide-y divide-gray-100 dark:divide-white/[0.05]'>
          {games.length > 0 ? (
            games.map((game) => (
              <TableRow
                key={game._id}
                className='cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/30'
                onClick={() => router.push(`/games-providers/games/${game.gameId || game._id}`)}
              >
                <TableCell className='px-4 py-3 text-left'>
                  <div className='flex items-center gap-3'>
                    {game.image && (
                      <img
                        src={game.image}
                        alt={game.name}
                        className='h-12 w-12 rounded-lg object-cover shadow-sm'
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    )}
                    <span className='font-medium text-gray-800 dark:text-white/90'>
                      {game.name}
                    </span>
                  </div>
                </TableCell>
                <TableCell className='px-4 py-3 text-left'>
                  <Badge size='sm' color='primary'>
                    {game.providerName}
                  </Badge>
                </TableCell>
                <TableCell className='px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-400'>
                  {game.rtp}%
                </TableCell>
                <TableCell className='px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-400'>
                  {formatNumber(game.bets24h)}
                </TableCell>
                <TableCell className='px-4 py-3 text-center text-sm font-semibold text-gray-800 dark:text-white/90'>
                  R$ {formatNumber(game.ggr)}
                </TableCell>
                <TableCell className='px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-400'>
                  {game.hold.toFixed(2)}%
                </TableCell>
                <TableCell className='px-4 py-3 text-center'>
                  <Badge
                    size='sm'
                    color={game.isEnabled && game.status === 'active' ? 'success' : 'dark'}
                  >
                    {game.isEnabled && game.status === 'active' ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell className='px-4 py-3 text-center' onClick={() => {}}>
                  <div className='flex items-center justify-center gap-2'>
                    <Switch
                      defaultChecked={game.isEnabled}
                      onChange={() => onToggleStatus(game)}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className='px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400'>
                No games found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

