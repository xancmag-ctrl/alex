import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'
import { EmptyState } from '@/components/ui/misc'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <EmptyState
      icon={Compass}
      title="Página não encontrada"
      text="O endereço pode estar incorreto ou a página foi movida."
      action={
        <Button asChild size="sm">
          <Link to="/">Ir para o início</Link>
        </Button>
      }
    />
  )
}
