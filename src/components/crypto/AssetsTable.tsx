'use client'

import React from 'react'

import { ICONS } from '@/lib/crypto'

import ComponentCard from '@/components/common/ComponentCard'
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const CryptoAssetsTable = ({ rows }: { rows: CryptoAsset[] }) => {
  return (
    <ComponentCard title='Crypto Assets'>
      <div className='overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]'>
        <div className='max-w-full overflow-x-auto'>
          <div className='min-w-[1102px]'>
            <Table>
              <TableHeader className='border-b border-gray-100 dark:border-white/[0.05]'>
                <TableRow>
                  <TableCell className='text-theme-xs px-5 py-3 text-left font-medium text-gray-500 dark:text-gray-400'>
                    Assets
                  </TableCell>
                  <TableCell className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'>
                    Available Balance
                  </TableCell>
                  <TableCell className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'>
                    Total Balance
                  </TableCell>
                  <TableCell className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'>
                    AML-Blocked
                  </TableCell>
                  <TableCell className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'>
                    Allocated
                  </TableCell>
                </TableRow>
              </TableHeader>

              <TableBody className='divide-y divide-gray-100 dark:divide-white/[0.05]'>
                {rows.map((asset) => {
                  const Icon = ICONS[asset.blockchain as keyof typeof ICONS]
                  return (
                    <TableRow key={asset.id}>
                      <TableCell className='px-5 py-4 text-left'>
                        <div className='flex items-center justify-start space-x-2'>
                          {Icon && (
                            <Icon style={{ width: '24px', height: '24px' }} />
                          )}
                          <span className='text-sm font-medium text-gray-900 dark:text-white'>
                            {asset.symbol} ({asset.blockchain})
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className='px-5 py-4 text-center'>
                        <div className='flex flex-col'>
                          <span className='text-sm font-medium text-gray-900 dark:text-white'>
                            $
                            {(
                              parseFloat(asset.availableAmount) *
                              parseFloat(asset.exchangeRate)
                            ).toFixed(2)}
                          </span>
                          <span className='text-xs text-gray-500 dark:text-gray-400'>
                            {asset.availableAmount} {asset.symbol}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className='px-5 py-4 text-center'>
                        <div className='flex flex-col'>
                          <span className='text-sm font-medium text-gray-900 dark:text-white'>
                            $
                            {(
                              parseFloat(asset.totalAmount) *
                              parseFloat(asset.exchangeRate)
                            ).toFixed(2)}
                          </span>
                          <span className='text-xs text-gray-500 dark:text-gray-400'>
                            {asset.totalAmount} {asset.symbol}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className='px-5 py-4 text-center'>
                        <div className='flex flex-col'>
                          <span className='text-sm font-medium text-gray-900 dark:text-white'>
                            $
                            {(
                              parseFloat(asset.blockedAmount) *
                              parseFloat(asset.exchangeRate)
                            ).toFixed(2)}
                          </span>
                          <span className='text-xs text-gray-500 dark:text-gray-400'>
                            {asset.blockedAmount} {asset.symbol}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className='px-5 py-4 text-center'>
                        <div className='flex flex-col'>
                          <span className='text-sm font-medium text-gray-900 dark:text-white'>
                            $
                            {(
                              parseFloat(asset.allocatedAmount) *
                              parseFloat(asset.exchangeRate)
                            ).toFixed(2)}
                          </span>
                          <span className='text-xs text-gray-500 dark:text-gray-400'>
                            {asset.allocatedAmount} {asset.symbol}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
                {rows.length === 0 && (
                  <TableRow>
                    <td
                      colSpan={5}
                      className='px-5 py-4 text-center text-sm text-gray-500'
                    >
                      No assets found
                    </td>
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

export default CryptoAssetsTable
