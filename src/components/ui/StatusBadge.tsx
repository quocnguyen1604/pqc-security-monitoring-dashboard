import type { ReactNode } from 'react'

export type StatusTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info'

interface StatusBadgeProps {
  children: ReactNode
  tone?: StatusTone
  className?: string
}

const toneClasses: Record<StatusTone, string> = {
  neutral: 'border-slate-600 bg-slate-800 text-slate-300',
  success: 'border-emerald-800 bg-emerald-950/70 text-emerald-300',
  warning: 'border-amber-800 bg-amber-950/70 text-amber-300',
  danger: 'border-rose-800 bg-rose-950/70 text-rose-300',
  info: 'border-cyan-800 bg-cyan-950/70 text-cyan-300',
}

export function StatusBadge({ children, tone = 'neutral', className = '' }: StatusBadgeProps) {
  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-medium ${toneClasses[tone]} ${className}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
      {children}
    </span>
  )
}
