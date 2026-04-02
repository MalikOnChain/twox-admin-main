import { useMemo } from 'react'

import { PIX_STATUSES } from '@/lib/transaction'

import Badge from '@/components/ui/badge/Badge'

const StatusCell = ({ item }: { item: CryptoTransaction }) => {
  const colors = useMemo(
    () => ['info', 'success', 'error', 'warning', 'error', 'info'],
    []
  )
  return (
    <Badge size='sm' color={colors[item.status]}>
      {PIX_STATUSES[item.status]}
    </Badge>
  )
}

export default StatusCell
