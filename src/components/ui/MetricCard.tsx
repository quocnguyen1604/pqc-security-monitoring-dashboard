import type { LucideIcon } from 'lucide-react'

interface MetricCardProps {
  label: string
  value: string | number
  helperText?: string
  icon: LucideIcon
}

export function MetricCard({ label, value, helperText, icon: Icon }: MetricCardProps) {
  return (
    <article className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-400">{label}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-100">{value}</p>
        </div>
        <span className="rounded-lg border border-slate-700 bg-slate-800 p-2.5 text-cyan-300">
          <Icon size={19} aria-hidden="true" />
        </span>
      </div>
      {helperText && <p className="mt-3 text-xs leading-5 text-slate-500">{helperText}</p>}
    </article>
  )
}
