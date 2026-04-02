'use client'

import { useState } from 'react'
import { toast } from 'sonner'

import { checkIP } from '@/api/site-settings'

import ComponentCard from '@/components/common/ComponentCard'
import Input from '@/components/form/input/InputField'
import Badge from '@/components/ui/badge/Badge'
import Button from '@/components/ui/button/Button'

type CheckResult = { ip: string; country: string | null; blocked: boolean }

export default function ClientGeoIPAdmin() {
  const [testIP, setTestIP] = useState('')
  const [testRes, setTestRes] = useState<CheckResult | null>()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const runTest = async () => {
    if (!testIP) return
    try {
      setIsLoading(true)
      const res = await checkIP(testIP)
      setTestRes(res)
      setTestIP('')
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || 'Failed to check GEO blocker')
      } else {
        toast.error('Failed to check GEO blocker')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ComponentCard
      title='Geo-IP Blocker checking'
      className='text-gray-800 dark:text-white/90'
    >
      <section className='4 rounded shadow-sm'>
        <h2 className='mb-2 font-semibold'>Test Any IP</h2>
        <div className='flex gap-2'>
          <Input
            type='text'
            placeholder='Enter IP'
            value={testIP}
            onChange={(e) => setTestIP(e.target.value)}
          />
          <Button size='sm' disabled={isLoading} onClick={runTest}>
            {isLoading ? 'Checking...' : 'Check'}
          </Button>
        </div>
        {testRes && (
          <p className='mt-2 flex gap-2'>
            IP: <Badge color='primary'>{testRes.ip}</Badge> | Country:{' '}
            <Badge color='info'>{testRes.country}</Badge> |
            <span className='flex items-center gap-1'>
              Status:{' '}
              {testRes.blocked ? (
                <Badge color='error'>Blocked</Badge>
              ) : (
                <Badge color='success'>Allowed </Badge>
              )}
            </span>
          </p>
        )}
      </section>
    </ComponentCard>
  )
}
