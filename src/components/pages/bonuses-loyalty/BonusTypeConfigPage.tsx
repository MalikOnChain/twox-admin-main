'use client'

import { useRouter } from 'next/navigation'
import { useState, useCallback, useEffect } from 'react'
import { toast } from 'sonner'

import { getBonuses } from '@/api/bonus'
import { getTiers } from '@/api/tier'
import { getCashbacks } from '@/api/cashback'
import { getAllWheelBonuses } from '@/api/wheelBonus'

import ComponentCard from '@/components/common/ComponentCard'
import Loading from '@/components/common/Loading'
import Button from '@/components/ui/button/Button'
import { PlusIcon } from '@/icons'

import { Bonus } from '@/types/bonus'
import { ITierData } from '@/types/tier'
import { ICashbackTableData } from '@/types/cashback'
import { WheelBonus } from '@/api/wheelBonus'

import BonusTable from '@/components/pages/bonus/BonusTable'
import CashbackTable from '@/components/pages/cashback/CashbackTable'
import CashbackDetailModal from '@/components/pages/cashback/CashbackDetailModal'
import WheelBonusTable from '@/components/pages/wheel-bonus/WheelBonusTable'
import WheelBonusSettingModal from '@/components/pages/wheel-bonus/WheelBonusSettingModal'
import BonusTypeConfigTable from '@/components/pages/bonuses-loyalty/bonus-type-config/BonusTypeConfigTable'
import BonusTypeConfigModal from '@/components/pages/bonuses-loyalty/bonus-type-config/BonusTypeConfigModal'
import { useModal } from '@/hooks/useModal'
import { createBonus, updateBonus, deleteBonus } from '@/api/bonus'

type BonusTypeTab = 'bonus-types' | 'bonuses' | 'cashback' | 'wheel-bonus'

