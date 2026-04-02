import Badge from '@/components/ui/badge/Badge'

const KnownInfo = ({
  text,
  size = 'sm',
}: {
  text: string
  size?: 'sm' | 'md'
}) => {
  return (
    <Badge size={size} color='success'>
      {text}
    </Badge>
  )
}

export default KnownInfo
