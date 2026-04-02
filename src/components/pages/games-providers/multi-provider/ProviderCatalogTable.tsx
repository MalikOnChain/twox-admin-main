'use client'

import { IProviderCatalogItem } from '@/api/games-providers'
import { formatNumber } from '@/lib/utils'
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import Badge from '@/components/ui/badge/Badge'
import Button from '@/components/ui/button/Button'
import Pagination from '@/components/tables/Pagination'

interface ProviderCatalogTableProps {
  catalog: IProviderCatalogItem[]
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  onViewProvider: (code: string) => void
  onViewGames: (code: string) => void
}

export default function ProviderCatalogTable({
  catalog,
  currentPage,
  totalPages,
  onPageChange,
  onViewProvider,
  onViewGames,
}: ProviderCatalogTableProps) {
  return (
    <>
      <div className='overflow-x-auto'>
        <Table>
          <TableHeader>
            <TableRow className='text-white'>
              <TableCell isHeader>Provider</TableCell>
              <TableCell isHeader>Verticals</TableCell>
              <TableCell isHeader>Status</TableCell>
              <TableCell isHeader>Live Games</TableCell>
              <TableCell isHeader>Total Games</TableCell>
              <TableCell isHeader>GGR</TableCell>
              <TableCell isHeader>Fee %</TableCell>
              <TableCell isHeader>Actions</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {catalog.length > 0 ? (
              catalog.map((item, index) => (
                <TableRow
                  key={index}
                  className='text-gray-500 dark:text-gray-400'
                >
                  <TableCell className='font-medium text-gray-800 dark:text-white/90'>
                    {item.provider}
                  </TableCell>
                  <TableCell>
                    <div className='flex flex-wrap gap-1 justify-center'>
                      {item.verticals.map((vertical, vIndex) => (
                        <Badge key={vIndex} size='sm' color='primary'>
                          {vertical}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className='text-center'>
                    <Badge
                      size='sm'
                      color={item.status === 'active' ? 'success' : 'error'}
                    >
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className='text-center'>{item.liveGames}</TableCell>
                  <TableCell className='text-center'>{item.totalGames}</TableCell>
                  <TableCell className='text-center'>
                    R$ {formatNumber(item.ggr)}
                  </TableCell>
                  <TableCell className='text-center'>{item.feePercent}%</TableCell>
                  <TableCell className='text-center p-2'>
                    <div className='flex gap-2 justify-center'>
                      <Button
                        size='xs'
                        variant='outline'
                        onClick={() => onViewProvider(item.code)}
                      >
                        View Detail
                      </Button>
                      <Button
                        size='xs'
                        variant='outline'
                        onClick={() => onViewGames(item.code)}
                      >
                        View Games
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className='text-center text-gray-500 dark:text-gray-400'>
                  No providers found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {totalPages > 1 && (
        <div className='mt-4 flex justify-center'>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </>
  )
}

