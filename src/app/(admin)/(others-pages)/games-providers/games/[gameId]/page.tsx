'use client'

import { useParams } from 'next/navigation'
import GameDetailPage from '@/components/pages/games-providers/GameDetailPage'

export default function GameDetail() {
  const params = useParams()
  const gameId = params.gameId as string
  return <GameDetailPage gameId={gameId} />
}

