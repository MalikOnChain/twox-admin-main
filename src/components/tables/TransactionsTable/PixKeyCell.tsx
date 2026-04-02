import { toast } from 'sonner'

const PixKeyCell = ({ pixKey }: { pixKey: string }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(pixKey)
    toast.success('PIX Key copied to clipboard')
  }

  return (
    <button className='hover:text-brand-500' onClick={handleCopy}>
      {pixKey}
    </button>
  )
}

export default PixKeyCell
