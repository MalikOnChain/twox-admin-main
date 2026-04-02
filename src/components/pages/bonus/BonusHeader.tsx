import { Gift } from 'lucide-react'

import { BonusStatus } from '@/lib/bonus'

import Badge from '@/components/ui/badge/Badge'

const BonusHeader = ({
  name,
  description,
  code,
  status,
}: {
  name: string
  description: string
  code: string
  status: BonusStatus
  icons: any
}) => {
  const getBadgeColor = (status: BonusStatus) => {
    switch (status) {
      case 'active':
        return 'success'
      case 'inactive':
        return 'error'
      case 'expired':
        return 'warning'
      default:
        return 'warning'
    }
  }

  return (
    <div className='rounded-2xl border-1 border-amber-100 bg-gradient-to-r p-8 text-white'>
      <div className='flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between'>
        <div>
          <div className='mb-2 flex items-center border-b-1 border-white pb-2'>
            <Gift />
            <h1 className='text-3xl font-bold'>{name}</h1>
          </div>
          <p className='mb-4 text-lg text-blue-100'>{description}</p>
          <div className='flex items-center gap-4'>
            <Badge size='sm' color={getBadgeColor(status)}>
              <span className='capitalize'>{status}</span>
            </Badge>
            <span className='rounded-full bg-white/20 px-3 py-1 text-sm font-medium'>
              {code}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BonusHeader
