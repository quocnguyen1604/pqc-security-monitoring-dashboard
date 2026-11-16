import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { CUSTOMER_REPORTING_CONFIG } from '../../config/customerReporting'
import { mockConnections } from '../../data/mockConnections'
import { mockCustomerDataFlows } from '../../data/mockCustomerDataFlows'
import { calculateCustomerExposureByClass } from '../../services/customerReporting'
import type { CustomerDataClassExposure } from '../../services/customerReporting'

const connectionById = new Map(mockConnections.map((connection) => [connection.id, connection]))
const exposureSummaries = calculateCustomerExposureByClass(mockConnections, mockCustomerDataFlows)

function ExposureRows({ summaries }: { summaries: CustomerDataClassExposure[] }) {
  return (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full min-w-[620px] text-left">
        <thead className="text-[11px] uppercase tracking-wider text-slate-500">
          <tr>
            <th scope="col" className="px-3 py-2 font-semibold">Data class</th>
            <th scope="col" className="px-3 py-2 text-right font-semibold">Total estimate</th>
            <th scope="col" className="px-3 py-2 text-right font-semibold">Classical estimate</th>
            <th scope="col" className="px-3 py-2 text-right font-semibold">Share classical</th>
            <th scope="col" className="px-3 py-2 font-semibold">Affected connections</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {summaries.map((summary) => {
            const definition = CUSTOMER_REPORTING_CONFIG.dataClasses.find((item) => item.name === summary.dataClass)
            const affectedNames = summary.affectedConnectionIds
              .map((id) => connectionById.get(id)?.deviceName ?? id)
            return (
              <tr key={summary.dataClass}>
                <th scope="row" className="px-3 py-3 align-top font-medium text-slate-200">
                  <span>{summary.dataClass}</span>
                  {definition && <span className="mt-1 block max-w-52 text-xs font-normal leading-5 text-slate-500">{definition.description}</span>}
                </th>
                <td className="px-3 py-3 text-right align-top tabular-nums text-slate-300">{summary.totalEstimatedVolume.toLocaleString()} {CUSTOMER_REPORTING_CONFIG.measurementUnit}</td>
                <td className="px-3 py-3 text-right align-top tabular-nums font-medium text-amber-200">{summary.potentiallyExposedVolume.toLocaleString()} {CUSTOMER_REPORTING_CONFIG.measurementUnit}</td>
                <td className="px-3 py-3 text-right align-top tabular-nums text-slate-300">{summary.potentiallyExposedPercentage.toFixed(1)}%</td>
                <td className="max-w-64 px-3 py-3 align-top text-xs leading-5 text-slate-400">{affectedNames.length > 0 ? affectedNames.join(', ') : 'None using classical key exchange'}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

interface CustomerExposureBreakdownProps {
  compact?: boolean
}

export function CustomerExposureBreakdown({ compact = false }: CustomerExposureBreakdownProps) {
  const chartData = exposureSummaries.map((summary) => ({
    dataClass: summary.dataClass,
    mlKemVolume: summary.mlKemAssociatedVolume,
    classicalVolume: summary.potentiallyExposedVolume,
  }))

  return (
    <div>
      <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 sm:p-6">
        <div>
          <h3 className="font-semibold text-slate-100">Estimated customer data volume by class</h3>
          <p className="mt-1 text-sm text-slate-400">{CUSTOMER_REPORTING_CONFIG.measurementUnit} per month · {CUSTOMER_REPORTING_CONFIG.reportingPeriodLabel} · illustrative synthetic estimates</p>
        </div>
        <div className={`${compact ? 'mt-3 h-48' : 'mt-5 h-64'}`} role="img" aria-label={`Estimated volumes by data class in ${CUSTOMER_REPORTING_CONFIG.measurementUnit} per month. Stacked bars separate ML-KEM-associated and classical-associated volumes.`}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ top: 4, right: 20, bottom: 4, left: 8 }}>
              <CartesianGrid stroke="#1e293b" horizontal={false} />
              <XAxis type="number" unit={` ${CUSTOMER_REPORTING_CONFIG.measurementUnit}`} tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={{ stroke: '#334155' }} tickLine={false} />
              <YAxis type="category" dataKey="dataClass" width={88} tick={{ fill: '#cbd5e1', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(value, name) => [`${Number(value).toLocaleString()} ${CUSTOMER_REPORTING_CONFIG.measurementUnit}`, name]} contentStyle={{ background: '#0b1422', border: '1px solid #334155', borderRadius: 8, color: '#e2e8f0' }} />
              <Legend formatter={(value) => <span className="text-xs text-slate-300">{value}</span>} />
              <Bar dataKey="mlKemVolume" name="ML-KEM-associated estimate" stackId="volume" fill="#2dd4bf" isAnimationActive={false} />
              <Bar dataKey="classicalVolume" name="Classical-associated estimate" stackId="volume" fill="#fbbf24" radius={[0, 4, 4, 0]} isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <ExposureRows summaries={exposureSummaries} />
        <p className="mt-4 border-t border-slate-800 pt-3 text-xs leading-5 text-slate-500">
          Classical key exchange creates potential future HNDL exposure. These synthetic estimates do not show observed traffic, collected data, an actual compromise, or the likelihood of future decryption.
        </p>
      </div>
    </div>
  )
}
