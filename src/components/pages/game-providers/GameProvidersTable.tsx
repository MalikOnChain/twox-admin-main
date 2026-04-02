'use client'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useCallback, useState } from 'react'
import { toast } from 'sonner'

import {
  toggleGameProvider,
  updateGameProvider,
} from '@/api/casino/game-providers'

import { GameProviderFormValues } from '@/lib/game-provider'

import ConfirmModal from '@/components/common/ConfirmModal'
import Loading from '@/components/common/Loading'
import Switch from '@/components/form/switch/Switch'
import GameProvidersDetailModal from '@/components/pages/game-providers/GameProvidersDetailModal'
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
import Badge from '@/components/ui/badge/Badge'
import Button from '@/components/ui/button/Button'
import { formatNumber } from '@/lib/utils'
import { IProvider } from '@/api/games-providers'

import { GameProvider } from '@/types/game-provider'

type GameProvidersTableProps = {
  type: string
  gameProviders: GameProvider[]
  totalPages: number
  page: number
  setPage: (page: number) => void
  isLoading: boolean
  setIsLoading: (isLoading: boolean) => void
  fetchGameProviders: () => void
  providers?: IProvider[]
}

export default function GameProvidersTable({
  type,
  gameProviders,
  totalPages,
  page,
  setPage,
  isLoading,
  setIsLoading,
  fetchGameProviders,
  providers = [],
}: GameProvidersTableProps) {
  const router = useRouter()
  const [openConfirm, setOpenConfirm] = useState<boolean>(false)
  const [openGameProviderDetailModal, setOpenGameProviderDetailModal] =
    useState<boolean>(false)
  const [selectedItem, setSelectedItem] = useState<GameProvider>(null)
  const [openStatusDropdown, setOpenStatusDropdown] = useState<string | null>(
    null
  )
  const toggleStatusDropdown = (id: string) => {
    setOpenStatusDropdown(id)
  }

  const openProviderModal = (detail: GameProvider) => {
    setOpenGameProviderDetailModal(true)
    setSelectedItem(detail)
  }
  const handleClose = useCallback(
    () => setOpenGameProviderDetailModal(false),
    []
  )

  const handleToggle = async (toggle: GameProvider) => {
    if (isLoading || !toggle._id) return
    try {
      setIsLoading(true)
      await toggleGameProvider(type, toggle._id)
      fetchGameProviders()
    } catch (error) {
      console.error('Error toggele gameProvider:', error)
      toast.error('Failed to toggle status of gameProvider')
    } finally {
      setIsLoading(false)
      setOpenConfirm(false)
    }
  }

  const handleSubmitProvider = async (data: GameProviderFormValues) => {
    if (selectedItem && data.banner === '') {
      toast.error('Please upload Game Provider banner')
      return false
    }
    try {
      if (selectedItem) {
        const res = await updateGameProvider(
          selectedItem._id,
          data as GameProvider
        )
        if (res.success) {
          toast.success('Game Provider updated successfully')
        } else {
          toast.error(res.message)
        }
      }
      fetchGameProviders()
      return true
    } catch (error) {
      console.error('Error updating Game Provider detail:', error)
      return false
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
                      Banner
                    </TableCell>
                    <TableCell
                      isHeader
                      className='text-theme-xs px-5 py-3 text-left font-medium text-gray-500 dark:text-gray-400'
                    >
                      Code
                    </TableCell>
                    <TableCell
                      isHeader
                      className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                    >
                      Name
                    </TableCell>
                    <TableCell
                      isHeader
                      className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                    >
                      Type
                    </TableCell>
                    <TableCell
                      isHeader
                      className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                    >
                      Game Count
                    </TableCell>
                    {providers.length > 0 && (
                      <>
                        <TableCell
                          isHeader
                          className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                        >
                          Uptime %
                        </TableCell>
                        <TableCell
                          isHeader
                          className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                        >
                          Fee %
                        </TableCell>
                        <TableCell
                          isHeader
                          className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                        >
                          Markets
                        </TableCell>
                        <TableCell
                          isHeader
                          className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                        >
                          GGR
                        </TableCell>
                      </>
                    )}
                    <TableCell
                      isHeader
                      className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                    >
                      Status
                    </TableCell>
                    {providers.length > 0 && (
                      <TableCell
                        isHeader
                        className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                      >
                        Actions
                      </TableCell>
                    )}
                  </TableRow>
                </TableHeader>

                {/* Table Body */}
                <TableBody className='divide-y divide-gray-100 dark:divide-white/[0.05]'>
                  {providers && providers.length > 0 ? (
                    providers.map((provider) => {
                      const gameProvider = gameProviders.find((gp) => gp.code === provider.code)
                      return (
                        <TableRow key={provider._id}>
                          <TableCell className='text-theme-sm w-[10%] px-5 py-3 text-center text-gray-500 dark:text-gray-400'>
                            <div className='flex items-center justify-center gap-3'>
                              <div className='min-h-12 min-w-12 overflow-hidden rounded-full'>
                                {(provider.image || gameProvider?.banner) && (
                                  <Image
                                    width={50}
                                    height={50}
                                    src={provider.image || gameProvider?.banner || ''}
                                    alt={provider.name}
                                    className='!h-[50px] !w-[50px]'
                                  />
                                )}
                              </div>
                              {gameProvider && (
                                <div className='relative inline-block'>
                                  <button
                                    onClick={() =>
                                      toggleStatusDropdown(gameProvider._id)
                                    }
                                    className='dropdown-toggle flex items-center'
                                  >
                                    <MoreDotIcon className='text-gray-400 hover:text-gray-700 dark:hover:text-gray-300' />
                                  </button>
                                  <Dropdown
                                    isOpen={openStatusDropdown === gameProvider._id}
                                    onClose={() => setOpenStatusDropdown(null)}
                                    className='w-auto p-2'
                                  >
                                    <DropdownItem
                                      onItemClick={() => {
                                        openProviderModal(gameProvider)
                                      }}
                                      className='flex w-full rounded-lg text-left font-normal whitespace-nowrap text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300'
                                    >
                                      Edit
                                    </DropdownItem>
                                  </Dropdown>
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className='text-theme-sm cursor-default px-4 py-3 text-left text-gray-500 dark:text-gray-400'>
                            <span
                              className='cursor-pointer hover:text-blue-700'
                              onClick={() => {
                                router.push(
                                  `/game-providers/${type}/${provider.code}`
                                )
                              }}
                            >
                              {provider.code}
                            </span>
                          </TableCell>
                          <TableCell className='px-5 py-4 text-center text-gray-500 sm:px-6 dark:text-gray-400'>
                            {provider.name}
                          </TableCell>
                          <TableCell className='px-5 py-4 text-center text-gray-500 sm:px-6 dark:text-gray-400'>
                            {gameProvider?.type || 'N/A'}
                          </TableCell>
                          <TableCell className='px-5 py-4 text-center text-gray-500 sm:px-6 dark:text-gray-400'>
                            {provider.gamesCount || 'N/A'}
                          </TableCell>
                          {providers.length > 0 && (
                            <>
                              <TableCell className='text-center px-5 py-4 text-gray-500 sm:px-6 dark:text-gray-400'>
                                <Badge
                                  size='sm'
                                  color={provider.uptimePercent >= 95 ? 'success' : provider.uptimePercent >= 80 ? 'warning' : 'error'}
                                >
                                  {provider.uptimePercent.toFixed(1)}%
                                </Badge>
                              </TableCell>
                              <TableCell className='text-center px-5 py-4 text-gray-500 sm:px-6 dark:text-gray-400'>
                                {provider.feePercent.toFixed(2)}%
                              </TableCell>
                              <TableCell className='px-5 py-4 text-center text-gray-500 sm:px-6 dark:text-gray-400'>
                                {provider.markets && provider.markets.length > 0 ? (
                                  <div className='flex flex-wrap gap-1 justify-center'>
                                    {provider.markets.map((market) => (
                                      <Badge key={market} size='sm' color='info'>
                                        {market}
                                      </Badge>
                                    ))}
                                  </div>
                                ) : (
                                  <span className='text-gray-400'>N/A</span>
                                )}
                              </TableCell>
                              <TableCell className='text-center px-5 py-4 font-semibold text-gray-500 sm:px-6 dark:text-gray-400'>
                                R$ {formatNumber(provider.ggr)}
                              </TableCell>
                            </>
                          )}
                          <TableCell className='text-theme-sm cursor-default justify-center px-4 py-3 text-center text-gray-500 dark:text-gray-400'>
                            {gameProvider ? (
                              <Switch
                                labelClassName='justify-center'
                                key={openConfirm ? 'open' : 'closed'}
                                label=''
                                color={gameProvider.status ? 'blue' : 'gray'}
                                defaultChecked={!!gameProvider.status}
                                onChange={() => {
                                  setSelectedItem(gameProvider)
                                  setOpenConfirm(true)
                                }}
                              />
                            ) : (
                              <span className='text-gray-400'>N/A</span>
                            )}
                          </TableCell>
                          {providers.length > 0 && (
                            <TableCell className='text-center p-2'>
                              <Button
                                size='sm'
                                variant='outline'
                                onClick={() => {
                                  router.push(`/game-providers/${type}/${provider.code}`)
                                }}
                              >
                                View Games
                              </Button>
                            </TableCell>
                          )}
                        </TableRow>
                      )
                    })
                  ) : (
                    gameProviders &&
                    gameProviders.length > 0 &&
                    gameProviders.map((gameProvider) => {
                      return (
                      <TableRow key={gameProvider._id}>
                        <TableCell className='text-theme-sm w-[10%] px-5 py-3 text-center text-gray-500 dark:text-gray-400'>
                          <div className='flex items-center justify-center gap-3'>
                            <div className='min-h-12 min-w-12 overflow-hidden rounded-full'>
                              {gameProvider.banner && (
                                <Image
                                  width={50}
                                  height={50}
                                  src={gameProvider.banner}
                                  alt={gameProvider.name}
                                  className='!h-[50px] !w-[50px]'
                                />
                              )}
                            </div>
                            <div className='relative inline-block'>
                              <button
                                onClick={() =>
                                  toggleStatusDropdown(gameProvider._id)
                                }
                                className='dropdown-toggle flex items-center'
                              >
                                <MoreDotIcon className='text-gray-400 hover:text-gray-700 dark:hover:text-gray-300' />
                              </button>
                              <Dropdown
                                isOpen={openStatusDropdown === gameProvider._id}
                                onClose={() => setOpenStatusDropdown(null)}
                                className='w-auto p-2'
                              >
                                <DropdownItem
                                  onItemClick={() => {
                                    openProviderModal(gameProvider)
                                  }}
                                  className='flex w-full rounded-lg text-left font-normal whitespace-nowrap text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300'
                                >
                                  Edit
                                </DropdownItem>
                              </Dropdown>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className='text-theme-sm cursor-default px-4 py-3 text-left text-gray-500 dark:text-gray-400'>
                          <span
                            className='cursor-pointer hover:text-blue-700'
                            onClick={() => {
                              router.push(
                                `/game-providers/${type}/${gameProvider.code}`
                              )
                            }}
                          >
                            {gameProvider.code}
                          </span>
                        </TableCell>
                        <TableCell className='px-5 py-4 text-center text-gray-500 sm:px-6 dark:text-gray-400'>
                          {gameProvider.name}
                        </TableCell>
                        <TableCell className='px-5 py-4 text-center text-gray-500 sm:px-6 dark:text-gray-400'>
                          {gameProvider.type}
                        </TableCell>
                        <TableCell className='px-5 py-4 text-center text-gray-500 sm:px-6 dark:text-gray-400'>
                          {gameProvider?.countGames || 'N/A'}
                        </TableCell>
                        <TableCell className='text-theme-sm cursor-default justify-center px-4 py-3 text-center text-gray-500 dark:text-gray-400'>
                          <Switch
                            labelClassName='justify-center'
                            key={openConfirm ? 'open' : 'closed'}
                            label=''
                            color={gameProvider.status ? 'blue' : 'gray'}
                            defaultChecked={!!gameProvider.status}
                            onChange={() => {
                              setSelectedItem(gameProvider)
                              setOpenConfirm(true)
                            }}
                          />
                        </TableCell>
                      </TableRow>
                      )
                    })
                  )}

                  {(!providers || providers.length === 0) && (!gameProviders || gameProviders.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={providers && providers.length > 0 ? 11 : 7} className='text-center'>
                        <p className='py-2 text-gray-500 dark:text-gray-400'>
                          No providers found
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
              description={`The games of this provider will be ${selectedItem?.status ? 'disabled' : 'enabled'}`}
              handleConfirm={() => handleToggle(selectedItem)}
              handleClose={handleClose}
            />
            <GameProvidersDetailModal
              isOpen={openGameProviderDetailModal}
              closeModal={handleClose}
              detail={selectedItem}
              onSubmit={handleSubmitProvider}
            ></GameProvidersDetailModal>
          </div>
        </>
      )}
    </>
  )
}
