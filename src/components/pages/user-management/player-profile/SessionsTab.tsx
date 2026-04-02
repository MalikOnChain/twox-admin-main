'use client'
import moment from 'moment'

import { IPlayerProfile } from '@/api/user-management'

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface SessionsTabProps {
  sessions: IPlayerProfile['data']['sessions']
}

export default function SessionsTab({ sessions }: SessionsTabProps) {
  return (
    <div className='space-y-4'>
      <div className='overflow-x-auto'>
        <Table>
          <TableHeader>
            <TableRow className='text-white'>
              <TableCell isHeader>IP Address</TableCell>
              <TableCell isHeader>Location</TableCell>
              <TableCell isHeader>Login Time</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sessions.slice(0, 10).map((session: any) => (
              <TableRow key={session._id} className='text-gray-500 dark:text-gray-400'>
                <TableCell className='text-center'>{session.ipAddress || 'N/A'}</TableCell>
                <TableCell className='text-center'>{session.location || 'N/A'}</TableCell>
                <TableCell className='text-center'>{moment(session.createdAt).format('MMM DD, YYYY HH:mm')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

