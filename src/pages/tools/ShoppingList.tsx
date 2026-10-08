import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Check, Plus, ShoppingBasket, Trash2, X } from 'lucide-react'
import { useSession } from '@/contexts/AppContext'
import { useToast } from '@/components/ui/toast'
import { Button } from '@/components/ui/button'
import { Card, EmptyState, Skeleton } from '@/components/ui/misc'
import { Input } from '@/components/ui/input'
import { getRecipe } from '@/data/recipes'
import type { ShoppingItem } from '@/lib/types'
import { cn } from '@/lib/utils'

export function ShoppingList() {
  const { backend, user } = useSession()
  const toast = useToast()
  const [items, setItems] = useState<ShoppingItem[] | null>(null)
  const [error, setError] = useState(false)
  const [name, setName] = useState('')
  const [adding, setAdding] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    backend
      .listShopping(user.id)
      .then(setItems)
      .catch(() => setError(true))
  }, [backend, user.id])

  // Agrupa por receita de origem (itens manuais primeiro).
  const groups = useMemo(() => {
    const map = new Map<string, ShoppingItem[]>()
    for (const i of items ?? []) {
      const key = i.recipeSlug ?? ''
      map.set(key, [...(map.get(key) ?? []), i])
    }
    return [...map.entries()].sort(([a], [b]) => (a === '' ? -1 : b === '' ? 1 : 0))
  }, [items])

  const checkedIds = (items ?? []).filter((i) => i.checked).map((i) => i.id)

  async function add(e: FormEvent) {
    e.preventDefault()
    const value = name.trim()
    if (!value) return
    setAdding(true)
    try {
      const created = await backend.addShopping(user.id, [value])
      setItems((x) => [...(x ?? []), ...created])
      setName('')
      inputRef.current?.focus()
    } catch {
      toast.show('Não foi possível adicionar. Tente novamente.', 'error')
    } finally {
      setAdding(false)
    }
  }

  async function toggle(item: ShoppingItem) {
    setItems((x) => x!.map((i) => (i.id === item.id ? { ...i, checked: !i.checked } : i)))
    try {
      await backend.updateShopping(user.id, item.id, { checked: !item.checked })
    } catch {
      setItems((x) => x!.map((i) => (i.id === item.id ? item : i)))
      toast.show('Não foi possível salvar.', 'error')
    }
  }

  async function remove(ids: string[], message?: string) {
    const prev = items
    setItems((x) => x!.filter((i) => !ids.includes(i.id)))
    try {
      await backend.removeShopping(user.id, ids)
      if (message) toast.show(message)
    } catch {
      setItems(prev)
      toast.show('Não foi possível remover.', 'error')
    }
  }

  if (error) return <p className="py-10 text-center text-sm text-danger">Não foi possível carregar a lista. Recarregue a página.</p>

  return (
    <div className="mx-auto max-w-2xl">
      <form onSubmit={add} className="mb-5 flex gap-2">
        <Input
          ref={inputRef}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Adicionar item (ex.: tomate)"
          aria-label="Novo item"
          maxLength={120}
        />
        <Button type="submit" size="icon" className="h-12 w-12 shrink-0" loading={adding} aria-label="Adicionar item" disabled={!name.trim()}>
          {!adding && <Plus />}
        </Button>
      </form>

      {!items ? (
        <div className="space-y-2">
          <Skeleton className="h-12" />
          <Skeleton className="h-12" />
          <Skeleton className="h-12" />
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={ShoppingBasket}
          title="Sua lista está vazia"
          text="Adicione itens acima ou abra uma receita e toque em “Adicionar à lista de compras”."
          action={
            <Button asChild variant="outline" size="sm">
              <Link to="/receitas">Ver receitas</Link>
            </Button>
          }
        />
      ) : (
        <>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm text-ink-muted">
              {items.length - checkedIds.length} pendente{items.length - checkedIds.length === 1 ? '' : 's'} · {checkedIds.length} no carrinho
            </p>
            {checkedIds.length > 0 && (
              <Button variant="ghost" size="sm" onClick={() => remove(checkedIds, 'Itens marcados removidos')}>
                <Trash2 /> Limpar marcados
              </Button>
            )}
          </div>
          <div className="space-y-4">
            {groups.map(([slug, list]) => (
              <Card key={slug || 'manual'} className="overflow-hidden">
                <p className="border-b border-line bg-brand-50/40 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-ink-muted">
                  {slug ? getRecipe(slug)?.title ?? 'Receita' : 'Meus itens'}
                </p>
                <ul className="divide-y divide-line">
                  {list.map((item) => (
                    <li key={item.id} className="flex items-center">
                      <button
                        role="checkbox"
                        aria-checked={item.checked}
                        onClick={() => toggle(item)}
                        className="flex min-h-12 flex-1 items-center gap-3 px-4 py-2 text-left"
                      >
                        <span
                          className={cn(
                            'flex size-5 shrink-0 items-center justify-center rounded-md border-2',
                            item.checked ? 'border-brand-600 bg-brand-600 text-white' : 'border-[#C9D1CB]',
                          )}
                        >
                          {item.checked && <Check className="size-3.5" strokeWidth={3} />}
                        </span>
                        <span className={cn('text-[15px]', item.checked ? 'text-ink-subtle line-through' : 'text-ink')}>{item.name}</span>
                      </button>
                      <button
                        onClick={() => remove([item.id])}
                        aria-label={`Remover ${item.name}`}
                        className="mr-2 flex size-9 shrink-0 items-center justify-center rounded-lg text-ink-subtle hover:bg-red-50 hover:text-danger"
                      >
                        <X className="size-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
