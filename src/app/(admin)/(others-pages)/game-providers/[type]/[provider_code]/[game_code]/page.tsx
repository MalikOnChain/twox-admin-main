'use client'

import { useParams } from 'next/navigation'

import GameDetailPage from '@/components/pages/casino-games/GameDetail'

const DetailPage = () => {
  const { type, game_code, provider_code } = useParams<{
    type: string
    game_code: string
    provider_code: string
  }>()

  return (
    <GameDetailPage
      game_code={game_code}
      backUrl={`/game-providers/${type}/${provider_code}`}
    />
  )
}

export default DetailPage
