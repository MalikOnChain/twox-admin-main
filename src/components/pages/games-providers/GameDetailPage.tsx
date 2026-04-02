'use client'

import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

import { getGameDetail, IGameDetail, updateGameStatus } from '@/api/games-providers'

import ComponentCard from '@/components/common/ComponentCard'
import Loading from '@/components/common/Loading'
import GameDetailHeader from './game-detail/GameDetailHeader'
import FinancialSummaryCards from './game-detail/FinancialSummaryCards'
import DateRangeSelector from './game-detail/DateRangeSelector'
import RTPTrendChart from './game-detail/RTPTrendChart'
import BetHistogramChart from './game-detail/BetHistogramChart'
import RegionSplitChart from './game-detail/RegionSplitChart'

interface GameDetailPageProps {
  gameId: string
}

export default function GameDetailPage({ gameId }: GameDetailPageProps) {
  const [loading, setLoading] = useState(true)
  const [gameData, setGameData] = useState<IGameDetail | null>(null)
  const [days, setDays] = useState(30)

  const fetchGameDetail = useCallback(async () => {
    try {
      setLoading(true)
      const response = await getGameDetail(gameId, days)
      setGameData(response.data)
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message)
      } else {
        toast.error('Error fetching game detail')
      }
    } finally {
      setLoading(false)
    }
  }, [gameId, days])

  useEffect(() => {
    fetchGameDetail()
  }, [fetchGameDetail])

  const handleToggleStatus = useCallback(async () => {
    if (!gameData) return
    try {
      await updateGameStatus(gameId, {
        isEnabled: !gameData.game.isEnabled,
        status: !gameData.game.isEnabled ? 'active' : 'inactive',
      })
      toast.success(`Game ${!gameData.game.isEnabled ? 'enabled' : 'disabled'} successfully`)
      fetchGameDetail()
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message)
      } else {
        toast.error('Error updating game status')
      }
    }
  }, [gameData, gameId, fetchGameDetail])

  if (loading) {
    return <Loading />
  }

  if (!gameData) {
    return (
      <div className='space-y-6'>
        <ComponentCard title='Game Detail'>
          <p className='text-gray-500 dark:text-gray-400'>Game not found</p>
        </ComponentCard>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      <ComponentCard title='Game Detail'>
        <GameDetailHeader gameData={gameData} onToggleStatus={handleToggleStatus} />
        <FinancialSummaryCards financial={gameData.financial} />
        <DateRangeSelector days={days} onDaysChange={setDays} />
        <div className='space-y-6'>
          <RTPTrendChart rtpTrend={gameData.rtpTrend} />
          <BetHistogramChart betHistogram={gameData.betHistogram} />
          <RegionSplitChart regionSplit={gameData.regionSplit} />
        </div>
      </ComponentCard>
    </div>
  )
}

