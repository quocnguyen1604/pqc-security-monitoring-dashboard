import { Bar, BarChart, CartesianGrid, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { MigrationStatusDistribution } from '../../services/metrics'

interface MigrationStatusChartProps {
  distribution: MigrationStatusDistribution
}

const data = (distribution: MigrationStatusDistribution) => [
  { status: 'Migrated', count: distribution.Migrated, fill: '#34d399' },
  { status: 'In progress', count: distribution['In progress'], fill: '#38bdf8' },
  { status: 'Blocked', count: distribution.Blocked, fill: '#fb7185' },
  { status: 'Planned', count: distribution.Planned, fill: '#fbbf24' },
]

export function MigrationStatusChart({ distribution }: MigrationStatusChartProps) {
  const chartData = data(distribution)
  return (
    <article className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 sm:p-6">
      <h3 className="font-semibold text-slate-100">Migration status distribution</h3>
      <p className="mt-1 text-sm text-slate-400">Connection count by recorded migration status.</p>
      <div className="mt-5 h-64" role="img" aria-label={chartData.map((item) => `${item.status}: ${item.count}`).join(', ')}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ top: 4, right: 28, bottom: 4, left: 8 }}>
            <CartesianGrid stroke="#1e293b" horizontal={false} />
            <XAxis type="number" allowDecimals={false} tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={{ stroke: '#334155' }} tickLine={false} />
            <YAxis type="category" dataKey="status" width={86} tick={{ fill: '#cbd5e1', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip cursor={{ fill: '#1e293b', opacity: 0.5 }} formatter={(value) => [`${value} connections`, 'Devices']} contentStyle={{ background: '#0b1422', border: '1px solid #334155', borderRadius: 8, color: '#e2e8f0' }} />
            <Bar dataKey="count" name="Connections" barSize={22} radius={[0, 5, 5, 0]} isAnimationActive={false}>
              {chartData.map((item) => <Cell key={item.status} fill={item.fill} />)}
              <LabelList dataKey="count" position="right" fill="#cbd5e1" fontSize={12} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </article>
  )
}
