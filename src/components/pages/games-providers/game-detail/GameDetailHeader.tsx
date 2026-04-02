'use client'

import { useRouter } from 'next/navigation'
import { IGameDetail } from '@/api/games-providers'
import Button from '@/components/ui/button/Button'
import Badge from '@/components/ui/badge/Badge'
import Switch from '@/components/form/switch/Switch'

interface GameDetailHeaderProps {
  gameData: IGameDetail
  onToggleStatus: () => void
}

export default function GameDetailHeader({
  gameData,
  onToggleStatus,
}: GameDetailHeaderProps) {
  const router = useRouter()

  return (
    <div className='mb-6 flex items-center justify-between'>
      <div className='flex items-center gap-4'>
        <Button
          size='sm'
          variant='outline'
          onClick={() => router.push('/games-providers/games')}
        >
          ← Back
        </Button>
        {gameData.game.image && (
          <img
            src={gameData.game.image}
            alt={gameData.game.name}
            className='h-16 w-16 rounded object-cover'
          />
        )}
        <div>
          <h2 className='text-xl font-semibold text-gray-800 dark:text-white/90'>
            {gameData.game.name}
          </h2>
          <p className='text-sm text-gray-500 dark:text-gray-400'>
            {gameData.game.providerName} • RTP: {gameData.game.rtp}%
          </p>
        </div>
      </div>
      <div className='flex items-center gap-3'>
        <Badge
          size='sm'
          color={gameData.game.isEnabled && gameData.game.status === 'active' ? 'success' : 'error'}
        >
          {gameData.game.isEnabled && gameData.game.status === 'active' ? 'Active' : 'Inactive'}
        </Badge>
        <Switch
          label={gameData.game.isEnabled ? 'Enabled' : 'Disabled'}
          defaultChecked={gameData.game.isEnabled}
          onChange={onToggleStatus}
        />
      </div>
    </div>
  )
}

