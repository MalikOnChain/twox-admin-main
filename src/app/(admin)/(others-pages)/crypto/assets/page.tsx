'use client'

import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { getCryptoAssets } from '@/api/crypo'

import { cryptoMetrics } from '@/lib/crypto'

import Loading from '@/components/common/Loading'
import CryptoAssetsTable from '@/components/crypto/AssetsTable'
import MetricsCard from '@/components/metrics/MetricsCard'

const CryptoAssetsPage = () => {
  const [cryptoAssets, setCryptoAssets] = useState<CryptoWallet>({
    hasMore: false,
    items: [],
    limit: 10,
  })
  const [isLoading, setIsLoading] = useState(true)

  const getData = async () => {
    try {
      const response = await getCryptoAssets()
      setCryptoAssets(response)
      setIsLoading(false)
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Error')
      }
    }
  }

  useEffect(() => {
    getData()
  }, [])

  if (isLoading) return <Loading />

  // Calculate metrics from the actual data
  const availableBalance = cryptoMetrics.getAvailableBalance(cryptoAssets.items)
  const totalBalance = cryptoMetrics.getTotalBalance(cryptoAssets.items)
  const blockedAmount = cryptoMetrics.getBlockedAmount(cryptoAssets.items)
  const allocatedAmount = cryptoMetrics.getAllocatedAmount(cryptoAssets.items)

  return (
    <div className='space-y-6'>
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 xl:grid-cols-4'>
        <MetricsCard
          title='Available Balance'
          value={availableBalance}
          tooltipText='Funds available for transaction'
        />
        <MetricsCard
          title='Total Balance'
          value={totalBalance}
          tooltipText='The sum of available, AML-blocked and allocated funds'
        />
        <MetricsCard
          title='AML Blocked'
          value={blockedAmount}
          tooltipText='Funds marked as suspicious based on AML regulations'
        />
        <MetricsCard
          title='Allocated'
          value={allocatedAmount}
          tooltipText='Funds allocated to pending transaction requests'
        />
      </div>

      <CryptoAssetsTable rows={cryptoAssets.items} />
    </div>
  )
}

export default CryptoAssetsPage
