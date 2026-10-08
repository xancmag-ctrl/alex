import { forwardRef, useState, type InputHTMLAttributes } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Input } from '@/components/ui/input'

export const PasswordInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>((props, ref) => {
  const [show, setShow] = useState(false)
  return (
    <div className="relative">
      <Input ref={ref} type={show ? 'text' : 'password'} className="pr-12" {...props} />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute right-1 top-1 flex size-10 items-center justify-center rounded-lg text-ink-subtle hover:text-ink"
        aria-label={show ? 'Ocultar senha' : 'Mostrar senha'}
      >
        {show ? <EyeOff className="size-[18px]" /> : <Eye className="size-[18px]" />}
      </button>
    </div>
  )
})
PasswordInput.displayName = 'PasswordInput'
