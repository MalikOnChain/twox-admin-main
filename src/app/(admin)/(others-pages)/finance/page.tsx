import MainGGRStats from '@/components/ecommerce/MainGGRStats'
import FtdWidget from '@/components/metrics/FtdWidget'
import FtdTransactionsList from '@/components/pages/first-time-deposit/FtdTransactionsList'

const Finance = () => {
  return (
    <div className='grid grid-cols-12 gap-4 md:gap-6'>
      <div className='col-span-12'>
        <MainGGRStats />
      </div>

      <div className='col-span-12'>
        <FtdWidget />
      </div>

      <div className='col-span-12'>
        <FtdTransactionsList />
      </div>
    </div>
  )
}

export default Finance
