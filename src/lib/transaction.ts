import moment from 'moment'

export const TRANSACTION_COLUMNS = {
  game: [
    {
      id: 'time',
      label: 'Time',
      col: 3,
      render: (item) => moment(item.time).format('YYYY-MM-DD HH:mm:ss'),
    },
    { id: 'category', label: 'Game', col: 2, render: (item) => item.category },
    {
      id: 'betAmount',
      label: 'Bet',
      col: 2,
      render: (item) => Number(item.betAmount).toFixed(2),
    },
    {
      id: 'winAmount',
      label: 'Payout',
      col: 2,
      render: (item) => Number(item.winAmount).toFixed(2),
    },
    {
      id: 'userBalance.before',
      label: 'Before Transaction',
      col: 2,
      render: (item) => Number(item.userBalance.before).toFixed(2),
    },
    {
      id: 'userBalance.after',
      label: 'After Transaction',
      col: 2,
      render: (item) => Number(item.userBalance.after).toFixed(2),
    },
    { id: 'status', label: 'Status', col: 2, render: (item) => item.status },
  ],
  crypto: [
    {
      id: 'time',
      label: 'Time',
      col: 2,
      render: (item) => moment(item.time).format('YYYY-MM-DD HH:mm:ss'),
    },
    { id: 'type', label: 'Type', col: 2, render: (item) => item.type },
    {
      id: 'userBalance.before',
      label: 'Before Balance',
      col: 2,
      render: (item) => Number(item.userBalance.before).toFixed(2),
    },
    {
      id: 'userBalance.after',
      label: 'After Balance',
      col: 2,
      render: (item) => Number(item.userBalance.after).toFixed(2),
    },
    {
      id: 'amount',
      label: 'Amount',
      col: 2,
      render: (item) => Number(item.amount).toFixed(2),
    },
    { id: 'unit', label: 'Currency', col: 2, render: (item) => item.unit },
    {
      id: 'transactionId',
      label: 'Transaction ID',
      col: 2,
      render: (item) => item.transactionId,
    },
    {
      id: 'transactionHash',
      label: 'Transaction Hash',
      col: 2,
      render: (item) => item.transactionHash,
    },
    {
      id: 'blockchain',
      label: 'Blockchain',
      col: 2,
      render: (item) => item.blockchain,
    },
    { id: 'network', label: 'Network', col: 2, render: (item) => item.network },
    { id: 'status', label: 'Status', col: 2, render: (item) => item.status },
  ],
  pix: [
    {
      id: 'time',
      label: 'Time',
      col: 2,
      render: (item) => moment(item.time).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      id: 'type',
      label: 'Type',
      col: 3,
      render: (item) => PIX_TYPES[item.type],
    },
    {
      id: 'amount',
      label: 'Amount',
      col: 2,
      render: (item) => Number(item.amount).toFixed(2),
    },
    {
      id: 'status',
      label: 'Status',
      col: 2,
      render: (item) => PIX_STATUSES[item.status],
    },
  ],
  service: [
    {
      id: 'time',
      label: 'Time',
      col: 2,
      render: (item) => moment(item.time).format('YYYY-MM-DD HH:mm:ss'),
    },
    { id: 'type', label: 'Type', col: 3, render: (item) => item.type },
    {
      id: 'amount',
      label: 'Amount',
      col: 2,
      render: (item) => Number(item.amount).toFixed(2),
    },
    { id: 'status', label: 'Status', col: 2, render: (item) => item.status },
    {
      id: 'userBalance.before',
      label: 'Before Balance',
      col: 3,
      render: (item) => Number(item.userBalance.before).toFixed(2),
    },
    {
      id: 'userBalance.after',
      label: 'After Balance',
      col: 3,
      render: (item) => Number(item.userBalance.after).toFixed(2),
    },
  ],
}

export enum TRANSACTION_TYPES {
  GAME = 'game',
  CRYPTO = 'crypto',
  PIX = 'pix',
  SERVICE = 'service',
}
export const TRANSACTION_TABS = [
  {
    label: 'Game History',
    value: TRANSACTION_TYPES.GAME,
  },
  // {
  //   label: 'Crypto Transaction',
  //   value: TRANSACTION_TYPES.CRYPTO,
  // },
  {
    label: 'PIX Transaction',
    value: TRANSACTION_TYPES.PIX,
  },
  {
    label: 'Service Transaction',
    value: TRANSACTION_TYPES.SERVICE,
  },
]

export const PIX_TYPES = {
  transaction: 'DEPOSIT',
  withdrawal: 'WITHDRAWAL',
  deposit: 'DEPOSIT',
}

export const PIX_STATUSES = [
  'PENDING',
  'COMPLETED',
  'REJECTED',
  'EXPIRED',
  'REFUNDED',
  'WAITING',
]
