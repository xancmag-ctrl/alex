import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react'
import { CheckCircle2, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

type Tone = 'success' | 'error'
interface ToastApi {
  show(message: string, tone?: Tone): void
}

const Ctx = createContext<ToastApi>({ show: () => {} })

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<{ id: number; message: string; tone: Tone } | null>(null)
  const timer = useRef<number>()
  const show = useCallback((message: string, tone: Tone = 'success') => {
    window.clearTimeout(timer.current)
    setToast({ id: Date.now(), message, tone })
    timer.current = window.setTimeout(() => setToast(null), 2600)
  }, [])
  const api = useMemo(() => ({ show }), [show])
  return (
    <Ctx.Provider value={api}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-[calc(88px+env(safe-area-inset-bottom))] z-[60] flex justify-center px-4 lg:bottom-8"
      >
        {toast && (
          <div
            key={toast.id}
            role="status"
            className={cn(
              'flex animate-fade-in items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-sm font-medium text-white shadow-soft',
            )}
          >
            {toast.tone === 'success' ? (
              <CheckCircle2 className="size-4 text-brand-100" />
            ) : (
              <AlertCircle className="size-4 text-red-300" />
            )}
            {toast.message}
          </div>
        )}
      </div>
    </Ctx.Provider>
  )
}

export const useToast = () => useContext(Ctx)
