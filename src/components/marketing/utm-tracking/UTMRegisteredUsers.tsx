'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

import { getUTMRegisteredUsers } from '@/api/utm-tracking'

import UTMRegisteredUsers from '@/components/tables/UTMRegisteredUsers'

import { GetUTMTrackingFilter, UTMUser } from '@/types/utm-track'

const UTMRegisteredUsersList = ({
  filter,
  reloadRef,
}: {
  filter: GetUTMTrackingFilter
  reloadRef: React.MutableRefObject<() => void>
}) => {
  const [utmRegisteredUsers, setUtmRegisteredUsers] = useState<UTMUser[]>([])
  const [totalPages, setTotalPages] = useState<number>(0)
  const [isLoadingTx, setIsLoadingTx] = useState<boolean>(true)
  const [page, setPage] = useState<number>(1)
  const [limit] = useState<number>(5)

  const fetchUTMRegisteredUsers = useCallback(
    async (page: number, limit: number) => {
      try {
        setIsLoadingTx(true)
        const response = await getUTMRegisteredUsers({
          page,
          limit,
          filter,
        })
        setUtmRegisteredUsers(response.rows)
        setTotalPages(response.pagination.totalPages)
        setPage(response.pagination.currentPage)
      } catch (error) {
        if (error instanceof Error) {
          console.error('error', error.message)
          toast.error(error.message)
        } else {
          toast.error('Error fetching FTD summary')
        }
      } finally {
        setIsLoadingTx(false)
      }
    },
    [filter]
  )

  const handleChangePage = (page: number) => {
    setPage(page)
    fetchUTMRegisteredUsers(page, limit)
  }

  useEffect(() => {
    fetchUTMRegisteredUsers(page, limit)
  }, [filter, page, limit, fetchUTMRegisteredUsers])

  useEffect(() => {
    reloadRef.current = () => fetchUTMRegisteredUsers(page, limit)
  }, [fetchUTMRegisteredUsers, reloadRef, page, limit])

  return (
    <div className='space-y-6 rounded-2xl border border-gray-200 bg-white px-5 pt-5 pb-5 sm:px-6 sm:pt-6 dark:border-gray-800 dark:bg-white/[0.03]'>
      <div className='flex flex-col gap-5 sm:flex-row sm:justify-between'>
        <div className='w-full'>
          <h3 className='text-lg font-semibold text-gray-800 dark:text-white/90'>
            UTM Registered Users
          </h3>
        </div>
      </div>
      <UTMRegisteredUsers
        totalPages={totalPages}
        rows={utmRegisteredUsers}
        page={page}
        setPage={handleChangePage}
        isLoading={isLoadingTx}
      />
    </div>
  )
}

export default UTMRegisteredUsersList
