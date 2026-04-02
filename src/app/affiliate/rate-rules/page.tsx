'use client'

import React, { useCallback, useEffect, useState } from 'react'

import ComponentCard from '@/components/common/ComponentCard'
import Loading from '@/components/common/Loading'
import RateAndRules from '@/components/pages/rate-rules'

const FriendsManagementPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const initialLoading = useCallback(async () => {
    setIsLoading(false)
  }, [])

  useEffect(() => {
    initialLoading()
  }, [initialLoading])

  if (isLoading) {
    return <Loading />
  }

  return (
    <ComponentCard title='Rate and Rules'>
      <RateAndRules />
    </ComponentCard>
  )
}

export default FriendsManagementPage
