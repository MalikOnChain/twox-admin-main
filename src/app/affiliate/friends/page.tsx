'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

import { getFriends } from '@/api/affiliate'

import ComponentCard from '@/components/common/ComponentCard'
import Loading from '@/components/common/Loading'
import FriendTable from '@/components/pages/friends/list'

import { IUser } from '@/types/affiliate'

const FriendsManagementPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [page, setPage] = useState<number>(1)
  const [limit] = useState<number>(10)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [friends, setFriends] = useState<IUser[]>([])

  const fetchFriends = useCallback(async () => {
    try {
      const response = await getFriends({
        page,
        limit,
      })
      setTotalPages(response.pagination.totalPages)
      setPage(response.pagination.currentPage)
      setFriends(response.rows)
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Error fetching friends')
      }
    }
  }, [page, limit])

  const initialLoading = useCallback(async () => {
    await fetchFriends()
    setIsLoading(false)
  }, [fetchFriends])

  useEffect(() => {
    initialLoading()
  }, [initialLoading])

  if (isLoading) {
    return <Loading />
  }

  return (
    <ComponentCard title='Friends management'>
      <FriendTable
        friends={friends}
        totalPages={totalPages}
        page={page}
        setPage={setPage}
        isLoading={isLoading}
      />
    </ComponentCard>
  )
}

export default FriendsManagementPage
