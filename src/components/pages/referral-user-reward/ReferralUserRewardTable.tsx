'use client'
import React, { useCallback, useState } from 'react'
import { toast } from 'sonner'

import { deleteReferralUserReward } from '@/api/referral-reward'

import ConfirmModal from '@/components/common/ConfirmModal'
import Loading from '@/components/common/Loading'
import Pagination from '@/components/tables/Pagination'
import Badge from '@/components/ui/badge/Badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { PencilIcon, TrashBinIcon } from '@/icons'

import { ReferralUserReward, RewardStatus } from '@/types/referral-reward'

type ReferralUserRewardTableProps = {
  rewards: ReferralUserReward[]
  totalPages: number
  page: number
  setPage: (page: number) => void
  isLoading: boolean
  setIsLoading: (isLoading: boolean) => void
  fetchReferralUserRewards: () => void
  onEdit: (reward: ReferralUserReward) => void
}

export default function ReferralUserRewardTable({
  rewards,
  totalPages,
  page,
  setPage,
  isLoading,
  setIsLoading,
  fetchReferralUserRewards,
  onEdit,
}: ReferralUserRewardTableProps) {
  const [openConfirm, setOpenConfirm] = useState<boolean>(false)
  const [deleteId, setDeleteId] = useState<string>(null)

  const handleClose = useCallback(() => setOpenConfirm(false), [])

  const handleDelete = async (id: string) => {
    if (isLoading || !id) return
    try {
      setIsLoading(true)
      const res = await deleteReferralUserReward(id)
      if (res.message) {
        toast.success('ReferralUserReward deleted successfully')
        fetchReferralUserRewards()
      }
    } catch (error) {
      console.error('Error deleting reward:', error)
      toast.error(error.message || 'Failed to delete reward')
    } finally {
      setIsLoading(false)
      setDeleteId(null)
      setOpenConfirm(false)
    }
  }

  // Function to get badge color based on reward status
  const getBadgeColor = (status: RewardStatus) => {
    switch (status) {
      case RewardStatus.ACTIVE:
        return 'success'
      case RewardStatus.INACTIVE:
        return 'error'
      default:
        return 'primary'
    }
  }

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <div className='overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]'>
            <div className='max-w-full overflow-x-auto'>
              <Table>
                {/* Table Header */}
                <TableHeader className='border-b border-gray-100 dark:border-white/[0.05]'>
                  <TableRow>
                    <TableCell
                      isHeader
                      className='text-theme-xs px-5 py-3 text-left font-medium text-gray-500 dark:text-gray-400'
                    >
                      Name
                    </TableCell>
                    <TableCell
                      isHeader
                      className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                    >
                      Reward Amount
                    </TableCell>
                    <TableCell
                      isHeader
                      className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                    >
                      Referral Users
                    </TableCell>
                    <TableCell
                      isHeader
                      className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                    >
                      Status
                    </TableCell>
                    <TableCell
                      isHeader
                      className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHeader>

                {/* Table Body */}
                <TableBody className='divide-y divide-gray-100 dark:divide-white/[0.05]'>
                  {rewards &&
                    rewards.length > 0 &&
                    rewards.map((reward) => (
                      <TableRow key={reward._id}>
                        <TableCell className='text-theme-sm cursor-default px-4 py-3 text-left text-gray-500 dark:text-gray-400'>
                          {reward.name}
                        </TableCell>
                        <TableCell className='text-theme-sm cursor-default px-4 py-3 text-center text-gray-500 dark:text-gray-400'>
                          {reward.amount}
                        </TableCell>
                        <TableCell className='text-theme-sm cursor-default px-4 py-3 text-center text-gray-500 dark:text-gray-400'>
                          {reward.requiredReferralCount}
                        </TableCell>
                        <TableCell className='text-theme-sm cursor-default px-4 py-3 text-center text-gray-500 dark:text-gray-400'>
                          <Badge size='sm' color={getBadgeColor(reward.status)}>
                            <span className='capitalize'>
                              {RewardStatus[reward.status]}
                            </span>
                          </Badge>
                        </TableCell>
                        <TableCell className='text-theme-sm px-4 py-3 text-center text-gray-500 dark:text-gray-400'>
                          <div className='flex items-center justify-center gap-2'>
                            <a
                              className='hover:text-brand-500 text-theme-xs dark:text-theme-xs flex items-center justify-center gap-1 hover:cursor-pointer'
                              onClick={() => {
                                onEdit(reward)
                              }}
                            >
                              <PencilIcon />
                            </a>
                            <a
                              className='hover:text-brand-500 text-theme-xs dark:text-theme-xs flex items-center justify-center gap-1 hover:cursor-pointer'
                              onClick={() => {
                                setDeleteId(reward._id)
                                setOpenConfirm(true)
                              }}
                            >
                              <TrashBinIcon />
                            </a>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}

                  {rewards.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} className='text-center'>
                        <p className='py-2 text-gray-500 dark:text-gray-400'>
                          No rewards found
                        </p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              {totalPages > 1 && (
                <Pagination
                  totalPages={totalPages}
                  currentPage={page}
                  onPageChange={setPage}
                  className='mb-5 justify-center'
                />
              )}
            </div>
            <ConfirmModal
              open={openConfirm}
              title='Are you Sure?'
              description='You can not restore deleted reward.'
              handleConfirm={() => handleDelete(deleteId)}
              handleClose={handleClose}
            />
          </div>
        </>
      )}
    </>
  )
}
