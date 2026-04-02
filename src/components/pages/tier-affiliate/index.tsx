'use client'

import Link from 'next/link'
import React, { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

import { deleteTierAffiliate, getAllTierAffiliates } from '@/api/tier-affiliate'

import { useModal } from '@/hooks/useModal'

import ComponentCard from '@/components/common/ComponentCard'
import ConfirmModal from '@/components/common/ConfirmModal'
import Loading from '@/components/common/Loading'
import TierAffiliateDetail from '@/components/pages/tier-affiliate/detail'
import Pagination from '@/components/tables/Pagination'
import Badge from '@/components/ui/badge/Badge'
import Button from '@/components/ui/button/Button'
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { PencilIcon, PlusIcon, TrashBinIcon } from '@/icons'

import { ITierAffiliateCollection } from '@/types/tier-affiliate'

export default function TierAffiliatesList() {
  const detailModal = useModal()

  const [tableData, setTableData] = useState<ITierAffiliateCollection[]>([])
  const [page, setPage] = useState<number>(1)
  const [limit] = useState<number>(10)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [openConfirm, setOpenConfirm] = useState<boolean>(false)
  const [deleteId, setDeleteId] = useState<string>(null)
  const [selectedItem, setSelectedItem] =
    useState<ITierAffiliateCollection>(null)

  const handleDeleteModalClose = useCallback(() => setOpenConfirm(false), [])
  const handleDetailModalClose = useCallback(() => {
    detailModal.closeModal()
    setSelectedItem(null)
  }, [detailModal])

  const fetchTierAffiliates = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await getAllTierAffiliates({ page, limit })
      setTableData(response.rows)
      setTotalPages(response.totalPages)
      setPage(response.currentPage)
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      }
      console.error('Error fetching users:', error)
    } finally {
      setIsLoading(false)
    }
  }, [page, limit])
  useEffect(() => {
    fetchTierAffiliates()
  }, [fetchTierAffiliates])

  const handleDelete = async (id: string) => {
    if (isLoading || !id) return
    try {
      setIsLoading(true)
      await deleteTierAffiliate(id)
      toast.success('TierAffiliate deleted successfully')
      const newTierAffiliates = tableData.filter((item) => item._id !== id)
      setTableData(newTierAffiliates)
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      }
      console.error('Error deleting record:', error)
    } finally {
      setIsLoading(false)
      setDeleteId(null)
    }
  }

  return (
    <ComponentCard
      title='Tier Affiliate management'
      action={
        <Button onClick={detailModal.openModal} size='xs'>
          <PlusIcon />
          Add Tier Affiliate
        </Button>
      }
    >
      {isLoading ? (
        <Loading />
      ) : (
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
                    className='text-theme-xs px-5 py-3 text-left font-medium text-gray-500 dark:text-gray-400'
                  >
                    Refferal Code
                  </TableCell>
                  <TableCell
                    isHeader
                    className='text-theme-xs px-5 py-3 text-left font-medium text-gray-500 dark:text-gray-400'
                  >
                    Wager Commission Rate
                  </TableCell>
                  <TableCell
                    isHeader
                    className='text-theme-xs px-5 py-3 text-left font-medium text-gray-500 dark:text-gray-400'
                  >
                    Lose Commission Rate
                  </TableCell>
                  <TableCell
                    isHeader
                    className='text-theme-xs px-5 py-3 text-left font-medium text-gray-500 dark:text-gray-400'
                  >
                    Assigners
                  </TableCell>
                  <TableCell
                    isHeader
                    className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                  >
                    Refferred Users
                  </TableCell>
                  <TableCell
                    isHeader
                    className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                  >
                    Action
                  </TableCell>
                </TableRow>
              </TableHeader>

              {/* Table Body */}
              <TableBody className='divide-y divide-gray-100 dark:divide-white/[0.05]'>
                {tableData.map((row) => (
                  <TableRow key={row._id}>
                    <TableCell className='text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400'>
                      <Link
                        href={`/tier-affiliate/${row._id}`}
                        className='hover:text-brand-500'
                      >
                        {row.name}
                      </Link>
                    </TableCell>
                    <TableCell className='text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400'>
                      {row.referralCode}
                    </TableCell>
                    <TableCell className='text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400'>
                      {row.wagerCommissionRate}
                    </TableCell>
                    <TableCell className='text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400'>
                      {row.lossCommissionRate}
                    </TableCell>
                    <TableCell className='text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400'>
                      <Badge variant='light' color='info'>
                        {row.assigner?.username || 'N/A'}
                      </Badge>
                    </TableCell>
                    <TableCell className='text-theme-sm px-4 py-3 text-center text-gray-500 dark:text-gray-400'>
                      {row.userCount}
                    </TableCell>
                    <TableCell className='text-theme-sm flex items-center justify-center gap-1 px-4 py-3 text-center text-gray-500 dark:text-gray-400'>
                      <a
                        className='hover:text-brand-500 text-theme-xs dark:text-theme-xs flex items-center justify-center gap-1 hover:cursor-pointer'
                        onClick={() => {
                          setSelectedItem(row)
                          detailModal.openModal()
                        }}
                      >
                        <PencilIcon />
                      </a>
                      <a
                        className='hover:text-brand-500 text-theme-xs dark:text-theme-xs flex items-center justify-center gap-1 hover:cursor-pointer'
                        onClick={() => {
                          setDeleteId(row._id)
                          setOpenConfirm(true)
                        }}
                      >
                        <TrashBinIcon />
                      </a>
                    </TableCell>
                  </TableRow>
                ))}
                {tableData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className='text-center'>
                      <p className='py-2 text-gray-500 dark:text-gray-400'>
                        No Tier Afffiliate found
                      </p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            {tableData.length > 0 && (
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
            description='You can not restore deleted record.'
            handleConfirm={() => {
              handleDelete(deleteId)
            }}
            handleClose={handleDeleteModalClose}
          />
        </div>
      )}
      <TierAffiliateDetail
        isOpen={detailModal.isOpen}
        closeModal={handleDetailModalClose}
        detail={selectedItem}
        handleSave={fetchTierAffiliates}
      />
    </ComponentCard>
  )
}
