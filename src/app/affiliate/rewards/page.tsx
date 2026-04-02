'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

import { getRewards } from '@/api/affiliate'

import ComponentCard from '@/components/common/ComponentCard'
import Loading from '@/components/common/Loading'
import RewardTable from '@/components/pages/rewards/list'

import { IReward } from '@/types/affiliate'

const RewardsManagementPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [page, setPage] = useState<number>(1)
  const [limit] = useState<number>(10)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [rewards, setRewards] = useState<IReward[]>([])

  const fetchRewards = useCallback(async () => {
    try {
      const response = await getRewards({
        page,
        limit,
      })
      setTotalPages(response.pagination.totalPages)
      setPage(response.pagination.currentPage)
      setRewards(response.rows)
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Error fetching rewards')
      }
    }
  }, [page, limit])

  const initialLoading = useCallback(async () => {
    await fetchRewards()
    setIsLoading(false)
  }, [fetchRewards])

  useEffect(() => {
    initialLoading()
  }, [initialLoading])

  if (isLoading) {
    return <Loading />
  }

  return (
    <ComponentCard title='Rewards'>
      <RewardTable
        rewards={rewards}
        totalPages={totalPages}
        page={page}
        setPage={setPage}
        isLoading={isLoading}
      />
    </ComponentCard>
  )
}

export default RewardsManagementPage
