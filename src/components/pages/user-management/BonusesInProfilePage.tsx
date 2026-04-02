'use client'
import { useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

import {
  getBonusesInProfile,
  IBonusInProfile,
} from '@/api/user-management'

import Loading from '@/components/common/Loading'
import Pagination from '@/components/tables/Pagination'
import UserAvatar from '@/components/ui/avatar/UserAvatar'

import BonusesTable from './bonuses-in-profile/BonusesTable'

export default function BonusesInProfilePage() {
  const searchParams = useSearchParams()
  const userId = searchParams.get('userId') || ''
  const [loading, setLoading] = useState(true)
  const [bonuses, setBonuses] = useState<IBonusInProfile[]>([])
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState<{
    totalItems: number
    totalPages: number
    currentPage: number
    pageSize: number
  } | null>(null)
  const [primaryUser, setPrimaryUser] = useState<{
    _id: string
    username?: string
    email?: string
    avatar?: string
  } | null>(null)

  useEffect(() => {
    setPage(1)
  }, [userId, statusFilter])

  const fetchBonuses = useCallback(async () => {
    try {
      setLoading(true)
      const response = await getBonusesInProfile({
        userId: userId || undefined,
        status: statusFilter || undefined,
        page: userId ? undefined : page,
      })
      setBonuses(response.data)
      setPagination(response.pagination ?? null)

      const resolvedUser =
        response.user ??
        response.data.find((bonus) => bonus.user)?.user ??
        (userId ? { _id: userId } : null)

      setPrimaryUser(resolvedUser ?? null)
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Error fetching bonuses')
      }
    } finally {
      setLoading(false)
    }
  }, [userId, statusFilter, page])

  useEffect(() => {
    fetchBonuses()
  }, [fetchBonuses])

  const handleForfeit = (bonusId: string) => {
    toast.info(`Forfeit bonus ${bonusId} - functionality to be implemented`)
  }

  const handleExtend = (bonusId: string) => {
    toast.info(`Extend bonus ${bonusId} - functionality to be implemented`)
  }

  const handleConvert = (bonusId: string) => {
    toast.info(`Convert bonus ${bonusId} - functionality to be implemented`)
  }

  return (
    <div className='space-y-6'>
      <div className='rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/[0.03]'>
        <div className='mb-4 flex items-center justify-between'>
          <h2 className='text-xl font-semibold text-gray-800 dark:text-white/90'>
            Bonuses in Profile
          </h2>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className='rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
          >
            <option value=''>All Status</option>
            <option value='active'>Active</option>
            <option value='expired'>Expired</option>
            <option value='completed'>Completed</option>
          </select>
        </div>

        {loading ? (
          <Loading />
        ) : (
          <>
            <div className='mb-4 rounded-lg border border-gray-100 p-4 dark:border-white/[0.05]'>
              {primaryUser ? (
                <div className='flex items-center gap-3'>
                  <UserAvatar
                    size='medium'
                    src={primaryUser.avatar || '/images/default-avatar.png'}
                    alt={primaryUser.username || primaryUser._id || 'User'}
                  />
                  <div>
                    <p className='text-base font-semibold text-gray-800 dark:text-white/90'>
                      {primaryUser.username || 'User'}
                    </p>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>
                      {primaryUser.email || primaryUser._id}
                    </p>
                  </div>
                </div>
              ) : (
                <p className='text-sm text-gray-500 dark:text-gray-400'>
                  Showing bonus balances across all users. Use filters to narrow down to specific
                  player cohorts.
                </p>
              )}
            </div>
            <BonusesTable
              bonuses={bonuses}
              primaryUser={primaryUser ?? undefined}
              onForfeit={handleForfeit}
              onExtend={handleExtend}
              onConvert={handleConvert}
            />
            {!userId && pagination && pagination.totalPages > 1 && (
              <div className='mt-4 border-t border-gray-100 pt-4 dark:border-white/[0.05] flex justify-center'>
                <Pagination
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  onPageChange={setPage}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

