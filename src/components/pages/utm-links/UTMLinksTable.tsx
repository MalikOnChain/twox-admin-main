'use client'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useCallback, useState } from 'react'
import { toast } from 'sonner'

import { deleteUtmLink } from '@/api/utm-link'

import { getUtmSourceOptions } from '@/lib/utils'

import ConfirmModal from '@/components/common/ConfirmModal'
import Loading from '@/components/common/Loading'
import UTMTabs from '@/components/marketing/utm-tracking/UTMTabs'
import Pagination from '@/components/tables/Pagination'
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { CopyIcon, PencilIcon, TrashBinIcon } from '@/icons'

import { UTMLink } from '@/types/utm-link'

const UTM_SOURCE_OPTIONS = getUtmSourceOptions()

type UTMLinksTableProps = {
  utmLinks: UTMLink[]
  totalPages: number
  page: number
  setPage: (page: number) => void
  isLoading: boolean
  setIsLoading: (isLoading: boolean) => void
  fetchUtmLinks: () => void
  utmSource: string
  setUtmSource: (utmSource: string) => void
  onEdit: (utmLink: UTMLink) => void
}

export default function UTMLinksTable({
  utmLinks,
  totalPages,
  page,
  setPage,
  isLoading,
  setIsLoading,
  fetchUtmLinks,
  utmSource,
  setUtmSource,
  onEdit,
}: UTMLinksTableProps) {
  const [openConfirm, setOpenConfirm] = useState<boolean>(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const router = useRouter()

  const handleClose = useCallback(() => {
    setOpenConfirm(false)
    setDeleteId(null)
  }, [])

  const handleDelete = async (id: string) => {
    if (isLoading || !id) return
    try {
      setIsLoading(true)
      const res = await deleteUtmLink(id)
      if (res.message) {
        toast.success('UTM Link deleted successfully')
        fetchUtmLinks()
      }
    } catch (error) {
      console.error('Error deleting UTM link:', error)
      toast.error(
        error instanceof Error ? error.message : 'Failed to delete UTM link'
      )
    } finally {
      setIsLoading(false)
      setDeleteId(null)
      setOpenConfirm(false)
    }
  }

  const handleCopyToClipboard = (link: string) => {
    navigator.clipboard.writeText(link)
    toast.success('UTM Link copied to clipboard')
  }

  const handleEditClick = (utmLink: UTMLink) => {
    onEdit(utmLink)
  }

  const handleDeleteClick = (id: string) => {
    setDeleteId(id)
    setOpenConfirm(true)
  }

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <UTMTabs
            utmSource={utmSource}
            onClick={(value) => setUtmSource(value)}
            className='mb-5 w-full'
          />
          <div className='overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]'>
            <div className='max-w-full overflow-x-auto'>
              <div className='min-w-[1102px]'>
                <Table>
                  <TableHeader className='border-b border-gray-100 dark:border-white/[0.05]'>
                    <TableRow>
                      <TableCell
                        isHeader
                        className='text-theme-xs px-5 py-3 text-left font-medium text-gray-500 dark:text-gray-400'
                      >
                        Source
                      </TableCell>
                      <TableCell
                        isHeader
                        className='text-theme-xs px-5 py-3 text-left font-medium text-gray-500 dark:text-gray-400'
                      >
                        UTM Link
                      </TableCell>
                      <TableCell
                        isHeader
                        className='text-theme-xs px-5 py-3 text-left font-medium text-gray-500 dark:text-gray-400'
                      >
                        Campaign
                      </TableCell>
                      <TableCell
                        isHeader
                        className='text-theme-xs px-5 py-3 text-left font-medium text-gray-500 dark:text-gray-400'
                      >
                        Content
                      </TableCell>
                      <TableCell
                        isHeader
                        className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                      >
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHeader>

                  <TableBody className='divide-y divide-gray-100 dark:divide-white/[0.05]'>
                    {utmLinks &&
                      utmLinks.length > 0 &&
                      utmLinks.map((utmLink) => (
                        <TableRow key={utmLink._id}>
                          <TableCell className='px-5 py-4 text-gray-500 sm:px-6 dark:text-gray-400'>
                            <div className='flex items-center gap-2'>
                              <Image
                                src={
                                  UTM_SOURCE_OPTIONS.find(
                                    (option) =>
                                      option.value === utmLink.utm_source
                                  )?.icon || '/images/default-source.png'
                                }
                                alt='UTM Source'
                                width={20}
                                height={20}
                              />
                              {UTM_SOURCE_OPTIONS.find(
                                (option) => option.value === utmLink.utm_source
                              )?.label || utmLink.utm_source}
                            </div>
                          </TableCell>
                          <TableCell className='text-theme-sm text-blue-light-500 max-w-[300px] cursor-default px-4 py-3 text-left'>
                            <div className='max-h-[4.5em] overflow-hidden'>
                              <span
                                className='line-clamp-3 block cursor-pointer overflow-hidden break-words text-ellipsis'
                                onClick={() =>
                                  handleCopyToClipboard(utmLink.link)
                                }
                              >
                                {utmLink.link}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className='px-5 py-4 text-gray-500 sm:px-6 dark:text-gray-400'>
                            <span
                              className='text-theme-sm hover:text-brand-500 block cursor-pointer font-medium text-gray-800 dark:text-white/90'
                              onClick={() => {
                                router.push(
                                  `/promotion/${utmLink.utm_campaign._id}`
                                )
                              }}
                            >
                              {utmLink.utm_campaign?.name}
                            </span>
                          </TableCell>
                          <TableCell className='px-5 py-4 text-gray-500 sm:px-6 dark:text-gray-400'>
                            <div className='flex justify-between gap-2 rounded-md bg-[#171F2F] p-4'>
                              <div className='flex w-full flex-col gap-2'>
                                <div className='text-theme-sm font-bold text-gray-800 dark:text-white/90'>
                                  {utmLink.utm_content.title}
                                </div>
                                <div className='text-theme-sm font-bold text-gray-400'>
                                  {utmLink.utm_content.description}
                                </div>
                              </div>
                              <div className='h-[100px] w-auto'>
                                <Image
                                  src={utmLink.utm_content.image}
                                  alt='UTM Content'
                                  width={0}
                                  height={0}
                                  sizes='100vw'
                                  className='h-full w-auto object-cover'
                                />
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className='text-theme-sm px-4 py-3 text-center text-gray-500 dark:text-gray-400'>
                            <div className='flex items-center justify-center gap-2'>
                              <button
                                className='hover:text-brand-500 text-theme-xs dark:text-theme-xs flex items-center justify-center gap-1 hover:cursor-pointer'
                                onClick={() =>
                                  handleCopyToClipboard(utmLink.link)
                                }
                                type='button'
                              >
                                <CopyIcon />
                              </button>
                              <button
                                className='hover:text-brand-500 text-theme-xs dark:text-theme-xs flex items-center justify-center gap-1 hover:cursor-pointer'
                                onClick={() => handleEditClick(utmLink)}
                                type='button'
                              >
                                <PencilIcon />
                              </button>
                              <button
                                className='hover:text-brand-500 text-theme-xs dark:text-theme-xs flex items-center justify-center gap-1 hover:cursor-pointer'
                                onClick={() => handleDeleteClick(utmLink._id)}
                                type='button'
                              >
                                <TrashBinIcon />
                              </button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}

                    {utmLinks.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className='text-center'>
                          <p className='py-2 text-gray-500 dark:text-gray-400'>
                            No UTM links found
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
              description='You can not restore deleted UTM link.'
              handleConfirm={() => deleteId && handleDelete(deleteId)}
              handleClose={handleClose}
            />
          </div>
        </>
      )}
    </>
  )
}
