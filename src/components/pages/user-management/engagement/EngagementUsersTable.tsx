'use client'
import moment from 'moment'
import { useRouter } from 'next/navigation'

import { IEngagementUser } from '@/api/user-management'

import Pagination from '@/components/tables/Pagination'
import UserAvatar from '@/components/ui/avatar/UserAvatar'
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface EngagementUsersTableProps {
  users: IEngagementUser[]
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function EngagementUsersTable({
  users,
  currentPage,
  totalPages,
  onPageChange,
}: EngagementUsersTableProps) {
  const router = useRouter()

  return (
    <div className='mt-6'>
      <h3 className='mb-4 text-lg font-semibold text-gray-800 dark:text-white/90'>
        User Engagement Details
      </h3>
      <div className='overflow-x-auto'>
        <Table>
          <TableHeader>
            <TableRow className='text-white'>
              <TableCell isHeader>User</TableCell>
              <TableCell isHeader>Total Play Time</TableCell>
              <TableCell isHeader>Avg Session Length</TableCell>
              <TableCell isHeader>Sessions This Week</TableCell>
              <TableCell isHeader>Total Sessions</TableCell>
              <TableCell isHeader>Last Session</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className='text-center text-gray-500 dark:text-gray-400'>
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow
                  key={user._id}
                  className='cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50'
                  onClick={() => router.push(`/user-management/engagement?userId=${user._id}`)}
                >
                  <TableCell>
                    <div className='flex items-center gap-2'>
                      <UserAvatar
                        src={user.avatar || '/images/default-avatar.png'}
                        alt={user.username}
                        size='small'
                      />
                      <div>
                        <p className='font-medium text-gray-800 dark:text-white/90'>{user.username}</p>
                        <p className='text-xs text-gray-500 dark:text-gray-400'>{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className='text-center text-gray-500 dark:text-gray-400'>{user.totalPlayTime.toFixed(1)} min</TableCell>
                  <TableCell className='text-center text-gray-500 dark:text-gray-400'>{user.avgSessionLength.toFixed(1)} min</TableCell>
                  <TableCell className='text-center text-gray-500 dark:text-gray-400'>{user.sessionsThisWeek}</TableCell>
                  <TableCell className='text-center text-gray-500 dark:text-gray-400'>{user.totalSessions}</TableCell>
                  <TableCell className='text-center text-gray-500 dark:text-gray-400'>
                    {user.lastSession
                      ? moment(user.lastSession).format('MMM DD, YYYY HH:mm')
                      : 'Never'}
                  </TableCell>
                </TableRow>
              ))
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
    </div>
  )
}

