import { useSearchParams } from 'react-router-dom'
import { ListChecks, ShoppingCart, Timer as TimerIcon, NotebookPen } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Segmented } from '@/components/ui/misc'
import { Checklist } from './tools/Checklist'
import { ShoppingList } from './tools/ShoppingList'
import { Timer } from './tools/Timer'
import { Journal } from './tools/Journal'

type ToolId = 'checklist' | 'compras' | 'timer' | 'diario'

const TOOLS = [
  { value: 'checklist' as const, label: 'Checklist', icon: ListChecks, subtitle: 'Quatro hábitos simples para o seu dia.' },
  { value: 'compras' as const, label: 'Compras', icon: ShoppingCart, subtitle: 'Sua lista, organizada por receita.' },
  { value: 'timer' as const, label: 'Timer', icon: TimerIcon, subtitle: 'Acompanhe um período definido por você.' },
  { value: 'diario' as const, label: 'Diário', icon: NotebookPen, subtitle: 'Registre refeições, fome e como você se sentiu.' },
]

export default function Tools() {
  const [params, setParams] = useSearchParams()
  const t = (params.get('t') as ToolId) || 'checklist'
  const current = TOOLS.find((x) => x.value === t) ?? TOOLS[0]

  return (
    <div className="animate-fade-in">
      <PageHeader title="Ferramentas" subtitle={current.subtitle} />
      <Segmented
        label="Ferramentas"
        value={current.value}
        onChange={(v) => setParams({ t: v }, { replace: true })}
        options={TOOLS}
        className="mb-6 lg:max-w-xl"
      />
      <div key={current.value} className="animate-fade-in">
        {current.value === 'checklist' && <Checklist />}
        {current.value === 'compras' && <ShoppingList />}
        {current.value === 'timer' && <Timer />}
        {current.value === 'diario' && <Journal />}
      </div>
    </div>
  )
}
