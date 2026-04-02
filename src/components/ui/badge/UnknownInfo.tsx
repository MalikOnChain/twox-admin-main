import Badge from '@/components/ui/badge/Badge'

const UnknownInfo = ({
  text,
  size = 'sm',
}: {
  text: string
  size?: 'sm' | 'md'
}) => {
  return (
    <Badge size={size} color='error'>
      {text}
    </Badge>
  )
}

export default UnknownInfo
