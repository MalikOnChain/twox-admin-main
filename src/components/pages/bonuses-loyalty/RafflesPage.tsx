'use client'

import { useState, useCallback, useEffect } from 'react'
import { toast } from 'sonner'
import dynamic from 'next/dynamic'

import {
  getRaffles,
  getTicketSales,
  getRaffleAnalytics,
  getWinners,
  createRaffle,
  updateRaffle,
  drawWinners,
  IRaffle,
  IRaffleTicket,
  IRaffleAnalytics,
} from '@/api/raffles'

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
import { PlusIcon, PencilIcon, TrashBinIcon } from '@/icons'
import { getTiers } from '@/api/tier'
import { ITierData } from '@/types/tier'

// Dynamically import charts to avoid SSR issues
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

type TabType = 'raffles' | 'tickets' | 'winners' | 'analytics'

export default function RafflesPage() {
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<TabType>('raffles')
  const [raffles, setRaffles] = useState<IRaffle[]>([])
  const [tickets, setTickets] = useState<IRaffleTicket[]>([])
  const [winners, setWinners] = useState<IRaffleTicket[]>([])
  const [analytics, setAnalytics] = useState<IRaffleAnalytics | null>(null)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 20,
  })
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    raffleId: '',
  })
  const [days, setDays] = useState(30)
  const [selectedRaffle, setSelectedRaffle] = useState<IRaffle | null>(null)
  const [vipTiers, setVipTiers] = useState<ITierData[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const raffleModal = useModal()

  const [formData, setFormData] = useState<Partial<IRaffle>>({
    name: '',
    description: '',
    type: 'free',
    ticketPrice: 0,
    maxTickets: undefined,
    maxTicketsPerUser: 1,
    startDate: '',
    endDate: '',
    drawDate: '',
    prizes: [],
    eligibility: {},
    brandCaps: {},
    status: 'draft',
  })

  const fetchRaffles = useCallback(async () => {
    try {
      setLoading(true)
      const response = await getRaffles({
        page: pagination.currentPage,
        limit: pagination.itemsPerPage,
        ...filters,
      })
      setRaffles(response.data)
      setPagination(response.pagination)
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message)
      }
    } finally {
      setLoading(false)
    }
  }, [pagination.currentPage, pagination.itemsPerPage, filters])

  const fetchTicketSales = useCallback(async () => {
    try {
      setLoading(true)
      const response = await getTicketSales({
        raffleId: filters.raffleId || undefined,
        page: pagination.currentPage,
        limit: pagination.itemsPerPage,
      })
      setTickets(response.data)
      setPagination(response.pagination)
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message)
      }
    } finally {
      setLoading(false)
    }
  }, [pagination.currentPage, pagination.itemsPerPage, filters.raffleId])

  const fetchWinners = useCallback(async () => {
    try {
      setLoading(true)
      const response = await getWinners({
        raffleId: filters.raffleId || undefined,
      })
      setWinners(response.data)
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message)
      }
    } finally {
      setLoading(false)
    }
  }, [filters.raffleId])

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true)
      const response = await getRaffleAnalytics({
        raffleId: filters.raffleId || undefined,
        days,
      })
      setAnalytics(response.data)
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message)
      }
    } finally {
      setLoading(false)
    }
  }, [filters.raffleId, days])

  const fetchVipTiers = useCallback(async () => {
    try {
      const response = await getTiers({ page: 1, limit: -1 })
      setVipTiers(response.rows || [])
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message)
      }
    }
  }, [])

  useEffect(() => {
    fetchVipTiers()
  }, [fetchVipTiers])

  useEffect(() => {
    if (selectedRaffle) {
      setFormData({
        name: selectedRaffle.name || '',
        description: selectedRaffle.description || '',
        type: selectedRaffle.type || 'free',
        ticketPrice: selectedRaffle.ticketPrice || 0,
        maxTickets: selectedRaffle.maxTickets,
        maxTicketsPerUser: selectedRaffle.maxTicketsPerUser || 1,
        startDate: selectedRaffle.startDate
          ? new Date(selectedRaffle.startDate).toISOString().slice(0, 16)
          : '',
        endDate: selectedRaffle.endDate
          ? new Date(selectedRaffle.endDate).toISOString().slice(0, 16)
          : '',
        drawDate: selectedRaffle.drawDate
          ? new Date(selectedRaffle.drawDate).toISOString().slice(0, 16)
          : '',
        prizes: selectedRaffle.prizes || [],
        eligibility: selectedRaffle.eligibility || {},
        brandCaps: selectedRaffle.brandCaps || {},
        status: selectedRaffle.status || 'draft',
      })
    } else {
      setFormData({
        name: '',
        description: '',
        type: 'free',
        ticketPrice: 0,
        maxTickets: undefined,
        maxTicketsPerUser: 1,
        startDate: '',
        endDate: '',
        drawDate: '',
        prizes: [],
        eligibility: {},
        brandCaps: {},
        status: 'draft',
      })
    }
  }, [selectedRaffle])

  useEffect(() => {
    if (activeTab === 'raffles') {
      fetchRaffles()
    } else if (activeTab === 'tickets') {
      fetchTicketSales()
    } else if (activeTab === 'winners') {
      fetchWinners()
    } else if (activeTab === 'analytics') {
      fetchAnalytics()
    }
  }, [activeTab, fetchRaffles, fetchTicketSales, fetchWinners, fetchAnalytics])

  const handleDrawWinners = async (raffleId: string) => {
    if (!confirm('Are you sure you want to draw winners for this raffle?')) {
      return
    }

    try {
      await drawWinners(raffleId)
      toast.success('Winners drawn successfully')
      fetchRaffles()
      fetchWinners()
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message)
      }
    }
  }

  const handleSubmitRaffle = async () => {
    try {
      if (!formData.name || !formData.startDate || !formData.endDate || !formData.drawDate) {
        toast.error('Please fill in all required fields')
        return
      }

      if (!formData.prizes || formData.prizes.length === 0) {
        toast.error('Please add at least one prize')
        return
      }

      setIsSubmitting(true)

      const submitData = {
        ...formData,
        startDate: new Date(formData.startDate!).toISOString(),
        endDate: new Date(formData.endDate!).toISOString(),
        drawDate: new Date(formData.drawDate!).toISOString(),
        ticketPrice: formData.type !== 'free' ? formData.ticketPrice : undefined,
        eligibility: Object.keys(formData.eligibility || {}).length > 0 ? formData.eligibility : undefined,
        brandCaps: Object.keys(formData.brandCaps || {}).length > 0 ? formData.brandCaps : undefined,
      }

      if (selectedRaffle) {
        await updateRaffle(selectedRaffle._id, submitData)
        toast.success('Raffle updated successfully')
      } else {
        await createRaffle(submitData)
        toast.success('Raffle created successfully')
      }

      raffleModal.closeModal()
      setSelectedRaffle(null)
      fetchRaffles()
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const addPrize = () => {
    setFormData((prev) => ({
      ...prev,
      prizes: [
        ...(prev.prizes || []),
        {
          position: (prev.prizes?.length || 0) + 1,
          type: 'cash',
          amount: 0,
          description: '',
        },
      ],
    }))
  }

  const removePrize = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      prizes: prev.prizes?.filter((_, i) => i !== index) || [],
    }))
  }

  const updatePrize = (index: number, field: string, value: any) => {
    setFormData((prev) => {
      const newPrizes = [...(prev.prizes || [])]
      newPrizes[index] = { ...newPrizes[index], [field]: value }
      return { ...prev, prizes: newPrizes }
    })
  }

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, currentPage: page }))
  }

  if (loading && activeTab === 'raffles' && raffles.length === 0) {
    return <Loading />
  }

  const dailySalesChartOptions = analytics?.dailySales && analytics.dailySales.length > 0
    ? {
        chart: { type: 'line' as const },
        xaxis: { categories: analytics.dailySales.map((d) => d.date) },
        series: [
          {
            name: 'Tickets',
            data: analytics.dailySales.map((d) => d.tickets),
          },
          {
            name: 'Revenue',
            data: analytics.dailySales.map((d) => d.revenue),
          },
        ],
      }
    : null

  const salesByTypeChartOptions = analytics?.salesByType && analytics.salesByType.length > 0
    ? {
        chart: { type: 'donut' as const },
        labels: analytics.salesByType.map((s) => s.type.toUpperCase()),
        series: analytics.salesByType.map((s) => s.tickets),
      }
    : null

  return (
    <div className='space-y-6'>
      <ComponentCard title='Raffles'>
        {/* Tabs */}
        <div className='mb-6 border-b border-gray-200 dark:border-gray-700'>
          <nav className='-mb-px flex space-x-8'>
            {[
              { id: 'raffles' as TabType, label: 'Raffles' },
              { id: 'tickets' as TabType, label: 'Ticket Sales' },
              { id: 'winners' as TabType, label: 'Winners' },
              { id: 'analytics' as TabType, label: 'Analytics' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium ${
                  activeTab === tab.id
                    ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Raffles Tab */}
        {activeTab === 'raffles' && (
          <div>
            <div className='mb-4 flex items-center justify-between'>
              <div className='flex gap-4'>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
                  className='rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
                >
                  <option value=''>All Statuses</option>
                  <option value='draft'>Draft</option>
                  <option value='active'>Active</option>
                  <option value='ended'>Ended</option>
                  <option value='drawn'>Drawn</option>
                  <option value='cancelled'>Cancelled</option>
                </select>
                <select
                  value={filters.type}
                  onChange={(e) => setFilters((prev) => ({ ...prev, type: e.target.value }))}
                  className='rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
                >
                  <option value=''>All Types</option>
                  <option value='paid'>Paid</option>
                  <option value='free'>Free</option>
                  <option value='hybrid'>Hybrid</option>
                </select>
              </div>
              <Button
                onClick={() => {
                  setSelectedRaffle(null)
                  raffleModal.openModal()
                }}
                size='xs'
              >
                <PlusIcon />
                Create Raffle
              </Button>
            </div>

            <div className='mt-6 overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700'>
              <Table>
                <TableHeader>
                  <TableRow className='bg-gray-50 dark:bg-gray-800/50'>
                    <TableCell isHeader className='px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300'>
                      Name
                    </TableCell>
                    <TableCell isHeader className='px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300'>
                      Type
                    </TableCell>
                    <TableCell isHeader className='px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300'>
                      Tickets Sold
                    </TableCell>
                    <TableCell isHeader className='px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300'>
                      Revenue
                    </TableCell>
                    <TableCell isHeader className='px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300'>
                      Draw Date
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
                      <TableCell colSpan={7} className='px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400'>
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : raffles.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className='px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400'>
                        No raffles found
                      </TableCell>
                    </TableRow>
                  ) : (
                    raffles.map((raffle) => (
                      <TableRow
                        key={raffle._id}
                        className='transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/30'
                      >
                        <TableCell className='px-4 py-3 text-left'>
                          <div>
                            <div className='font-medium text-gray-800 dark:text-white/90'>
                              {raffle.name}
                            </div>
                            {raffle.description && (
                              <div className='text-xs text-gray-500 dark:text-gray-400'>
                                {raffle.description}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className='px-4 py-3 text-center'>
                          <Badge
                            color={
                              raffle.type === 'paid'
                                ? 'primary'
                                : raffle.type === 'free'
                                  ? 'success'
                                  : 'warning'
                            }
                          >
                            {raffle.type}
                          </Badge>
                        </TableCell>
                        <TableCell className='px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-400'>
                          {formatNumber(raffle.totalTicketsSold || 0)}
                        </TableCell>
                        <TableCell className='px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-400'>
                          R$ {formatNumber(raffle.totalRevenue || 0)}
                        </TableCell>
                        <TableCell className='px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-400'>
                          {formatDate(raffle.drawDate)}
                        </TableCell>
                        <TableCell className='px-4 py-3 text-center'>
                          <Badge
                            color={
                              raffle.status === 'active'
                                ? 'success'
                                : raffle.status === 'drawn'
                                  ? 'primary'
                                  : raffle.status === 'ended'
                                    ? 'warning'
                                    : 'error'
                            }
                          >
                            {raffle.status}
                          </Badge>
                        </TableCell>
                        <TableCell className='px-4 py-3 text-center'>
                          <div className='flex items-center justify-center gap-2'>
                            {raffle.status === 'ended' && !raffle.winners?.length && (
                              <Button
                                size='xs'
                                variant='outline'
                                onClick={() => handleDrawWinners(raffle._id)}
                              >
                                Draw Winners
                              </Button>
                            )}
                            <button
                              onClick={() => {
                                setSelectedRaffle(raffle)
                                raffleModal.openModal()
                              }}
                              className='rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                            >
                              <PencilIcon className='h-4 w-4' />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {pagination.totalPages > 1 && (
              <div className='mt-4 flex justify-center'>
                <Pagination
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        )}

        {/* Ticket Sales Tab */}
        {activeTab === 'tickets' && (
          <div>
            <div className='mb-4 flex gap-4'>
              <select
                value={filters.raffleId}
                onChange={(e) => setFilters((prev) => ({ ...prev, raffleId: e.target.value }))}
                className='rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
              >
                <option value=''>All Raffles</option>
                {raffles.map((r) => (
                  <option key={r._id} value={r._id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            <div className='mt-6 overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700'>
              <Table>
                <TableHeader>
                  <TableRow className='bg-gray-50 dark:bg-gray-800/50'>
                    <TableCell isHeader className='px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300'>
                      Ticket Number
                    </TableCell>
                    <TableCell isHeader className='px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300'>
                      User
                    </TableCell>
                    <TableCell isHeader className='px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300'>
                      Raffle
                    </TableCell>
                    <TableCell isHeader className='px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300'>
                      Price
                    </TableCell>
                    <TableCell isHeader className='px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300'>
                      Purchase Date
                    </TableCell>
                    <TableCell isHeader className='px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300'>
                      Winner
                    </TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody className='divide-y divide-gray-100 dark:divide-white/[0.05]'>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className='px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400'>
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : tickets.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className='px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400'>
                        No tickets found
                      </TableCell>
                    </TableRow>
                  ) : (
                    tickets.map((ticket) => {
                      const user =
                        typeof ticket.userId === 'object'
                          ? ticket.userId
                          : { _id: ticket.userId, username: 'Unknown' }
                      const raffle =
                        typeof ticket.raffleId === 'object'
                          ? ticket.raffleId
                          : { _id: ticket.raffleId, name: 'Unknown' }
                      return (
                        <TableRow
                          key={ticket._id}
                          className='transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/30'
                        >
                          <TableCell className='px-4 py-3 text-left font-medium text-gray-800 dark:text-white/90'>
                            {ticket.ticketNumber}
                          </TableCell>
                          <TableCell className='px-4 py-3 text-left'>
                            <div>
                              <div className='text-sm text-gray-800 dark:text-white/90'>
                                {user.username}
                              </div>
                              {user.email && (
                                <div className='text-xs text-gray-500 dark:text-gray-400'>
                                  {user.email}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className='px-4 py-3 text-left text-sm text-gray-600 dark:text-gray-400'>
                            {raffle.name}
                          </TableCell>
                          <TableCell className='px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-400'>
                            {ticket.purchasePrice ? `R$ ${formatNumber(ticket.purchasePrice)}` : 'Free'}
                          </TableCell>
                          <TableCell className='px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-400'>
                            {formatDate(ticket.purchaseDate)}
                          </TableCell>
                          <TableCell className='px-4 py-3 text-center'>
                            {ticket.isWinner ? (
                              <Badge color='success'>
                                Winner ({ticket.prizePosition || 'N/A'})
                              </Badge>
                            ) : (
                              <span className='text-sm text-gray-500 dark:text-gray-400'>-</span>
                            )}
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </div>

            {pagination.totalPages > 1 && (
              <div className='mt-4 flex justify-center'>
                <Pagination
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        )}

        {/* Winners Tab */}
        {activeTab === 'winners' && (
          <div>
            <div className='mb-4 flex gap-4'>
              <select
                value={filters.raffleId}
                onChange={(e) => setFilters((prev) => ({ ...prev, raffleId: e.target.value }))}
                className='rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
              >
                <option value=''>All Raffles</option>
                {raffles.map((r) => (
                  <option key={r._id} value={r._id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            <div className='mt-6 overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700'>
              <Table>
                <TableHeader>
                  <TableRow className='bg-gray-50 dark:bg-gray-800/50'>
                    <TableCell isHeader className='px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300'>
                      Position
                    </TableCell>
                    <TableCell isHeader className='px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300'>
                      Winner
                    </TableCell>
                    <TableCell isHeader className='px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300'>
                      Ticket Number
                    </TableCell>
                    <TableCell isHeader className='px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300'>
                      Raffle
                    </TableCell>
                    <TableCell isHeader className='px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300'>
                      Prize
                    </TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody className='divide-y divide-gray-100 dark:divide-white/[0.05]'>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} className='px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400'>
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : winners.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className='px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400'>
                        No winners found
                      </TableCell>
                    </TableRow>
                  ) : (
                    winners
                      .sort((a, b) => (a.prizePosition || 0) - (b.prizePosition || 0))
                      .map((ticket) => {
                        const user =
                          typeof ticket.userId === 'object'
                            ? ticket.userId
                            : { _id: ticket.userId, username: 'Unknown' }
                        const raffle =
                          typeof ticket.raffleId === 'object'
                            ? ticket.raffleId
                            : { _id: ticket.raffleId, name: 'Unknown' }
                        const raffleWithPrizes = raffle && 'prizes' in raffle ? raffle : null
                        const prize = raffleWithPrizes && Array.isArray(raffleWithPrizes.prizes)
                          ? raffleWithPrizes.prizes.find((p: any) => p.position === ticket.prizePosition)
                          : null
                        return (
                          <TableRow
                            key={ticket._id}
                            className='transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/30'
                          >
                            <TableCell className='px-4 py-3 text-left font-medium text-gray-800 dark:text-white/90'>
                              {ticket.prizePosition || 'N/A'}
                            </TableCell>
                            <TableCell className='px-4 py-3 text-left'>
                              <div>
                                <div className='text-sm font-medium text-gray-800 dark:text-white/90'>
                                  {user.username}
                                </div>
                                {user.email && (
                                  <div className='text-xs text-gray-500 dark:text-gray-400'>
                                    {user.email}
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className='px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400'>
                              {ticket.ticketNumber}
                            </TableCell>
                            <TableCell className='px-4 py-3 text-left text-sm text-gray-600 dark:text-gray-400'>
                              {raffle.name}
                            </TableCell>
                            <TableCell className='px-4 py-3 text-center'>
                              {prize ? (
                                <Badge color='success'>
                                  {prize.type === 'cash' ? 'R$' : prize.type === 'bonus' ? 'Bonus' : 'Free Spins'}{' '}
                                  {formatNumber(prize.amount)}
                                </Badge>
                              ) : (
                                <span className='text-sm text-gray-500 dark:text-gray-400'>-</span>
                              )}
                            </TableCell>
                          </TableRow>
                        )
                      })
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div>
            <div className='mb-4 flex items-center gap-4'>
              <select
                value={filters.raffleId}
                onChange={(e) => setFilters((prev) => ({ ...prev, raffleId: e.target.value }))}
                className='rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
              >
                <option value=''>All Raffles</option>
                {raffles.map((r) => (
                  <option key={r._id} value={r._id}>
                    {r.name}
                  </option>
                ))}
              </select>
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

            {analytics && (
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                {dailySalesChartOptions && (
                  <div className='rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-white/[0.03]'>
                    <h4 className='mb-4 text-sm font-semibold text-gray-800 dark:text-white'>
                      Daily Ticket Sales & Revenue
                    </h4>
                    <Chart
                      options={dailySalesChartOptions}
                      series={dailySalesChartOptions.series}
                      type='line'
                      height={300}
                    />
                  </div>
                )}

                {salesByTypeChartOptions && (
                  <div className='rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-white/[0.03]'>
                    <h4 className='mb-4 text-sm font-semibold text-gray-800 dark:text-white'>
                      Sales by Raffle Type
                    </h4>
                    <Chart
                      options={salesByTypeChartOptions}
                      series={salesByTypeChartOptions.series}
                      type='donut'
                      height={300}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </ComponentCard>

      {/* Raffle Modal */}
      <Modal isOpen={raffleModal.isOpen} onClose={raffleModal.closeModal} className='max-w-4xl'>
        <div className='p-6'>
          <h2 className='mb-6 text-xl font-semibold text-gray-800 dark:text-white'>
            {selectedRaffle ? 'Edit Raffle' : 'Create Raffle'}
          </h2>

          <div className='max-h-[70vh] space-y-6 overflow-y-auto'>
            {/* Basic Information */}
            <div className='space-y-4'>
              <h3 className='text-lg font-medium text-gray-800 dark:text-white'>Basic Information</h3>
              <div>
                <Label>Name *</Label>
                <Input
                  value={formData.name || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder='Enter raffle name'
                />
              </div>
              <div>
                <Label>Description</Label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className='mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
                  placeholder='Enter description'
                />
              </div>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <div>
                  <Label>Type *</Label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        type: e.target.value as 'paid' | 'free' | 'hybrid',
                      }))
                    }
                    className='mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
                  >
                    <option value='free'>Free</option>
                    <option value='paid'>Paid</option>
                    <option value='hybrid'>Hybrid</option>
                  </select>
                </div>
                <div>
                  <Label>Status</Label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        status: e.target.value as 'draft' | 'active' | 'ended' | 'drawn' | 'cancelled',
                      }))
                    }
                    className='mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
                  >
                    <option value='draft'>Draft</option>
                    <option value='active'>Active</option>
                    <option value='ended'>Ended</option>
                    <option value='drawn'>Drawn</option>
                    <option value='cancelled'>Cancelled</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Ticket Configuration */}
            <div className='space-y-4'>
              <h3 className='text-lg font-medium text-gray-800 dark:text-white'>Ticket Configuration</h3>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                {(formData.type === 'paid' || formData.type === 'hybrid') && (
                  <div>
                    <Label>Ticket Price *</Label>
                    <Input
                      type='number'
                      min={0}
                      step={0.01}
                      value={formData.ticketPrice || ''}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, ticketPrice: Number(e.target.value) }))
                      }
                      placeholder='Enter ticket price'
                    />
                  </div>
                )}
                <div>
                  <Label>Max Tickets (Optional)</Label>
                  <Input
                    type='number'
                    min={1}
                    value={formData.maxTickets || ''}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        maxTickets: e.target.value ? Number(e.target.value) : undefined,
                      }))
                    }
                    placeholder='No limit'
                  />
                </div>
                <div>
                  <Label>Max Tickets Per User</Label>
                  <Input
                    type='number'
                    min={1}
                    value={formData.maxTicketsPerUser || 1}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, maxTicketsPerUser: Number(e.target.value) }))
                    }
                  />
                </div>
              </div>
            </div>

            {/* Period */}
            <div className='space-y-4'>
              <h3 className='text-lg font-medium text-gray-800 dark:text-white'>Period</h3>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                <div>
                  <Label>Start Date *</Label>
                  <Input
                    type='datetime-local'
                    value={formData.startDate || ''}
                    onChange={(e) => setFormData((prev) => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>End Date *</Label>
                  <Input
                    type='datetime-local'
                    value={formData.endDate || ''}
                    onChange={(e) => setFormData((prev) => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>Draw Date *</Label>
                  <Input
                    type='datetime-local'
                    value={formData.drawDate || ''}
                    onChange={(e) => setFormData((prev) => ({ ...prev, drawDate: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            {/* Prizes */}
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <h3 className='text-lg font-medium text-gray-800 dark:text-white'>Prizes *</h3>
                <Button size='xs' onClick={addPrize}>
                  <PlusIcon />
                  Add Prize
                </Button>
              </div>
              {formData.prizes && formData.prizes.length > 0 ? (
                <div className='space-y-3'>
                  {formData.prizes.map((prize, index) => (
                    <div
                      key={index}
                      className='rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-white/[0.03]'
                    >
                      <div className='mb-3 flex items-center justify-between'>
                        <span className='font-medium text-gray-800 dark:text-white'>
                          Prize #{prize.position}
                        </span>
                        <button
                          onClick={() => removePrize(index)}
                          className='text-red-500 hover:text-red-700'
                        >
                          <TrashBinIcon className='h-4 w-4' />
                        </button>
                      </div>
                      <div className='grid grid-cols-1 gap-3 md:grid-cols-4'>
                        <div>
                          <Label>Position</Label>
                          <Input
                            type='number'
                            min={1}
                            value={prize.position}
                            onChange={(e) => updatePrize(index, 'position', Number(e.target.value))}
                          />
                        </div>
                        <div>
                          <Label>Type</Label>
                          <select
                            value={prize.type}
                            onChange={(e) =>
                              updatePrize(index, 'type', e.target.value as 'cash' | 'bonus' | 'free_spins')
                            }
                            className='mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
                          >
                            <option value='cash'>Cash</option>
                            <option value='bonus'>Bonus</option>
                            <option value='free_spins'>Free Spins</option>
                          </select>
                        </div>
                        <div>
                          <Label>Amount</Label>
                          <Input
                            type='number'
                            min={0}
                            step={0.01}
                            value={prize.amount}
                            onChange={(e) => updatePrize(index, 'amount', Number(e.target.value))}
                          />
                        </div>
                        <div>
                          <Label>Description</Label>
                          <Input
                            value={prize.description || ''}
                            onChange={(e) => updatePrize(index, 'description', e.target.value)}
                            placeholder='Optional'
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className='text-sm text-gray-500 dark:text-gray-400'>
                  No prizes added. Click "Add Prize" to add prizes.
                </p>
              )}
            </div>

            {/* Eligibility */}
            <div className='space-y-4'>
              <h3 className='text-lg font-medium text-gray-800 dark:text-white'>Eligibility (Optional)</h3>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <div>
                  <Label>Min Deposit</Label>
                  <Input
                    type='number'
                    min={0}
                    value={formData.eligibility?.minDeposit || ''}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        eligibility: {
                          ...prev.eligibility,
                          minDeposit: e.target.value ? Number(e.target.value) : undefined,
                        },
                      }))
                    }
                    placeholder='Optional'
                  />
                </div>
                <div>
                  <Label>Min Wager</Label>
                  <Input
                    type='number'
                    min={0}
                    value={formData.eligibility?.minWager || ''}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        eligibility: {
                          ...prev.eligibility,
                          minWager: e.target.value ? Number(e.target.value) : undefined,
                        },
                      }))
                    }
                    placeholder='Optional'
                  />
                </div>
                <div>
                  <Label>VIP Tiers</Label>
                  <select
                    multiple
                    value={
                      formData.eligibility?.vipTiers?.map((t) => (typeof t === 'string' ? t : t)) || []
                    }
                    onChange={(e) => {
                      const selected = Array.from(e.target.selectedOptions, (option) => option.value)
                      setFormData((prev) => ({
                        ...prev,
                        eligibility: {
                          ...prev.eligibility,
                          vipTiers: selected,
                        },
                      }))
                    }}
                    className='mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
                  >
                    {vipTiers.map((tier) => (
                      <option key={tier._id} value={tier._id}>
                        {tier.name}
                      </option>
                    ))}
                  </select>
                  <p className='mt-1 text-xs text-gray-500 dark:text-gray-400'>
                    Hold Ctrl/Cmd to select multiple
                  </p>
                </div>
                <div>
                  <Label>Countries (comma-separated)</Label>
                  <Input
                    value={formData.eligibility?.countries?.join(', ') || ''}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        eligibility: {
                          ...prev.eligibility,
                          countries: e.target.value
                            ? e.target.value.split(',').map((c) => c.trim())
                            : undefined,
                        },
                      }))
                    }
                    placeholder='BR, US, UK'
                  />
                </div>
              </div>
            </div>

            {/* Brand-Level Caps */}
            <div className='space-y-4'>
              <h3 className='text-lg font-medium text-gray-800 dark:text-white'>
                Brand-Level Caps (Optional)
              </h3>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                <div>
                  <Label>Max Total Prizes</Label>
                  <Input
                    type='number'
                    min={0}
                    value={formData.brandCaps?.maxTotalPrizes || ''}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        brandCaps: {
                          ...prev.brandCaps,
                          maxTotalPrizes: e.target.value ? Number(e.target.value) : undefined,
                        },
                      }))
                    }
                    placeholder='Optional'
                  />
                </div>
                <div>
                  <Label>Max Daily Prizes</Label>
                  <Input
                    type='number'
                    min={0}
                    value={formData.brandCaps?.maxDailyPrizes || ''}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        brandCaps: {
                          ...prev.brandCaps,
                          maxDailyPrizes: e.target.value ? Number(e.target.value) : undefined,
                        },
                      }))
                    }
                    placeholder='Optional'
                  />
                </div>
                <div>
                  <Label>Max Weekly Prizes</Label>
                  <Input
                    type='number'
                    min={0}
                    value={formData.brandCaps?.maxWeeklyPrizes || ''}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        brandCaps: {
                          ...prev.brandCaps,
                          maxWeeklyPrizes: e.target.value ? Number(e.target.value) : undefined,
                        },
                      }))
                    }
                    placeholder='Optional'
                  />
                </div>
              </div>
            </div>
          </div>

          <div className='mt-6 flex justify-end gap-2 border-t border-gray-200 p-6 dark:border-gray-700'>
            <Button variant='outline' onClick={raffleModal.closeModal} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleSubmitRaffle} disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : selectedRaffle ? 'Update' : 'Create'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
