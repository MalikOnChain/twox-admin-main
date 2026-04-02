'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { updateBlueOceanGameDetail } from '@/api/casino/blueocean'

import { mapBlueOceanGameToCasino } from '@/lib/blueocean-mapper'

import Checkbox from '@/components/form/input/Checkbox'
import Switch from '@/components/form/switch/Switch'
import Pagination from '@/components/tables/Pagination'
import { Dropdown } from '@/components/ui/dropdown/Dropdown'
import { DropdownItem } from '@/components/ui/dropdown/DropdownItem'
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { MoreDotIcon } from '@/icons'

import Loading from '../common/Loading'

import { ICasino } from '@/types/casino/casino'

type SlotsTableProps = {
  backUrl?: string
  tableData: ICasino[]
  totalPages: number
  page: number
  setPage: (page: number) => void
  isLoading: boolean
  setTableData: React.Dispatch<React.SetStateAction<ICasino[]>>
  type?: string
}

export default function SlotsTable({
  backUrl,
  tableData,
  totalPages,
  page,
  setPage,
  isLoading,
  setTableData,
}: SlotsTableProps) {
  const [openStatusDropdown, setOpenStatusDropdown] = useState<string | null>(
    null
  )
  const router = useRouter()

  const toggleStatusDropdown = (id: string) => {
    setOpenStatusDropdown(id)
  }

  const handleStatusChange = async (game_code: string, status: string) => {
    try {
      const response = await updateBlueOceanGameDetail(game_code, {
        property: 'status',
        value: status === '1' ? 'active' : 'inactive',
      })
      setTableData((prevData: ICasino[]) => {
        return prevData.map((data: ICasino) => {
          if (data.game_code === game_code) {
            return mapBlueOceanGameToCasino(response)
          }
          return data
        })
      })
    } catch (error) {
      console.error('Error updating game status:', error)
    }
    setOpenStatusDropdown(null)
  }

  const handleOnAddToHomePage = async (game_code: string, value: boolean) => {
    try {
      if (!tableData) return
      await updateBlueOceanGameDetail(game_code, {
        property: 'isFeatured',
        value: value,
      })
      setTableData((prevData: ICasino[]) => {
        return prevData.map((data: ICasino) => {
          if (data.game_code === game_code) {
            return { ...data, home_page: value }
          }
          return data
        })
      })
    } catch (error) {
      console.error('Error updating game homepage:', error)
    } finally {
      setOpenStatusDropdown(null)
    }
  }

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div className='overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]'>
          <div className='max-w-full overflow-x-auto'>
            <Table>
              <TableHeader className='border-b border-gray-100 dark:border-white/[0.05]'>
                <TableRow>
                  <TableCell
                    className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                    isHeader
                  />
                  <TableCell
                    className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                    isHeader
                  >
                    Game Name
                  </TableCell>
                  <TableCell
                    className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                    isHeader
                  >
                    Provider Code
                  </TableCell>
                  <TableCell
                    className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                    isHeader
                  >
                    Homepage status
                  </TableCell>
                  <TableCell
                    className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                    isHeader
                  >
                    Status
                  </TableCell>
                  <TableCell
                    className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                    isHeader
                  >
                    Action
                  </TableCell>
                </TableRow>
              </TableHeader>

              <TableBody className='divide-y divide-gray-100 dark:divide-white/[0.05]'>
                {tableData.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className='text-theme-sm w-[10%] px-5 py-3 text-center text-gray-500 dark:text-gray-400'>
                      <div className='flex items-center justify-center gap-3'>
                        <div className='overflow-hidden rounded-full'>
                          <Image
                            width={50}
                            height={50}
                            src={row.banner}
                            alt={row.game_name}
                            className='!h-[50px] !w-[50px]'
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className='text-theme-sm w-[20%] px-5 py-3 text-center text-gray-500 dark:text-gray-400'>
                      {/* <Link
                          href={`/games/${row.provider_code}/${row.game_code}`}
                          className='text-blue-500 hover:text-blue-600'
                        >
                          {row.game_name}
                        </Link> */}
                      <Link
                        href={`${backUrl || ''}/${row.provider_code}/${row.game_code}`}
                        className='text-blue-500 hover:text-blue-600'
                      >
                        {row.game_name}
                      </Link>
                    </TableCell>
                    <TableCell className='text-theme-sm !cursor-default px-5 py-3 text-center text-gray-500 dark:text-gray-400'>
                      {row.provider_code}
                    </TableCell>

                    <TableCell className='text-theme-sm px-5 py-3 text-center text-gray-500 dark:text-gray-400'>
                      {/* home page dropdown */}
                      <div className='relative inline-block'>
                        <Checkbox
                          checked={row.home_page}
                          onChange={() => {}}
                          className='!cursor-default'
                        />
                      </div>
                    </TableCell>
                    <TableCell className='text-theme-sm justify-center px-5 py-3 text-center text-gray-500 dark:text-gray-400'>
                      <Switch
                        labelClassName='justify-center'
                        label=''
                        color={row.status ? 'blue' : 'gray'}
                        defaultChecked={!!row.status}
                        onChange={() => {
                          handleStatusChange(
                            row.game_code,
                            Number(row.status) === 1 ? '0' : '1'
                          )
                        }}
                      />
                    </TableCell>
                    <TableCell className='text-theme-sm px-5 py-3 text-center text-gray-500 dark:text-gray-400'>
                      <div className='flex items-center justify-center'>
                        {/* status dropdown */}
                        <div className='relative inline-block'>
                          <button
                            onClick={() => toggleStatusDropdown(row._id)}
                            className='dropdown-toggle flex items-center'
                          >
                            <MoreDotIcon className='text-gray-400 hover:text-gray-700 dark:hover:text-gray-300' />
                          </button>
                          <Dropdown
                            isOpen={openStatusDropdown === row._id}
                            onClose={() => setOpenStatusDropdown(null)}
                            className='w-auto p-2'
                          >
                            <DropdownItem
                              onItemClick={() =>
                                router.push(
                                  `/game-providers/blueocean/${row.provider_code}/${row.game_code}`
                                )
                              }
                              className='flex w-full rounded-lg text-left font-normal whitespace-nowrap text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300'
                            >
                              Edit
                            </DropdownItem>
                            <DropdownItem
                              onItemClick={() =>
                                handleOnAddToHomePage(
                                  row.game_code,
                                  !row.home_page
                                )
                              }
                              className={`flex w-full rounded-lg text-left font-normal whitespace-nowrap text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300 ${row.home_page ? '!hidden' : ''}`}
                            >
                              Add to Homepage
                            </DropdownItem>
                            <DropdownItem
                              onItemClick={() =>
                                handleOnAddToHomePage(
                                  row.game_code,
                                  !row.home_page
                                )
                              }
                              className={`flex w-full rounded-lg text-left font-normal whitespace-nowrap text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300 ${row.home_page ? '' : '!hidden'}`}
                            >
                              Remove from Homepage
                            </DropdownItem>
                          </Dropdown>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {tableData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className='text-center'>
                      <p className='py-2 text-gray-500 dark:text-gray-400'>
                        No record found
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
        </div>
      )}
    </>
  )
}
