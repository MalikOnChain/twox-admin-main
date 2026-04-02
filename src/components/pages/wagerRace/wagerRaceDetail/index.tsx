'use client'
import moment from 'moment'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { getWagerRaceById } from '@/api/wagerRace'

import MetricsCard from '@/components/metrics/MetricsCard'
import ParticipantsTable from '@/components/pages/wagerRace/wagerRaceDetail/ParticipantsTable'

import { IParticipant, IWagerRace, PRIZE_TYPE } from '@/types/wagerRace'

export default function WagerRaceTable() {
  const { id } = useParams()
  const [wagerRace, setWagerRace] = useState<IWagerRace | null>(null)
  const [participants, setParticipants] = useState<IParticipant[]>([])
  const [totalPages, setTotalPages] = useState<number>(0)
  const [limit] = useState<number>(10)
  const [page, setPage] = useState<number>(1)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [remainingTime, setRemainingTime] = useState<string>('00:00:00')
  const [endTime, setEndTime] = useState<string>('')

  useEffect(() => {
    const fetchWagerRace = async () => {
      setIsLoading(true)
      try {
        const res = await getWagerRaceById({
          id: id as string,
          page,
          limit,
        })
        if (res.success) {
          setWagerRace(res.rows)
          setParticipants(res.options.participants)
          setTotalPages(res.pagination.totalPages)
          setPage(res.pagination.currentPage)
          setEndTime(res.rows.period.end)
        }
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message)
        }
      } finally {
        setIsLoading(false)
      }
    }
    fetchWagerRace()
  }, [id, page, limit])

  useEffect(() => {
    const _endTime = moment(endTime)
    const timerInterval = setInterval(() => {
      const now = moment()
      const duration = moment.duration(_endTime.diff(now))
      if (duration.asSeconds() <= 0) {
        clearInterval(timerInterval)
        setRemainingTime('00:00:00')
      } else if (duration.asDays() >= 1) {
        if (duration.days() === 1) {
          setRemainingTime(duration.days().toString() + ' day left')
        } else {
          setRemainingTime(duration.days().toString() + ' days left')
        }
      } else {
        setRemainingTime(
          duration.hours().toString().padStart(2, '0') +
            ':' +
            duration.minutes().toString().padStart(2, '0') +
            ':' +
            duration.seconds().toString().padStart(2, '0')
        )
      }
    }, 1000)
    return () => clearInterval(timerInterval)
  }, [remainingTime, endTime])

  const getTotalPrizePool = () => {
    if (wagerRace?.prize.type === PRIZE_TYPE.FIXED) {
      return wagerRace?.prize.amounts.reduce((acc, curr) => acc + curr, 0)
    } else if (wagerRace?.prize.type === PRIZE_TYPE.PERCENTAGE) {
      let pool = 0
      participants.forEach((participant, index) => {
        pool +=
          (participant.totalWagered * wagerRace.prize.amounts[index]) / 100
      })
      return pool
    }
  }

  return (
    <div className='space-y-6'>
      <div className='grid grid-cols-1 gap-4 md:gap-6 xl:grid-cols-3'>
        <MetricsCard
          title='Total participants'
          value={wagerRace?.participants?.users?.length || 0}
          tooltipText='Total number of participants'
        />

        <MetricsCard
          title='Total prize pool'
          value={getTotalPrizePool() || 0}
          tooltipText='Total prize pool'
        />

        <MetricsCard
          title='Time remaining'
          value={remainingTime}
          tooltipText='Time remaining in current race'
        />
      </div>
      <ParticipantsTable
        participants={participants}
        isLoading={isLoading}
        totalPages={totalPages}
        page={page}
        setPage={setPage}
        wagerRace={wagerRace}
      />
    </div>
  )
}
