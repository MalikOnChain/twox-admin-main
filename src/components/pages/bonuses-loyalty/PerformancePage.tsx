'use client'

import { useState, useCallback, useEffect } from 'react'
import { toast } from 'sonner'
import dynamic from 'next/dynamic'

import {
  getRedemptionTrend,
  getROIByType,
  getLiabilityVsSettled,
  getPlayerPerformance,
  adjustBonus,
  IRedemptionTrend,
  IROIByType,
  ILiabilityVsSettled,
  IPlayerPerformance,
} from '@/api/bonus-performance'

import ComponentCard from '@/components/common/ComponentCard'
import Loading from '@/components/common/Loading'
import Button from '@/components/ui/button/Button'
import Badge from '@/components/ui/badge/Badge'
import Input from '@/components/form/input/InputField'
import Label from '@/components/form/Label'
import Pagination from '@/components/tables/Pagination'
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Modal } from '@/components/ui/modal'
import { formatNumber, formatDate } from '@/lib/utils'
import { useModal } from '@/hooks/useModal'

// Dynamically import charts to avoid SSR issues
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

export default function PerformancePage() {
  const [loading, setLoading] = useState(true)
  const [redemptionTrend, setRedemptionTrend] = useState<IRedemptionTrend[]>([])
  const [roiByType, setRoiByType] = useState<IROIByType[]>([])
  const [liabilityData, setLiabilityData] = useState<ILiabilityVsSettled | null>(null)
  const [players, setPlayers] = useState<IPlayerPerformance[]>([])
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 50,
  })
  const [filters, setFilters] = useState({
    search: '',
    bonusType: '',
    status: '',
  })
  const [days, setDays] = useState(30)
  const [selectedPlayer, setSelectedPlayer] = useState<IPlayerPerformance | null>(null)
  const adjustModal = useModal()

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const [trendRes, roiRes, liabilityRes, playersRes] = await Promise.allSettled([
        getRedemptionTrend({ days }),
        getROIByType({ days }),
        getLiabilityVsSettled(),
        getPlayerPerformance({
          page: pagination.currentPage,
          limit: pagination.itemsPerPage,
          ...filters,
        }),
      ])

      if (trendRes.status === 'fulfilled') {
        setRedemptionTrend(trendRes.value.data)
      }
      if (roiRes.status === 'fulfilled') {
        setRoiByType(roiRes.value.data)
      }
      if (liabilityRes.status === 'fulfilled') {
        setLiabilityData(liabilityRes.value.data)
      }
      if (playersRes.status === 'fulfilled') {
        setPlayers(playersRes.value.data)
        setPagination(playersRes.value.pagination)
      }
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message)
      }
    } finally {
      setLoading(false)
    }
  }, [days, pagination.currentPage, pagination.itemsPerPage, filters])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, currentPage: page }))
  }

  const handleAdjust = async (action: 'forfeit' | 'convert' | 'extend', amount?: number) => {
    if (!selectedPlayer) return

    try {
      await adjustBonus(selectedPlayer._id, { action, amount })
      toast.success(`Bonus ${action} successful`)
      adjustModal.closeModal()
      setSelectedPlayer(null)
      fetchData()
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message)
      }
    }
  }

  if (loading && !liabilityData) {
    return <Loading />
  }

  const redemptionTrendOptions = redemptionTrend.length > 0
    ? {
        chart: { type: 'line' as const },
        xaxis: { categories: redemptionTrend.map((r) => r.date) },
        series: [
          {
            name: 'Redemptions',
            data: redemptionTrend.map((r) => r.count),
          },
          {
            name: 'Amount',
            data: redemptionTrend.map((r) => r.amount),
          },
        ],
      }
    : null

  const roiChartOptions = roiByType.length > 0
    ? {
        chart: { type: 'bar' as const },
        xaxis: { categories: roiByType.map((r) => r.type) },
        series: [
          {
            name: 'ROI %',
            data: roiByType.map((r) => r.roi),
          },
        ],
      }
    : null

  return (
    <div className='space-y-6'>
      <ComponentCard title='Performance & Liability'>
        {/* Days Selector */}
        <div className='mb-6 flex items-center gap-4'>
          <Label>Time Period</Label>
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className='rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
            <option value={180}>Last 180 days</option>
          </select>
        </div>

        {/* Liability vs Settled Cards */}
        {liabilityData && (
          <div className='mb-6 grid grid-cols-1 gap-4 md:grid-cols-4'>
            <div className='rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-white/[0.03]'>
              <div className='text-sm text-gray-500 dark:text-gray-400'>Active Liability</div>
              <div className='mt-1 text-2xl font-semibold text-gray-800 dark:text-white'>
                R$ {formatNumber(liabilityData.liability.active)}
              </div>
              <div className='mt-1 text-xs text-gray-500 dark:text-gray-400'>
                {liabilityData.liability.count} bonuses
              </div>
            </div>
            <div className='rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-white/[0.03]'>
              <div className='text-sm text-gray-500 dark:text-gray-400'>Locked Winnings</div>
              <div className='mt-1 text-2xl font-semibold text-gray-800 dark:text-white'>
                R$ {formatNumber(liabilityData.liability.lockedWinnings)}
              </div>
            </div>
            <div className='rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-white/[0.03]'>
              <div className='text-sm text-gray-500 dark:text-gray-400'>Total Settled</div>
              <div className='mt-1 text-2xl font-semibold text-gray-800 dark:text-white'>
                R$ {formatNumber(liabilityData.settled.total)}
              </div>
              <div className='mt-1 text-xs text-gray-500 dark:text-gray-400'>
                {liabilityData.settled.count} bonuses
              </div>
            </div>
            <div className='rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-white/[0.03]'>
              <div className='text-sm text-gray-500 dark:text-gray-400'>Net Settled</div>
              <div className='mt-1 text-2xl font-semibold text-gray-800 dark:text-white'>
                R$ {formatNumber(liabilityData.settled.net)}
              </div>
              <div className='mt-1 text-xs text-gray-500 dark:text-gray-400'>
                Forfeited: R$ {formatNumber(liabilityData.settled.forfeited)}
              </div>
            </div>
          </div>
        )}

        {/* Charts */}
        <div className='mb-6 grid grid-cols-1 gap-4 md:grid-cols-2'>
          {redemptionTrendOptions && (
            <div className='rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-white/[0.03]'>
              <h4 className='mb-4 text-sm font-semibold text-gray-800 dark:text-white'>
                Redemption Trend
              </h4>
              <Chart
                options={redemptionTrendOptions}
                series={redemptionTrendOptions.series}
                type='line'
                height={300}
              />
            </div>
          )}

          {roiChartOptions && (
            <div className='rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-white/[0.03]'>
              <h4 className='mb-4 text-sm font-semibold text-gray-800 dark:text-white'>
                ROI by Bonus Type
              </h4>
              <Chart
                options={roiChartOptions}
                series={roiChartOptions.series}
                type='bar'
                height={300}
              />
            </div>
          )}
        </div>

        {/* ROI Table */}
        {roiByType.length > 0 && (
          <div className='mb-6 overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700'>
            <Table>
              <TableHeader>
                <TableRow className='bg-gray-50 dark:bg-gray-800/50'>
                  <TableCell isHeader className='px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300'>
                    Bonus Type
                  </TableCell>
                  <TableCell isHeader className='px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300'>
                    Cost
                  </TableCell>
                  <TableCell isHeader className='px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300'>
                    GGR
                  </TableCell>
                  <TableCell isHeader className='px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300'>
                    ROI %
                  </TableCell>
                  <TableCell isHeader className='px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300'>
                    Count
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody className='divide-y divide-gray-100 dark:divide-white/[0.05]'>
                {roiByType.map((roi, idx) => (
                  <TableRow key={idx} className='transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/30'>
                    <TableCell className='px-4 py-3 text-left'>
                      <span className='font-medium text-gray-800 dark:text-white/90'>{roi.type}</span>
                    </TableCell>
                    <TableCell className='px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-400'>
                      R$ {formatNumber(roi.cost)}
                    </TableCell>
                    <TableCell className='px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-400'>
                      R$ {formatNumber(roi.ggr)}
                    </TableCell>
                    <TableCell className='px-4 py-3 text-center'>
                      <Badge color={roi.roi >= 0 ? 'success' : 'error'}>
                        {roi.roi.toFixed(2)}%
                      </Badge>
                    </TableCell>
                    <TableCell className='px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-400'>
                      {roi.count}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Filters */}
        <div className='mb-6 flex gap-4'>
          <div className='flex-1'>
            <Label>Search</Label>
            <Input
              value={filters.search}
              onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
              placeholder='Search by username, email, or bonus name'
            />
          </div>
          <div>
            <Label>Bonus Type</Label>
            <select
              value={filters.bonusType}
              onChange={(e) => setFilters((prev) => ({ ...prev, bonusType: e.target.value }))}
              className='mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
            >
              <option value=''>All Types</option>
              <option value='welcome'>Welcome</option>
              <option value='deposit'>Deposit</option>
              <option value='recurring'>Recurring</option>
            </select>
          </div>
          <div>
            <Label>Status</Label>
            <select
              value={filters.status}
              onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
              className='mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
            >
              <option value=''>All Statuses</option>
              <option value='active'>Active</option>
              <option value='completed'>Completed</option>
              <option value='expired'>Expired</option>
              <option value='forfeited'>Forfeited</option>
            </select>
          </div>
        </div>

        {/* Player Performance Table */}
        <div className='mt-6 overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700'>
          <Table>
            <TableHeader>
              <TableRow className='bg-gray-50 dark:bg-gray-800/50'>
                <TableCell isHeader className='px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300'>
                  Player
                </TableCell>
                <TableCell isHeader className='px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300'>
                  Bonus
                </TableCell>
                <TableCell isHeader className='px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300'>
                  Initial Amount
                </TableCell>
                <TableCell isHeader className='px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300'>
                  Balance
                </TableCell>
                <TableCell isHeader className='px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300'>
                  Wagering %
                </TableCell>
                <TableCell isHeader className='px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300'>
                  GGR
                </TableCell>
                <TableCell isHeader className='px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300'>
                  ROI %
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
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} className='px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400'>
                    Loading...
                  </TableCell>
                </TableRow>
              ) : players.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className='px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400'>
                    No player performance data found
                  </TableCell>
                </TableRow>
              ) : (
                players.map((player) => (
                  <TableRow
                    key={player._id}
                    className='transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/30'
                  >
                    <TableCell className='px-4 py-3 text-left'>
                      <div>
                        <div className='font-medium text-gray-800 dark:text-white/90'>
                          {player.username}
                        </div>
                        {player.email && (
                          <div className='text-xs text-gray-500 dark:text-gray-400'>{player.email}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className='px-4 py-3 text-left'>
                      <span className='text-sm text-gray-600 dark:text-gray-400'>{player.bonusName}</span>
                    </TableCell>
                    <TableCell className='px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-400'>
                      R$ {formatNumber(player.initialAmount)}
                    </TableCell>
                    <TableCell className='px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-400'>
                      R$ {formatNumber(player.bonusBalance)}
                    </TableCell>
                    <TableCell className='px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-400'>
                      {player.wageringProgress.toFixed(1)}%
                    </TableCell>
                    <TableCell className='px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-400'>
                      R$ {formatNumber(player.ggr)}
                    </TableCell>
                    <TableCell className='px-4 py-3 text-center'>
                      <Badge color={player.roi >= 0 ? 'success' : 'error'}>
                        {player.roi.toFixed(2)}%
                      </Badge>
                    </TableCell>
                    <TableCell className='px-4 py-3 text-center'>
                      <Badge
                        color={
                          player.status === 'active'
                            ? 'success'
                            : player.status === 'completed'
                              ? 'primary'
                              : 'error'
                        }
                      >
                        {player.status}
                      </Badge>
                    </TableCell>
                    <TableCell className='px-4 py-3 text-center'>
                      <div className='flex items-center justify-center gap-2'>
                        <Button
                          size='xs'
                          variant='outline'
                          onClick={() => {
                            setSelectedPlayer(player)
                            adjustModal.openModal()
                          }}
                        >
                          Actions
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className='mt-4 flex justify-center'>
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </ComponentCard>

      {/* Adjust Bonus Modal */}
      <Modal isOpen={adjustModal.isOpen} onClose={adjustModal.closeModal} className='max-w-md'>
        <div className='p-6'>
          <h2 className='mb-4 text-xl font-semibold text-gray-800 dark:text-white'>
            Adjust Bonus
          </h2>
          {selectedPlayer && (
            <div className='space-y-4'>
              <div>
                <Label>Player</Label>
                <div className='text-sm text-gray-600 dark:text-gray-400'>
                  {selectedPlayer.username}
                </div>
              </div>
              <div>
                <Label>Bonus</Label>
                <div className='text-sm text-gray-600 dark:text-gray-400'>
                  {selectedPlayer.bonusName}
                </div>
              </div>
              <div>
                <Label>Current Balance</Label>
                <div className='text-sm text-gray-600 dark:text-gray-400'>
                  R$ {formatNumber(selectedPlayer.bonusBalance)}
                </div>
              </div>
              <div className='flex gap-2 pt-4'>
                <Button
                  variant='outline'
                  onClick={() => handleAdjust('forfeit')}
                  className='flex-1'
                >
                  Forfeit
                </Button>
                <Button
                  variant='outline'
                  onClick={() => {
                    const amount = prompt('Enter amount to convert:')
                    if (amount) handleAdjust('convert', Number(amount))
                  }}
                  className='flex-1'
                >
                  Convert
                </Button>
                <Button
                  variant='outline'
                  onClick={() => handleAdjust('extend')}
                  className='flex-1'
                >
                  Extend
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  )
}
