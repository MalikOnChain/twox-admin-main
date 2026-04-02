import Link from 'next/link'

import UserAvatar from '@/components/ui/avatar/UserAvatar'

const UserCell = ({ user }) => (
  <Link href={`/user-management/player-profile/${user._id}`} className='flex w-fit items-center gap-3'>
    <UserAvatar
      src={user.avatar}
      alt={user.username}
      size='large'
      status='online'
    />
    <p className='text-theme-sm font-medium text-gray-800 dark:text-white/90'>
      {user.username}
    </p>
  </Link>
)

export default UserCell
