'use client'
import React from 'react'

import ComponentCard from '@/components/common/ComponentCard'
import Loading from '@/components/common/Loading'
import Pagination from '@/components/tables/Pagination'
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { IParticipant, IWagerRace, PRIZE_TYPE } from '@/types/wagerRace'

type ParticipantsTableProps = {
  participants: IParticipant[]
  isLoading: boolean
  totalPages: number
  page: number
  setPage: (page: number) => void
  wagerRace: IWagerRace
}

export default function ParticipantsTable({
  participants,
  isLoading,
  totalPages,
  page,
  wagerRace,
  setPage,
}: ParticipantsTableProps) {
  const getPrize = (participant: IParticipant, level: number) => {
    if (wagerRace?.prize.type === PRIZE_TYPE.FIXED) {
      return wagerRace?.prize.amounts[level]
    } else if (wagerRace?.prize.type === PRIZE_TYPE.PERCENTAGE) {
      return (participant.totalWagered * wagerRace.prize.amounts[level]) / 100
    }
  }
  return (
    <ComponentCard title={wagerRace?.title || ''} backUrl='/wager-race'>
      {isLoading ? (
        <Loading />
      ) : (
        <div className='overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]'>
          <div className='max-w-full overflow-x-auto'>
            <div className='min-w-[1102px]'>
              <Table>
                {/* Table Header */}
                <TableHeader className='border-b border-gray-100 dark:border-white/[0.05]'>
                  <TableRow>
                    <TableCell
                      isHeader
                      className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                    >
                      Rank
                    </TableCell>
                    <TableCell
                      isHeader
                      className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                    >
                      Username
                    </TableCell>
                    <TableCell
                      isHeader
                      className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                    >
                      Total Wagered Amount
                    </TableCell>
                    <TableCell
                      isHeader
                      className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                    >
                      Prize
                    </TableCell>
                  </TableRow>
                </TableHeader>

                {/* Table Body */}
                <TableBody className='divide-y divide-gray-100 dark:divide-white/[0.05]'>
                  {participants.length > 0 &&
                    participants.map((participant, index) => (
                      <TableRow key={participant.userId}>
                        <TableCell className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'>
                          {index * page + 1}
                        </TableCell>
                        <TableCell className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'>
                          {participant.username}
                        </TableCell>
                        <TableCell className='text-theme-sm cursor-default px-4 py-3 text-center text-gray-500 dark:text-gray-400'>
                          {participant.totalWagered}
                        </TableCell>
                        <TableCell className='text-theme-sm cursor-default px-4 py-3 text-center text-gray-500 dark:text-gray-400'>
                          {getPrize(participant, index)}
                        </TableCell>
                      </TableRow>
                    ))}
                  {participants.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className='text-center'>
                        <p className='py-2 text-gray-500 dark:text-gray-400'>
                          No data found
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
        </div>
      )}
    </ComponentCard>
  )
}
