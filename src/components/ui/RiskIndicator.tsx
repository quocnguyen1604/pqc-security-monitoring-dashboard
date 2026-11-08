import { AlertTriangle, CheckCircle2, CircleHelp, Info } from 'lucide-react'
import type { RiskSeverity } from '../../types/security'

interface RiskIndicatorProps {
  severity: RiskSeverity
  label?: string
  compact?: boolean
}

const styles: Record<RiskSeverity, { icon: typeof AlertTriangle; className: string }> = {
  Low: { icon: CheckCircle2, className: 'text-emerald-300' },
  Medium: { icon: Info, className: 'text-amber-300' },
  High: { icon: AlertTriangle, className: 'text-orange-300' },
  Critical: { icon: CircleHelp, className: 'text-rose-300' },
}

export function RiskIndicator({ severity, label, compact = false }: RiskIndicatorProps) {
  const { icon: Icon, className } = styles[severity]
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <Icon size={compact ? 15 : 17} aria-hidden="true" />
      <span className="text-sm font-medium">{label ?? severity}</span>
    </span>
  )
}
