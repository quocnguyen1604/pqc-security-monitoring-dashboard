import {
  Activity,
  AlertTriangle,
  Cable,
  ChartNoAxesCombined,
  ChevronLeft,
  Menu,
  Radio,
  Shield,
  ShieldCheck,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { StatusBadge } from '../ui/StatusBadge'

const navigation = [
  { label: 'Dashboard overview', href: '#overview', icon: ChartNoAxesCombined },
  { label: 'Migration progress', href: '#migration', icon: Activity },
  { label: 'Security risks', href: '#risks', icon: AlertTriangle },
  { label: 'Connection inventory', href: '#connections', icon: Cable },
  { label: 'Security events', href: '#events', icon: Radio },
]

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [activeSection, setActiveSection] = useState(() => window.location.hash || '#overview')

  useEffect(() => {
    const updateActiveSection = () => setActiveSection(window.location.hash || '#overview')
    window.addEventListener('hashchange', updateActiveSection)
    return () => window.removeEventListener('hashchange', updateActiveSection)
  }, [])

  const activeLabel = navigation.find((item) => item.href === activeSection)?.label ?? navigation[0].label

  return (
    <div className="min-h-screen bg-[#080f1c] text-slate-100">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-slate-800 bg-[#0b1422] lg:flex">
        <a href="#overview" className="flex h-[76px] items-center gap-3 border-b border-slate-800 px-6" aria-label="PQC Security Monitor home">
          <span className="rounded-lg border border-cyan-900 bg-cyan-950/70 p-2 text-cyan-300"><ShieldCheck size={21} /></span>
          <span>
            <span className="block text-sm font-semibold tracking-wide text-slate-100">PQC Security Monitor</span>
            <span className="block text-xs text-slate-500">Security operations</span>
          </span>
        </a>
        <nav aria-label="Main navigation" className="flex-1 space-y-1 px-3 py-6">
          <p className="px-3 pb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">Workspace</p>
          {navigation.map(({ label, href, icon: Icon }) => {
            const isActive = activeSection === href
            return (
            <a
              key={href}
              href={href}
              aria-current={isActive ? 'location' : undefined}
              className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${isActive ? 'bg-cyan-950/70 font-medium text-cyan-200 ring-1 ring-inset ring-cyan-900' : 'text-slate-400 hover:bg-slate-800/70 hover:text-slate-100'}`}
            >
              <Icon size={17} className={isActive ? 'text-cyan-300' : 'text-slate-500 group-hover:text-slate-300'} aria-hidden="true" />
              {label}
            </a>
            )
          })}
        </nav>
        <div className="border-t border-slate-800 p-4">
          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-300"><Shield size={14} className="text-teal-300" /> Scope</div>
            <p className="mt-2 text-xs leading-5 text-slate-500">Post-quantum migration readiness and classical exposure.</p>
          </div>
        </div>
      </aside>

      {mobileNavOpen && (
        <button
          type="button"
          aria-label="Close navigation overlay"
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          onClick={() => setMobileNavOpen(false)}
        />
      )}
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-slate-800 bg-[#0b1422] transition-transform lg:hidden ${mobileNavOpen ? 'translate-x-0' : '-translate-x-full'}`} aria-label="Mobile navigation">
        <div className="flex h-[76px] items-center justify-between border-b border-slate-800 px-5">
          <span className="flex items-center gap-3 font-semibold"><ShieldCheck className="text-cyan-300" size={20} /> PQC Security Monitor</span>
          <button type="button" onClick={() => setMobileNavOpen(false)} className="rounded-md p-2 text-slate-400 hover:bg-slate-800" aria-label="Close navigation"><ChevronLeft size={19} /></button>
        </div>
        <nav aria-label="Main navigation" className="space-y-1 px-3 py-6">
          {navigation.map(({ label, href, icon: Icon }) => {
            const isActive = activeSection === href
            return (
              <a key={href} href={href} onClick={() => setMobileNavOpen(false)} aria-current={isActive ? 'location' : undefined} className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm ${isActive ? 'bg-cyan-950/70 font-medium text-cyan-200' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'}`}>
                <Icon size={17} aria-hidden="true" />{label}
              </a>
            )
          })}
        </nav>
      </aside>

      <div className="min-h-screen lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-slate-800 bg-[#0b1422]/95 backdrop-blur supports-[backdrop-filter]:bg-[#0b1422]/90">
          <div className="flex min-h-[76px] items-center justify-between gap-4 px-4 sm:px-6 xl:px-10">
            <div className="flex min-w-0 items-center gap-3">
              <button type="button" onClick={() => setMobileNavOpen(true)} className="rounded-md border border-slate-700 p-2 text-slate-300 hover:bg-slate-800 lg:hidden" aria-label="Open navigation"><Menu size={18} /></button>
              <div className="min-w-0">
                <p className="truncate text-xs text-slate-500">Current section</p>
                <p className="truncate text-sm font-semibold text-slate-100">{activeLabel}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">Organization</p>
                <p className="text-xs font-medium text-slate-300">Synthetic Demo Environment</p>
              </div>
              <StatusBadge tone="info" className="whitespace-nowrap"><span className="hidden sm:inline">Synthetic data</span><span className="sm:hidden">Demo data</span></StatusBadge>
            </div>
          </div>
        </header>
        <main className="mx-auto w-full max-w-[1600px] px-4 py-7 sm:px-6 sm:py-9 xl:px-10">
          {children}
        </main>
      </div>
    </div>
  )
}
