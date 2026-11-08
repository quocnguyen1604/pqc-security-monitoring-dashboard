import { Search, SlidersHorizontal } from 'lucide-react'
import { useMemo, useState } from 'react'
import { mockConnections } from '../../data/mockConnections'
import type { HndlExposure, KeyExchangeAlgorithm } from '../../types/security'
import { SectionHeader } from '../../components/ui/SectionHeader'
import { StatusBadge } from '../../components/ui/StatusBadge'

const algorithms: Array<'All algorithms' | KeyExchangeAlgorithm> = ['All algorithms', 'ML-KEM-768', 'ECDH P-256', 'X25519']
const exposures: Array<'All exposure levels' | HndlExposure> = ['All exposure levels', 'Low', 'Moderate', 'High']
const migrationTone = { Migrated: 'success', 'In progress': 'info', Blocked: 'danger', Planned: 'warning' } as const
const exposureTone = { Low: 'success', Moderate: 'warning', High: 'danger' } as const

export function ConnectionsFeature() {
  const [query, setQuery] = useState('')
  const [algorithm, setAlgorithm] = useState<(typeof algorithms)[number]>('All algorithms')
  const [exposure, setExposure] = useState<(typeof exposures)[number]>('All exposure levels')

  const filteredConnections = useMemo(() => mockConnections.filter((connection) => {
    const matchesName = connection.deviceName.toLowerCase().includes(query.trim().toLowerCase())
    const matchesAlgorithm = algorithm === 'All algorithms' || connection.keyExchangeAlgorithm === algorithm
    const matchesExposure = exposure === 'All exposure levels' || connection.hndlExposure === exposure
    return matchesName && matchesAlgorithm && matchesExposure
  }), [query, algorithm, exposure])

  return (
    <section id="connections" aria-labelledby="connections-title" className="scroll-mt-28 space-y-6">
      <SectionHeader eyebrow="Connection-level detail" title="Connection inventory" description="Search devices and inspect negotiated algorithms, criticality, potential HNDL exposure and migration state." />
      <div className="rounded-xl border border-slate-800 bg-slate-900/70">
        <div className="flex flex-col gap-3 border-b border-slate-800 p-4 lg:flex-row lg:items-center">
          <label className="relative min-w-0 flex-1">
            <span className="sr-only">Search by device name</span>
            <Search size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" aria-hidden="true" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search device name" className="w-full rounded-lg border border-slate-700 bg-slate-950/60 py-2.5 pl-9 pr-3 text-sm text-slate-100 outline-none placeholder:text-slate-600 focus:border-cyan-700 focus:ring-2 focus:ring-cyan-900/50" />
          </label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="flex items-center gap-2 text-xs text-slate-500"><SlidersHorizontal size={15} aria-hidden="true" /><span className="sr-only">Filter by key exchange algorithm</span>
              <select value={algorithm} onChange={(event) => setAlgorithm(event.target.value as (typeof algorithms)[number])} className="rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2.5 text-sm text-slate-300 outline-none focus:border-cyan-700">
                {algorithms.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </label>
            <label className="text-xs text-slate-500"><span className="sr-only">Filter by HNDL exposure</span>
              <select value={exposure} onChange={(event) => setExposure(event.target.value as (typeof exposures)[number])} className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2.5 text-sm text-slate-300 outline-none focus:border-cyan-700">
                {exposures.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </label>
          </div>
        </div>

        <div className="flex items-center justify-between px-4 py-3 text-xs text-slate-500">
          <span>{filteredConnections.length} of {mockConnections.length} connections</span>
          <span>HNDL indicates potential future exposure</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-left">
            <thead className="bg-slate-950/50 text-[11px] uppercase tracking-wider text-slate-500">
              <tr>
                <th scope="col" className="px-4 py-3 font-semibold">Device</th>
                <th scope="col" className="px-4 py-3 font-semibold">Location</th>
                <th scope="col" className="px-4 py-3 font-semibold">Key exchange</th>
                <th scope="col" className="px-4 py-3 font-semibold">Criticality</th>
                <th scope="col" className="px-4 py-3 font-semibold">HNDL exposure</th>
                <th scope="col" className="px-4 py-3 font-semibold">Migration status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredConnections.map((connection) => (
                <tr key={connection.id} className="hover:bg-slate-800/30">
                  <th scope="row" className="px-4 py-3.5 font-medium text-slate-200">
                    <span className="block">{connection.deviceName}</span>
                    <span className="mt-1 block text-xs font-normal text-slate-500">{connection.id} · {connection.category}{connection.isLegacy ? ' · Legacy' : ''}</span>
                  </th>
                  <td className="px-4 py-3.5 text-sm text-slate-400">{connection.site}</td>
                  <td className="px-4 py-3.5"><StatusBadge tone={connection.keyExchangeAlgorithm === 'ML-KEM-768' ? 'success' : 'warning'}>{connection.keyExchangeAlgorithm}</StatusBadge></td>
                  <td className="px-4 py-3.5"><span className={`text-sm ${connection.criticality === 'Critical' ? 'font-semibold text-rose-300' : connection.criticality === 'High' ? 'text-orange-300' : 'text-slate-300'}`}>{connection.criticality}</span></td>
                  <td className="px-4 py-3.5"><StatusBadge tone={exposureTone[connection.hndlExposure]}>{connection.hndlExposure}</StatusBadge></td>
                  <td className="px-4 py-3.5"><StatusBadge tone={migrationTone[connection.migrationStatus]}>{connection.migrationStatus}</StatusBadge></td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredConnections.length === 0 && <p className="px-4 py-12 text-center text-sm text-slate-400">No connections match the current search and filters.</p>}
        </div>
      </div>
    </section>
  )
}
