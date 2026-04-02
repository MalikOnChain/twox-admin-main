'use client'

import { useParams } from 'next/navigation'

import GameDetailPage from '@/components/pages/casino-games/GameDetail'

const DetailPage = () => {
  const { game_code, provider_code } = useParams<{
    game_code: string
    provider_code: string
  }>()

  return (
    <GameDetailPage game_code={game_code} backUrl={`/games/${provider_code}`} />
  )
}

export default DetailPage
