import Image from 'next/image'
import React, { memo } from 'react'

interface UserAvatarProps {
  className?: string
  size?: 'small' | 'medium' | 'large' | 'xlarge'
  src: string
  alt: string
  status?: 'online' | 'offline' | 'busy' | 'none'
  onClick?: () => void
}

const sizeClasses = {
  small: 'w-6 h-6',
  medium: 'w-8 h-8',
  large: 'w-10 h-10',
  xlarge: 'w-20 h-20',
}

const statusSizeClasses = {
  small: 'w-2 h-2',
  medium: 'w-2.5 h-2.5',
  large: 'w-3 h-3',
  xlarge: 'w-4 h-4',
}

const statusColorClasses = {
  online: 'bg-success-500',
  offline: 'bg-error-400',
  busy: 'bg-warning-500',
}

const UserAvatar = ({
  className,
  size,
  src,
  alt,
  status,
  onClick,
}: UserAvatarProps) => {
  return (
    <div
      className={`relative rounded-full ${sizeClasses[size]} ${className}`}
      onClick={() => {
        if (onClick && typeof onClick === 'function') {
          onClick()
        }
      }}
    >
      <Image
        width={0}
        height={0}
        sizes='100vw'
        src={src}
        alt={alt}
        className='h-full w-full rounded-full'
      />
      {status && (
        <span
          className={`absolute right-0 bottom-0 rounded-full border-[1.5px] border-white dark:border-gray-900 ${statusSizeClasses[size]} ${statusColorClasses[status] || ''}`}
        ></span>
      )}
    </div>
  )
}

export default memo(UserAvatar)
