import { LoaderCircle } from 'lucide-react'

interface LoadingStateProps {
  label?: string
}

export function LoadingState({ label = 'Loading dashboard data' }: LoadingStateProps) {
  return (
    <div className="flex min-h-48 items-center justify-center gap-3 rounded-xl border border-slate-800 bg-slate-900/50 text-sm text-slate-400" role="status" aria-live="polite">
      <LoaderCircle className="animate-spin text-cyan-400 motion-reduce:animate-none" size={18} aria-hidden="true" />
      <span>{label}</span>
    </div>
  )
}
