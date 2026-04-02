'use client'

import React from 'react'

import { ICONS } from '@/lib/crypto'

import ComponentCard from '@/components/common/ComponentCard'
import Badge from '@/components/ui/badge/Badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { ChevronDownIcon } from '@/icons'

const MainWalletAssetsTable = ({ rows }: { rows: MainWalletResponse[] }) => {
  const [expandedRows, setExpandedRows] = React.useState<string[]>([])

  const toggleRow = (network: string) => {
    setExpandedRows((prev) =>
      prev.includes(network)
        ? prev.filter((n) => n !== network)
        : [...prev, network]
    )
  }

  return (
    <ComponentCard title='Main Wallet Addresses'>
      <div className='overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]'>
        <div className='max-w-full overflow-x-auto'>
          <div className='min-w-[1102px]'>
            <Table>
              <TableHeader className='border-b border-gray-100 dark:border-white/[0.05]'>
                <TableRow>
                  <TableCell className='text-theme-xs px-5 py-3 text-left font-medium text-gray-500 dark:text-gray-400'>
                    Wallet Address
                  </TableCell>
                  <TableCell className='text-theme-xs px-5 py-3 text-left font-medium text-gray-500 dark:text-gray-400'>
                    Blockchain
                  </TableCell>
                  <TableCell className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'>
                    Assets
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody className='divide-y divide-gray-100 dark:divide-white/[0.05]'>
                {rows.map((asset) => {
                  const Icon = ICONS[asset.network as keyof typeof ICONS]
                  const isExpanded = expandedRows.includes(asset.network)
                  return (
                    <React.Fragment key={asset.network}>
                      <TableRow>
                        <TableCell className='px-5 py-4 text-left'>
                          <div className='flex items-center gap-2'>
                            <span
                              className='text-theme-xs cursor-pointer text-gray-500 dark:text-gray-400'
                              onClick={() => toggleRow(asset.network)}
                            >
                              <ChevronDownIcon
                                className={`transform transition-transform ${
                                  isExpanded ? 'rotate-180' : ''
                                }`}
                              />
                            </span>
                            <span className='text-sm font-medium text-gray-900 dark:text-white'>
                              {asset.walletAddress}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell className='px-5 py-4 text-center'>
                          <div className='flex items-center justify-start space-x-2'>
                            {Icon && (
                              <Icon style={{ width: '24px', height: '24px' }} />
                            )}
                            <span className='text-sm font-medium text-gray-900 uppercase dark:text-white'>
                              {asset.network}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell className='px-5 py-4 text-center'>
                          <div className='flex flex-col'>
                            <span className='text-sm font-medium text-gray-900 dark:text-white'>
                              {asset.data.item.assets.length}
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                      {isExpanded && (
                        <TableRow className='bg-black'>
                          <TableCell colSpan={3}>
                            <Table className=''>
                              <TableHeader className='border-b border-gray-100 dark:border-white/[0.05]'>
                                <TableRow>
                                  <TableCell
                                    isHeader
                                    className='text-theme-xs px-5 py-3 text-left font-medium text-gray-500 dark:text-gray-400'
                                  >
                                    Network
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
                                    Symbol
                                  </TableCell>
                                  <TableCell
                                    isHeader
                                    className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                                  >
                                    Available Amount
                                  </TableCell>
                                  <TableCell
                                    isHeader
                                    className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                                  >
                                    Allocated Amount
                                  </TableCell>
                                  <TableCell
                                    isHeader
                                    className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                                  >
                                    Total Amount
                                  </TableCell>
                                </TableRow>
                              </TableHeader>
                              <TableBody className='divide-y divide-gray-100 dark:divide-white/[0.05]'>
                                {asset.data.item.assets.length > 0 ? (
                                  asset.data.item.assets.map((asset) => (
                                    <TableRow key={asset.assetId}>
                                      <TableCell className='bg-gray-50 px-5 py-4 text-black dark:bg-white/[0.02] dark:text-gray-400'>
                                        <p className='text-sm text-gray-500 dark:text-gray-400'>
                                          {asset.network}
                                        </p>
                                      </TableCell>
                                      <TableCell className='bg-gray-50 px-5 py-4 text-center text-black dark:bg-white/[0.02] dark:text-gray-400'>
                                        <p className='text-sm text-gray-500 dark:text-gray-400'>
                                          {asset.type}
                                        </p>
                                      </TableCell>
                                      <TableCell className='bg-gray-50 px-5 py-4 text-center text-black dark:bg-white/[0.02] dark:text-gray-400'>
                                        <Badge>{asset.symbol}</Badge>
                                      </TableCell>
                                      <TableCell className='bg-gray-50 px-5 py-4 text-center text-black dark:bg-white/[0.02] dark:text-gray-400'>
                                        <div className='flex flex-col'>
                                          <span className='text-sm font-medium text-gray-900 dark:text-white'>
                                            $
                                            {(
                                              parseFloat(
                                                asset.assetData.availableAmount
                                              ) *
                                              parseFloat(asset.exchange_rate)
                                            ).toFixed(2)}
                                          </span>
                                          <span className='text-xs text-gray-500 dark:text-gray-400'>
                                            {asset.assetData.availableAmount}{' '}
                                            {asset.symbol}
                                          </span>
                                        </div>
                                      </TableCell>
                                      <TableCell className='bg-gray-50 px-5 py-4 text-center text-black dark:bg-white/[0.02] dark:text-gray-400'>
                                        <div className='flex flex-col'>
                                          <span className='text-sm font-medium text-gray-900 dark:text-white'>
                                            $
                                            {(
                                              parseFloat(
                                                asset.assetData.allocatedAmount
                                              ) *
                                              parseFloat(asset.exchange_rate)
                                            ).toFixed(2)}
                                          </span>
                                          <span className='text-xs text-gray-500 dark:text-gray-400'>
                                            {asset.assetData.allocatedAmount}{' '}
                                            {asset.symbol}
                                          </span>
                                        </div>
                                      </TableCell>
                                      <TableCell className='bg-gray-50 px-5 py-4 text-center text-black dark:bg-white/[0.02] dark:text-gray-400'>
                                        <div className='flex flex-col'>
                                          <span className='text-sm font-medium text-gray-900 dark:text-white'>
                                            $
                                            {(
                                              parseFloat(
                                                asset.assetData.totalAmount
                                              ) *
                                              parseFloat(asset.exchange_rate)
                                            ).toFixed(2)}
                                          </span>
                                          <span className='text-xs text-gray-500 dark:text-gray-400'>
                                            {asset.assetData.totalAmount}{' '}
                                            {asset.symbol}
                                          </span>
                                        </div>
                                      </TableCell>
                                    </TableRow>
                                  ))
                                ) : (
                                  <TableRow>
                                    <TableCell
                                      colSpan={6}
                                      className='px-5 py-4 text-center'
                                    >
                                      <p className='text-sm text-gray-500 dark:text-gray-400'>
                                        No assets found
                                      </p>
                                    </TableCell>
                                  </TableRow>
                                )}
                              </TableBody>
                            </Table>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  )
                })}

                {rows.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className='px-5 py-4 text-center text-sm text-gray-500'
                    >
                      No assets found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </ComponentCard>
  )
}

export default MainWalletAssetsTable