export default function BonusTypeConfigPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<BonusTypeTab>('bonus-types')
  const [isLoading, setIsLoading] = useState(true)
  
  // Bonus Type Config state
  const [bonusTypeConfigBonuses, setBonusTypeConfigBonuses] = useState<Bonus[]>([])
  const [bonusTypeConfigPage, setBonusTypeConfigPage] = useState(1)
  const [bonusTypeConfigTotalPages, setBonusTypeConfigTotalPages] = useState(1)
  const [selectedBonusTypeConfig, setSelectedBonusTypeConfig] = useState<Bonus | null>(null)
  const bonusTypeConfigModal = useModal()

  // Bonuses state
  const [loyaltyTiers, setLoyaltyTiers] = useState<ITierData[]>([])
  const [bonusesPage, setBonusesPage] = useState(1)
  const [bonusesTotalPages, setBonusesTotalPages] = useState(1)
  const [bonuses, setBonuses] = useState<Bonus[]>([])
  const [selectedBonus, setSelectedBonus] = useState<Bonus | null>(null)
  const bonusModal = useModal()

  // Cashback state
  const [cashbackTableData, setCashbackTableData] = useState<ICashbackTableData>({
    cashbacks: [],
    tiers: [],
  })
  const [cashbackPage, setCashbackPage] = useState(1)
  const [cashbackTotalPages, setCashbackTotalPages] = useState(1)
  const [selectedCashback, setSelectedCashback] = useState<any>(null)
  const cashbackModal = useModal()

  // Wheel Bonus state
  type WheelBonusWithStringStatus = Omit<WheelBonus, 'status'> & {
    status: 'active' | 'inactive'
  }
  const convertToWheelBonusWithStringStatus = (
    wheelBonus: WheelBonus
  ): WheelBonusWithStringStatus => ({
    ...wheelBonus,
    status: wheelBonus.status ? 'active' : 'inactive',
  })
  const [wheelBonuses, setWheelBonuses] = useState<WheelBonusWithStringStatus[]>([])
  const [wheelBonusPage, setWheelBonusPage] = useState(1)
  const [wheelBonusTotalPages, setWheelBonusTotalPages] = useState(1)
  const [selectedWheelBonus, setSelectedWheelBonus] = useState<WheelBonusWithStringStatus | null>(null)
  const wheelBonusModal = useModal()

  const fetchBonuses = useCallback(async () => {
    try {
      const response = await getBonuses({
        page: bonusesPage,
        limit: 10,
        filter: '',
      })
      setBonusesTotalPages(response.pagination.totalPages)
      setBonuses(response.rows)
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      }
    }
  }, [bonusesPage])

  const fetchCashbacks = useCallback(async () => {
    try {
      const response = await getCashbacks({
        page: cashbackPage,
        limit: 10,
        filter: '',
      })
      if (response.success) {
        setCashbackTableData(response.rows)
        setCashbackTotalPages(response.pagination.totalPages)
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      }
    }
  }, [cashbackPage])

  const fetchWheelBonuses = useCallback(async () => {
    try {
      const response = await getAllWheelBonuses()
      if (response.success && Array.isArray(response.data)) {
        setWheelBonuses(response.data.map(convertToWheelBonusWithStringStatus))
        setWheelBonusTotalPages(Math.ceil(response.data.length / 10))
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      }
    }
  }, [])

  const fetchLoyaltyTiers = useCallback(async () => {
    try {
      const response = await getTiers({
        page: 1,
        limit: -1,
      })
      setLoyaltyTiers(response.rows)
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      }
    }
  }, [])

  const fetchBonusTypeConfigBonuses = useCallback(async () => {
    try {
      const response = await getBonuses({
        page: bonusTypeConfigPage,
        limit: 10,
        filter: '',
      })
      setBonusTypeConfigTotalPages(response.pagination.totalPages)
      setBonusTypeConfigBonuses(response.rows)
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      }
    }
  }, [bonusTypeConfigPage])

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      await Promise.all([
        fetchLoyaltyTiers(),
        fetchBonuses(),
        fetchCashbacks(),
        fetchWheelBonuses(),
        fetchBonusTypeConfigBonuses(),
      ])
      setIsLoading(false)
    }
    loadData()
  }, [])

  useEffect(() => {
    if (activeTab === 'bonus-types') {
      fetchBonusTypeConfigBonuses()
    } else if (activeTab === 'bonuses') {
      fetchBonuses()
    } else if (activeTab === 'cashback') {
      fetchCashbacks()
    } else if (activeTab === 'wheel-bonus') {
      fetchWheelBonuses()
    }
  }, [activeTab, bonusesPage, cashbackPage, wheelBonusPage, bonusTypeConfigPage])

  const handleEditBonus = (bonus: Bonus) => {
    setSelectedBonus(bonus)
    bonusModal.openModal()
  }

  const handleBonusSave = async (data: any) => {
    try {
      // Convert form data to bonus format
      const bonusData = {
        name: data.name,
        type: data.type,
        description: data.description || '',
        code: data.code || '',
        claimMethod: data.claimMethod,
        status: data.status,
        isVisible: data.isVisible,
        validFrom: new Date(data.validFrom),
        validTo: data.validTo ? new Date(data.validTo) : null,
        maxClaims: data.maxClaims || null,
        maxClaimsPerUser: data.maxClaimsPerUser || 1,
        imageUrl: data.imageUrl || undefined,
      }

      const defaultConfiguration = {
        eligibility: {
          eligibilityType: data.eligibilityType || 'all',
          isActive: true,
          vipTiers: data.vipTiers || [],
          allowedCountries: data.allowedCountries || [],
          excludedCountries: data.excludedCountries || [],
          minAccountAgeDays: data.minAccountAgeDays || undefined,
          requireDeposit: data.requireDeposit || false,
          firstDepositOnly: data.firstDepositOnly || false,
          minDepositAmountEligibility: data.minDepositAmountEligibility || undefined,
          kycRequired: data.kycRequired || false,
          emailVerifiedRequired: data.emailVerifiedRequired || false,
        },
        settings: {
          wageringSettings: {
            contributionRates: {
              slots: 1.0,
              tableGames: 0.1,
              liveGames: 0.1,
              crash: 0.8,
            },
            maxBetLimit: undefined,
            wageringTimeLimit: undefined,
          },
          timingSettings: {
            cooldownPeriod: undefined,
            claimWindow: undefined,
            autoExpiry: undefined,
          },
          stackingRules: {
            canStackWithOtherBonuses: false,
            maxStackingValue: undefined,
          },
          forfeitureRules: {
            forfeitOnWithdrawal: true,
            partialForfeitureAllowed: false,
          },
          withdrawalSettings: {
            maxCashoutMultiplier: undefined,
            minBalanceForWithdrawal: undefined,
          },
          notificationSettings: {
            sendClaimNotification: true,
            sendExpiryReminder: true,
            reminderHoursBefore: 24,
            sendProgressUpdates: false,
          },
        },
        tierRewards: [],
      }

      if (selectedBonus) {
        await updateBonus(selectedBonus._id, bonusData, defaultConfiguration)
        toast.success('Bonus updated successfully')
      } else {
        await createBonus(bonusData, defaultConfiguration)
        toast.success('Bonus created successfully')
      }
      await fetchBonuses()
      bonusModal.closeModal()
      setSelectedBonus(null)
      return true
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      }
      return false
    }
  }

  const handleEditCashback = (cashback: any) => {
    setSelectedCashback(cashback)
    cashbackModal.openModal()
  }

  const handleEditWheelBonus = (wheelBonus: WheelBonusWithStringStatus) => {
    setSelectedWheelBonus(wheelBonus)
    wheelBonusModal.openModal()
  }

  const handleWheelBonusSubmit = async (data: Omit<WheelBonusWithStringStatus, '_id'>) => {
    try {
      const { createWheelBonus, updateWheelBonus } = await import('@/api/wheelBonus')
      // The API expects status as string 'active' | 'inactive', which matches our data
      const convertedData: Omit<WheelBonus, '_id'> = {
        ...data,
        status: data.status,
      }
      if (selectedWheelBonus) {
        await updateWheelBonus(selectedWheelBonus._id, convertedData)
        toast.success('Wheel bonus updated successfully')
      } else {
        await createWheelBonus(convertedData)
        toast.success('Wheel bonus created successfully')
      }
      await fetchWheelBonuses()
      wheelBonusModal.closeModal()
      setSelectedWheelBonus(null)
      return true
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      }
      return false
    }
  }

  // Bonus Type Config handlers
  const handleBonusTypeConfigSave = async (data: any) => {
    try {
      // Convert form data to bonus format
      const bonusData = {
        name: data.name,
        type: data.type,
        description: data.description || '',
        code: data.code || '',
        claimMethod: data.claimMethod,
        status: data.status,
        isVisible: data.isVisible,
        validFrom: new Date(data.validFrom),
        validTo: data.validTo ? new Date(data.validTo) : null,
        maxClaims: data.maxClaims || null,
        maxClaimsPerUser: data.maxClaimsPerUser || 1,
        imageUrl: data.imageUrl || undefined,
      }

      const defaultConfiguration = {
        eligibility: {
          eligibilityType: 'all',
          isActive: true,
        },
        settings: {
          wageringSettings: {
            contributionRates: {
              slots: 1.0,
              tableGames: 0.1,
              liveGames: 0.1,
              crash: 0.8,
            },
          },
        },
        tierRewards: [],
      }

      if (selectedBonusTypeConfig) {
        await updateBonus(selectedBonusTypeConfig._id, bonusData, defaultConfiguration)
        toast.success('Bonus type updated successfully')
      } else {
        await createBonus(bonusData, defaultConfiguration)
        toast.success('Bonus type created successfully')
      }
      await fetchBonusTypeConfigBonuses()
      bonusTypeConfigModal.closeModal()
      setSelectedBonusTypeConfig(null)
      return true
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      }
      return false
    }
  }

  const handleBonusTypeConfigEdit = (bonus: Bonus) => {
    setSelectedBonusTypeConfig(bonus)
    bonusTypeConfigModal.openModal()
  }

  const handleBonusTypeConfigDuplicate = async (bonus: Bonus) => {
    try {
      const duplicatedBonus = {
        name: `${bonus.name} (Copy)`,
        type: bonus.type,
        description: bonus.description || '',
        code: bonus.code ? `${bonus.code}_copy` : '',
        claimMethod: bonus.claimMethod || 'manual',
        status: 'draft' as const,
        isVisible: bonus.isVisible !== undefined ? bonus.isVisible : true,
        validFrom: bonus.validFrom ? new Date(bonus.validFrom) : new Date(),
        validTo: bonus.validTo ? new Date(bonus.validTo) : null,
        maxClaims: bonus.maxClaims || null,
        maxClaimsPerUser: bonus.maxClaimsPerUser || 1,
      }
      const defaultConfiguration = {
        eligibility: {
          eligibilityType: 'all',
          isActive: true,
        },
        settings: {
          wageringSettings: {
            contributionRates: {
              slots: 1.0,
              tableGames: 0.1,
              liveGames: 0.1,
              crash: 0.8,
            },
          },
        },
        tierRewards: [],
      }
      await createBonus(duplicatedBonus, defaultConfiguration)
      toast.success('Bonus duplicated successfully')
      await fetchBonusTypeConfigBonuses()
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      }
    }
  }

  const handleBonusTypeConfigDisable = async (bonus: Bonus) => {
    try {
      const newStatus = bonus.status === 'active' ? 'inactive' : 'active'
      const defaultConfiguration = {
        eligibility: {
          eligibilityType: 'all',
          isActive: true,
        },
        settings: {
          wageringSettings: {
            contributionRates: {
              slots: 1.0,
              tableGames: 0.1,
              liveGames: 0.1,
              crash: 0.8,
            },
          },
        },
        tierRewards: [],
      }
      await updateBonus(bonus._id, { status: newStatus }, defaultConfiguration)
      toast.success(`Bonus ${newStatus === 'active' ? 'enabled' : 'disabled'} successfully`)
      await fetchBonusTypeConfigBonuses()
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      }
    }
  }

  const handleBonusTypeConfigArchive = async (bonus: Bonus) => {
    try {
      const defaultConfiguration = {
        eligibility: {
          eligibilityType: 'all',
          isActive: true,
        },
        settings: {
          wageringSettings: {
            contributionRates: {
              slots: 1.0,
              tableGames: 0.1,
              liveGames: 0.1,
              crash: 0.8,
            },
          },
        },
        tierRewards: [],
      }
      await updateBonus(bonus._id, { status: 'expired' }, defaultConfiguration)
      toast.success('Bonus archived successfully')
      await fetchBonusTypeConfigBonuses()
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      }
    }
  }

  if (isLoading) {
    return <Loading />
  }

  return (
    <div className='space-y-6'>
      <ComponentCard title='Bonus Type Config'>
        {/* Tabs */}
        <div className='mb-6 border-b border-gray-200 dark:border-gray-700'>
          <nav className='-mb-px flex space-x-8'>
            {[
              { id: 'bonus-types' as BonusTypeTab, label: 'Bonus Types' },
              { id: 'bonuses' as BonusTypeTab, label: 'Bonuses' },
              { id: 'cashback' as BonusTypeTab, label: 'Cashback' },
              { id: 'wheel-bonus' as BonusTypeTab, label: 'Wheel Bonus' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium ${
                  activeTab === tab.id
                    ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Bonus Types Tab */}
        {activeTab === 'bonus-types' && (
          <div>
            <div className='mb-4 flex justify-end'>
              <Button
                onClick={() => {
                  setSelectedBonusTypeConfig(null)
                  bonusTypeConfigModal.openModal()
                }}
                size='xs'
              >
                <PlusIcon />
                Create Bonus Type
              </Button>
            </div>
            <BonusTypeConfigTable
              bonuses={bonusTypeConfigBonuses}
              totalPages={bonusTypeConfigTotalPages}
              page={bonusTypeConfigPage}
              setPage={setBonusTypeConfigPage}
              onEdit={handleBonusTypeConfigEdit}
              onDuplicate={handleBonusTypeConfigDuplicate}
              onDisable={handleBonusTypeConfigDisable}
              onArchive={handleBonusTypeConfigArchive}
            />
            <BonusTypeConfigModal
              isOpen={bonusTypeConfigModal.isOpen}
              onClose={() => {
                bonusTypeConfigModal.closeModal()
                setSelectedBonusTypeConfig(null)
              }}
              bonus={selectedBonusTypeConfig}
              onSave={handleBonusTypeConfigSave}
            />
          </div>
        )}

        {/* Bonuses Tab */}
        {activeTab === 'bonuses' && (
          <div>
            <div className='mb-4 flex justify-end'>
              <Button
                onClick={() => {
                  setSelectedBonus(null)
                  bonusModal.openModal()
                }}
                size='xs'
              >
                <PlusIcon />
                Add Bonus
              </Button>
            </div>
            <BonusTable
              bonuses={bonuses}
              totalPages={bonusesTotalPages}
              page={bonusesPage}
              loyaltyTiers={loyaltyTiers}
              setPage={setBonusesPage}
              isLoading={false}
              setIsLoading={() => {}}
              fetchBonuses={fetchBonuses}
              onEdit={handleEditBonus}
            />
            <BonusTypeConfigModal
              isOpen={bonusModal.isOpen}
              onClose={() => {
                bonusModal.closeModal()
                setSelectedBonus(null)
              }}
              bonus={selectedBonus}
              onSave={handleBonusSave}
            />
          </div>
        )}

        {/* Cashback Tab */}
        {activeTab === 'cashback' && (
          <div>
            {cashbackTableData.tiers.length > 0 ? (
              <>
                <div className='mb-4 flex justify-end gap-2'>
                  <Button onClick={cashbackModal.openModal} size='xs'>
                    <PlusIcon />
                    Add Cashback
                  </Button>
                  <Button
                    className='bg-gray-600'
                    size='xs'
                    onClick={() => router.push('/cashback/logs')}
                  >
                    Show cashback logs
                  </Button>
                </div>
                <CashbackTable
                  tableData={cashbackTableData}
                  totalPages={cashbackTotalPages}
                  page={cashbackPage}
                  setPage={setCashbackPage}
                  isLoading={false}
                  setIsLoading={() => {}}
                  fetchCashbacks={fetchCashbacks}
                  onEdit={handleEditCashback}
                  isEdit={false}
                  setIsEdit={() => {}}
                />
                <CashbackDetailModal
                  isOpen={cashbackModal.isOpen}
                  closeModal={cashbackModal.closeModal}
                  detail={selectedCashback}
                  setSelectedCashback={setSelectedCashback}
                  setIsEdit={() => {}}
                  tiers={cashbackTableData.tiers}
                />
              </>
            ) : (
              <div className='flex h-[200px] items-center justify-center'>
                <p className='text-gray-500 dark:text-gray-400'>
                  Please create tiers first to manage cashbacks
                </p>
              </div>
            )}
          </div>
        )}

        {/* Wheel Bonus Tab */}
        {activeTab === 'wheel-bonus' && (
          <div>
            <div className='mb-4 flex justify-end'>
              <Button onClick={wheelBonusModal.openModal} size='xs'>
                <PlusIcon />
                Add Wheel Bonus
              </Button>
            </div>
            <WheelBonusTable
              wheelBonuses={wheelBonuses}
              totalPages={wheelBonusTotalPages}
              page={wheelBonusPage}
              setPage={setWheelBonusPage}
              isLoading={false}
              setIsLoading={() => {}}
              fetchWheelBonuses={fetchWheelBonuses}
              onEdit={handleEditWheelBonus}
            />
            <WheelBonusSettingModal
              isOpen={wheelBonusModal.isOpen}
              closeModal={() => {
                wheelBonusModal.closeModal()
                setSelectedWheelBonus(null)
              }}
              selectedWheelBonus={selectedWheelBonus}
              onSubmit={handleWheelBonusSubmit}
            />
          </div>
        )}
      </ComponentCard>
    </div>
  )
}
