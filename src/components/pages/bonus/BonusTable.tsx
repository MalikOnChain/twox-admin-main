'use client'
import { formatDate } from '@fullcalendar/core/index.js'
import { useRouter } from 'next/navigation'
import React, { useCallback, useState } from 'react'
import { toast } from 'sonner'

import { deleteBonus } from '@/api/bonus'

import { BonusStatus, BonusType, ClaimMethod } from '@/lib/bonus'

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

import { Bonus } from '@/types/bonus'
import { ITierData } from '@/types/tier'

type BonusTableProps = {
  bonuses: Bonus[]
  totalPages: number
  page: number
  loyaltyTiers: ITierData[]
  setPage: (page: number) => void
  isLoading: boolean
  setIsLoading: (isLoading: boolean) => void
  fetchBonuses: () => void
  onEdit: (bonus: Bonus) => void
}

export default function BonusTable({
  bonuses,
  totalPages,
  page,
  setPage,
  isLoading,
  setIsLoading,
  fetchBonuses,
  onEdit,
}: BonusTableProps) {
  const router = useRouter()
  const [openConfirm, setOpenConfirm] = useState<boolean>(false)
  const [deleteId, setDeleteId] = useState<string>(null)

  const handleClose = useCallback(() => setOpenConfirm(false), [])

  const handleBonusClick = useCallback(
    (bonusId: string) => {
      router.push(`/bonus/${bonusId}`)
    },
    [router]
  )

  const handleDelete = async (id: string) => {
    if (isLoading || !id) return
    try {
      setIsLoading(true)
      const res = await deleteBonus(id)
      if (res.message) {
        toast.success('Bonus deleted successfully')
        fetchBonuses()
      }
    } catch (error) {
      console.error('Error deleting bonus:', error)
      toast.error(error.message || 'Failed to delete bonus')
    } finally {
      setIsLoading(false)
      setDeleteId(null)
      setOpenConfirm(false)
    }
  }

  // Function to get badge color based on bonus status
  const getBadgeColor = (status: BonusStatus) => {
    switch (status) {
      case BonusStatus.ACTIVE:
        return 'success'
      case BonusStatus.DRAFT:
        return 'warning'
      case BonusStatus.EXPIRED:
        return 'error'
      case BonusStatus.INACTIVE:
        return 'error'
      default:
        return 'primary'
    }
  }

  // Function to get bonus type display name
  const getBonusTypeDisplay = (type: BonusType) => {
    return (
      type.charAt(0).toUpperCase() +
      type.slice(1).toLowerCase().replace(/_/g, ' ')
    )
  }

  const getAmount = useCallback((bonus: Bonus) => {
    const reward = bonus?.defaultReward
    let displayText = ''

    // Handle cash rewards
    if (reward?.cash) {
      if (reward.cash.percentage) {
        displayText = `${reward.cash.percentage}%`
        if (reward.cash.minAmount && reward.cash.maxAmount) {
          displayText += ` of ${reward.cash.minAmount} - ${reward.cash.maxAmount}`
        } else if (reward.cash.minAmount) {
          displayText += ` of ${reward.cash.minAmount}`
        } else if (reward.cash.maxAmount) {
          displayText += ` of ${reward.cash.maxAmount}`
        }
      } else if (reward.cash.amount) {
        displayText = `Fixed ${reward.cash.amount}`
      } else if (reward.cash.minAmount && reward.cash.maxAmount) {
        if (reward.cash.minAmount === reward.cash.maxAmount) {
          displayText = `Fixed ${reward.cash.minAmount}`
        } else {
          displayText = `Random ${reward.cash.minAmount} - ${reward.cash.maxAmount}`
        }
      }
    }

    // Handle free spins
    if (reward?.freeSpins) {
      const freeSpinsText = reward.freeSpins.amount
        ? `${reward.freeSpins.amount} Free Spins`
        : reward.freeSpins.percentage
          ? `${reward.freeSpins.percentage}% Free Spins`
          : ''
      if (freeSpinsText) {
        displayText = displayText
          ? `${displayText} + ${freeSpinsText}`
          : freeSpinsText
      }
    }

    // Handle bonus rewards
    if (reward?.bonus) {
      const bonusText = reward.bonus.amount
        ? `${reward.bonus.amount} Bonus`
        : reward.bonus.percentage
          ? `${reward.bonus.percentage}% Bonus`
          : ''
      if (bonusText) {
        displayText = displayText ? `${displayText} + ${bonusText}` : bonusText
      }
    }

    return displayText || 'N/A'
  }, [])

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <div className='overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]'>
            <div className='max-w-full overflow-x-auto'>
              <div className='min-w-[1102px]'>
                <Table>
                  {/* Table Header */}
                  <TableHeader className='border-b border-gray-100 dark:border-white/[0.05]'>
                    <TableRow>
                      <TableCell
                        isHeader
                        className='text-theme-xs px-5 py-3 text-left font-medium text-gray-500 dark:text-gray-400'
                      >
                        Title
                      </TableCell>
                      <TableCell
                        isHeader
                        className='text-theme-xs px-5 py-3 text-left font-medium text-gray-500 dark:text-gray-400'
                      >
                        Type
                      </TableCell>
                      <TableCell
                        isHeader
                        className='text-theme-xs px-5 py-3 text-left font-medium text-gray-500 dark:text-gray-400'
                      >
                        Amount
                      </TableCell>
                      <TableCell
                        isHeader
                        className='text-theme-xs px-5 py-3 text-left font-medium text-gray-500 dark:text-gray-400'
                      >
                        Eligible Users/Tiers
                      </TableCell>
                      <TableCell
                        isHeader
                        className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                      >
                        Claim Method
                      </TableCell>
                      <TableCell
                        isHeader
                        className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                      >
                        Valid From
                      </TableCell>
                      <TableCell
                        isHeader
                        className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                      >
                        Valid To
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
                    {bonuses &&
                      bonuses.length > 0 &&
                      bonuses.map((bonus) => (
                        <TableRow key={bonus._id}>
                          <TableCell
                            className='text-theme-sm hover:text-brand-500 dark:hover:text-brand-500 cursor-pointer px-4 py-3 text-left text-gray-500 dark:text-gray-400'
                            onClick={() => handleBonusClick(bonus._id)}
                          >
                            {bonus.name}
                          </TableCell>
                          <TableCell className='px-5 py-4 text-gray-500 sm:px-6 dark:text-gray-400'>
                            {getBonusTypeDisplay(bonus.type)}
                          </TableCell>
                          <TableCell className='px-5 py-4 text-gray-500 sm:px-6 dark:text-gray-400'>
                            {getAmount(bonus)}
                          </TableCell>
                          <TableCell className='px-5 py-4 text-center text-gray-500 sm:px-6 dark:text-gray-400'>
                            {/* {getEligibilityDisplay(bonus)} */}
                          </TableCell>
                          <TableCell className='text-theme-sm cursor-default px-4 py-3 text-center text-gray-500 dark:text-gray-400'>
                            {bonus.claimMethod}
                            {bonus.claimMethod === ClaimMethod.CODE &&
                              bonus.code && (
                                <span className='ml-1 text-xs font-medium text-gray-400'>
                                  ({bonus.code})
                                </span>
                              )}
                          </TableCell>
                          <TableCell className='text-theme-sm cursor-default px-4 py-3 text-center text-gray-500 dark:text-gray-400'>
                            {bonus.validFrom
                              ? formatDate(bonus.validFrom)
                              : 'N/A'}
                          </TableCell>
                          <TableCell className='text-theme-sm cursor-default px-4 py-3 text-center text-gray-500 dark:text-gray-400'>
                            {bonus.validTo
                              ? formatDate(bonus.validTo)
                              : 'No Expiry'}
                          </TableCell>
                          <TableCell className='text-theme-sm cursor-default px-4 py-3 text-center text-gray-500 dark:text-gray-400'>
                            <Badge
                              size='sm'
                              color={getBadgeColor(bonus.status)}
                            >
                              <span className='capitalize'>{bonus.status}</span>
                            </Badge>
                          </TableCell>
                          <TableCell className='text-theme-sm px-4 py-3 text-center text-gray-500 dark:text-gray-400'>
                            <div className='flex items-center justify-center gap-2'>
                              <a
                                className='hover:text-brand-500 text-theme-xs dark:text-theme-xs flex items-center justify-center gap-1 hover:cursor-pointer'
                                onClick={() => {
                                  onEdit(bonus)
                                }}
                              >
                                <PencilIcon />
                              </a>
                              <a
                                className='hover:text-brand-500 text-theme-xs dark:text-theme-xs flex items-center justify-center gap-1 hover:cursor-pointer'
                                onClick={() => {
                                  setDeleteId(bonus._id)
                                  setOpenConfirm(true)
                                }}
                              >
                                <TrashBinIcon />
                              </a>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}

                    {bonuses.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={9} className='text-center'>
                          <p className='py-2 text-gray-500 dark:text-gray-400'>
                            No bonuses found
                          </p>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
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
              description='You can not restore deleted bonus.'
              handleConfirm={() => handleDelete(deleteId)}
              handleClose={handleClose}
            />
          </div>
        </>
      )}
    </>
  )
}
