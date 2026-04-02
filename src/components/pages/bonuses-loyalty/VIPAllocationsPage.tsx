'use client'

import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

import {
  createReferralUserReward,
  getReferralUserRewards,
  updateReferralUserReward,
} from '@/api/referral-reward'

import ComponentCard from '@/components/common/ComponentCard'
import Loading from '@/components/common/Loading'
import ReferralUserRewardTable from '@/components/pages/referral-user-reward/ReferralUserRewardTable'
import ReferralRewardSettingModal from '@/components/referral-user-reward/ReferralRewardSettingModal'
import Button from '@/components/ui/button/Button'
import { PlusIcon } from '@/icons'

import {
  ReferralUserReward,
  ReferralUserRewardFormValues,
} from '@/types/referral-reward'

export default function VIPAllocationsPage() {
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [page, setPage] = useState<number>(1)
  const [limit] = useState<number>(10)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [bonuses, setBonuses] = useState<ReferralUserReward[]>([])
  const [selectedBonus, setSelectedBonus] = useState<ReferralUserReward | null>(
    null
  )

  const handleOpenModal = useCallback(() => {
    setOpenModal(true)
    if (selectedBonus) {
      setSelectedBonus(null)
    }
  }, [selectedBonus])

  const handleCloseModal = useCallback(() => {
    setOpenModal(false)
    if (selectedBonus) {
      setSelectedBonus(null)
    }
  }, [selectedBonus])

  const fetchReferralUserRewards = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await getReferralUserRewards({
        page,
        limit,
        filter: '',
      })
      setTotalPages(response.pagination.totalPages)
      setPage(response.pagination.currentPage)
      setBonuses(response.rows)
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Error fetching referral rewards')
      }
    } finally {
      setIsLoading(false)
    }
  }, [page, limit])

  const handleOnSubmit = async (data: ReferralUserRewardFormValues) => {
    try {
      if (selectedBonus) {
        await updateReferralUserReward(selectedBonus._id, data)
        toast.success('ReferralUserReward updated successfully')
        fetchReferralUserRewards()
        return true
      } else {
        await createReferralUserReward(data)
        toast.success('ReferralUserReward created successfully')
        fetchReferralUserRewards()
        return true
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Error creating referral reward')
      }
      return false
    }
  }

  const handleOnEdit = (bonus: ReferralUserReward) => {
    setSelectedBonus(bonus)
    handleOpenModal()
  }

  useEffect(() => {
    fetchReferralUserRewards()
  }, [fetchReferralUserRewards])

  if (isLoading) {
    return <Loading />
  }

  return (
    <div className='space-y-6'>
      <ComponentCard
        title='VIP-Triggered Allocations'
        action={
          <Button onClick={handleOpenModal} size='xs'>
            <PlusIcon />
            Add Referral Reward
          </Button>
        }
      >
        <ReferralRewardSettingModal
          isOpen={openModal}
          closeModal={handleCloseModal}
          selectedReferralUserReward={selectedBonus}
          onSubmit={handleOnSubmit}
        />
        <ReferralUserRewardTable
          rewards={bonuses}
          totalPages={totalPages}
          page={page}
          setPage={setPage}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          fetchReferralUserRewards={fetchReferralUserRewards}
          onEdit={handleOnEdit}
        />
      </ComponentCard>
    </div>
  )
}
