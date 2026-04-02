import SystemHealthWidget from '@/components/ecommerce/SystemHealthWidget'

export default function SystemHealthPage() {
  return (
    <div className='grid grid-cols-12 gap-4 md:gap-6'>
      <div className='col-span-12'>
        <SystemHealthWidget />
      </div>
    </div>
  )
}

