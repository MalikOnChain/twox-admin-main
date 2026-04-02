'use client'
import { useParams } from 'next/navigation'
import PlayerProfilePage from '@/components/pages/user-management/PlayerProfilePage'

export default function PlayerProfile() {
  const params = useParams()
  const userId = params.userId as string
  return <PlayerProfilePage userId={userId} />
}

