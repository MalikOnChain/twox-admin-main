'use client'

import { useRouter } from 'next/navigation'
import { IAnalytics } from '@/api/games-providers'
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import Badge from '@/components/ui/badge/Badge'

interface RTPDeviationTableProps {
  rtpDeviation: IAnalytics['rtpDeviation']
}

export default function RTPDeviationTable({
  rtpDeviation,
}: RTPDeviationTableProps) {
  const router = useRouter()

  return (
    <div className='mt-6'>
      <h3 className='mb-4 text-lg font-semibold text-gray-800 dark:text-white/90'>
        RTP Deviation
      </h3>
      <div className='overflow-x-auto'>
        <Table>
          <TableHeader>
            <TableRow className='text-white'>
              <TableCell isHeader>Game</TableCell>
              <TableCell isHeader>Provider</TableCell>
              <TableCell isHeader>Expected RTP</TableCell>
              <TableCell isHeader>Actual RTP</TableCell>
              <TableCell isHeader>Deviation</TableCell>
              <TableCell isHeader>Deviation %</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rtpDeviation && rtpDeviation.length > 0 ? (
              rtpDeviation.map((item, index) => (
                <TableRow
                  key={index}
                  className='cursor-pointer text-gray-500 dark:text-gray-400'
                  onClick={() => router.push(`/games-providers/games/${item.gameId}`)}
                >
                  <TableCell className='font-medium text-gray-800 dark:text-white/90'>
                    {item.name}
                  </TableCell>
                  <TableCell>
                    <Badge size='sm' color='primary'>
                      {item.provider}
                    </Badge>
                  </TableCell>
                  <TableCell className='text-center'>{item.expectedRTP.toFixed(2)}%</TableCell>
                  <TableCell className='text-center'>{item.actualRTP.toFixed(2)}%</TableCell>
                  <TableCell className='text-center'>
                    <Badge
                      size='sm'
                      color={Math.abs(item.deviation) < 2 ? 'success' : Math.abs(item.deviation) < 5 ? 'warning' : 'error'}
                    >
                      {item.deviation > 0 ? '+' : ''}
                      {item.deviation.toFixed(2)}%
                    </Badge>
                  </TableCell>
                  <TableCell className='text-center'>
                    {item.deviationPercent > 0 ? '+' : ''}
                    {item.deviationPercent.toFixed(2)}%
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className='text-center text-gray-500 dark:text-gray-400'>
                  No RTP deviation data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

