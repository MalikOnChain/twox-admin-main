import { BaggageClaim, HandCoins, Star, UsersRound } from 'lucide-react'

const StatCard = ({
  title,
  value,
  subtitle,
  icon,
  color = 'blue',
}: {
  title: string
  value: string | number
  subtitle?: string
  icon?: React.ReactNode
  color?: 'blue' | 'green' | 'purple' | 'orange'
}) => {
  const colorClasses = {
    blue: 'bg-gradient-to-br from-blue-500 to-blue-600 text-white',
    green: 'bg-gradient-to-br from-green-500 to-green-600 text-white',
    purple: 'bg-gradient-to-br from-purple-500 to-purple-600 text-white',
    orange: 'bg-gradient-to-br from-orange-500 to-orange-600 text-white',
  }

  return (
    <div
      className={`${colorClasses[color]} transform rounded-xl p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
    >
      <div className='mb-2 flex items-center justify-between'>
        <h3 className='text-sm font-medium opacity-90'>{title}</h3>
        {icon && <span className='opacity-80'>{icon}</span>}
      </div>
      <div className='mb-1 text-2xl font-bold'>{value}</div>
      {subtitle && <div className='text-xs opacity-75'>{subtitle}</div>}
    </div>
  )
}

const BonusStatistics = ({
  claimsCount,
  maxClaimsPerUser,
  priority,
  defaultWageringMultiplier,
}: {
  claimsCount: number
  maxClaims: number
  maxClaimsPerUser: number
  priority: number
  defaultWageringMultiplier: number
  icons: any
}) => {
  return (
    <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
      <StatCard
        title='Claims Used'
        value={`${claimsCount}`}
        subtitle='Total claims'
        icon={<BaggageClaim />}
        color='blue'
      />
      <StatCard
        title='Per User Limit'
        value={maxClaimsPerUser}
        subtitle='Max per user'
        icon={<UsersRound />}
        color='green'
      />
      <StatCard
        title='Priority'
        value={priority}
        subtitle='Display order'
        icon={<Star />}
        color='purple'
      />
      <StatCard
        title='Wagering'
        value={`${defaultWageringMultiplier}x`}
        subtitle='Multiplier'
        icon={<HandCoins />}
        color='orange'
      />
    </div>
  )
}

export default BonusStatistics
