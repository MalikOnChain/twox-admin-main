'use client'

import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

import {
  getCurrencyExposure,
  getLiquidityTrend,
  getWalletBalances,
  IWalletBalancesResponse,
} from '@/api/treasury'
import { formatNumber } from '@/lib/utils'

import ComponentCard from '@/components/common/ComponentCard'
import Loading from '@/components/common/Loading'
import Button from '@/components/ui/button/Button'

import TransferModal from './TransferModal'
import SettlementReportModal from './SettlementReportModal'
import WalletCards from './treasury/WalletCards'
import LiquidityTrendChart from './treasury/LiquidityTrendChart'
import CurrencyExposureChart from './treasury/CurrencyExposureChart'

export default function TreasuryPage() {
  const [loading, setLoading] = useState(true)
  const [walletData, setWalletData] = useState<IWalletBalancesResponse['data'] | null>(null)
  const [liquidityData, setLiquidityData] = useState<any>(null)
  const [exposureData, setExposureData] = useState<any>(null)
  const [showTransferModal, setShowTransferModal] = useState(false)
  const [showSettlementModal, setShowSettlementModal] = useState(false)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const [wallets, liquidity, exposure] = await Promise.all([
        getWalletBalances(),
        getLiquidityTrend(30),
        getCurrencyExposure(),
      ])
      setWalletData(wallets.data)
      setLiquidityData(liquidity.data)
      setExposureData(exposure.data)
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Error fetching treasury data')
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const formatCurrency = (amount: number, currency: string) => {
    if (currency === 'BRL' || currency === 'USD' || currency === 'EUR') {
      return `${currency} ${formatNumber(amount)}`
    }
    return `${formatNumber(amount)} ${currency}`
  }

  if (loading) {
    return <Loading />
  }

  return (
    <div className='space-y-6'>
      <ComponentCard title='Treasury Management'>
        {/* Wallets Section */}
        <WalletCards walletData={walletData} formatCurrency={formatCurrency} />

        {/* Liquidity Trend */}
        <LiquidityTrendChart liquidityData={liquidityData} />

        {/* Currency Exposure */}
        <CurrencyExposureChart exposureData={exposureData} formatCurrency={formatCurrency} />

        {/* Actions */}
        <div className='mt-6 flex gap-4'>
          <Button onClick={() => setShowTransferModal(true)}>Transfers</Button>
          <Button variant='outline' onClick={() => setShowSettlementModal(true)}>
            Settlement Report
          </Button>
        </div>
      </ComponentCard>

      {showTransferModal && (
        <TransferModal
          isOpen={showTransferModal}
          onClose={() => setShowTransferModal(false)}
          onSuccess={() => {
            setShowTransferModal(false)
            fetchData()
            toast.success('Transfer initiated successfully')
          }}
        />
      )}

      {showSettlementModal && (
        <SettlementReportModal
          isOpen={showSettlementModal}
          onClose={() => setShowSettlementModal(false)}
        />
      )}
    </div>
  )
}

