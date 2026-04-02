'use client'

import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { getCryptoMainWalletAssets } from '@/api/crypo'

import Loading from '@/components/common/Loading'
import MainWalletAssetsTable from '@/components/crypto/MainWalletAssetsTable'

const CryptoWalletPage = () => {
  const [mainWalletsData, setMainWalletsData] = useState<
    MainWalletResponse[] | null
  >(null)
  const [isLoading, setIsLoading] = useState(true)

  const getData = async () => {
    try {
      const response = await getCryptoMainWalletAssets()
      setMainWalletsData(response)
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

  if (isLoading || !mainWalletsData) return <Loading />

  return (
    <div className='space-y-6'>
      <MainWalletAssetsTable rows={mainWalletsData} />
    </div>
  )
}

export default CryptoWalletPage
