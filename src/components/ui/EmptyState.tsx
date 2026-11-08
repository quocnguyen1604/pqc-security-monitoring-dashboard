import type { LucideIcon } from 'lucide-react'
import { Inbox } from 'lucide-react'
import type { ReactNode } from 'react'

interface EmptyStateProps {
  title: string
  description: string
  icon?: LucideIcon
  action?: ReactNode
}

export function EmptyState({ title, description, icon: Icon = Inbox, action }: EmptyStateProps) {
  return (
    <div className="flex min-h-56 flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-900/40 px-6 py-10 text-center">
      <span className="mb-4 rounded-full border border-slate-700 bg-slate-800 p-3 text-slate-400">
        <Icon size={21} aria-hidden="true" />
      </span>
      <h3 className="text-sm font-semibold text-slate-200">{title}</h3>
      <p className="mt-2 max-w-lg text-sm leading-6 text-slate-400">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
