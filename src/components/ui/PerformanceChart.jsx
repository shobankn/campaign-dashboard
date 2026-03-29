import { useState } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Area, AreaChart, ComposedChart
} from 'recharts'
import { AnimateIn } from '../ui/AnimateIn'
import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp } from 'lucide-react'

const metrics = [
  { key: 'clicks',      label: 'Clicks',      color: '#3889FA' },
  { key: 'impressions', label: 'Impressions',  color: '#8B5CF6' },
  { key: 'conversions', label: 'Conversions',  color: '#10B981' },
]

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <motion.div
      initial={{ opacity: 0, y: 4, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.15 }}
      className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-3.5 shadow-2xl shadow-black/10 min-w-[160px]"
    >
      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2.5">{label}</p>
      <div className="flex flex-col gap-2">
        {payload.map(p => (
          <div key={p.dataKey} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: p.color }} />
              <span className="text-[11px] text-gray-500 dark:text-gray-400 capitalize">{p.dataKey}</span>
            </div>
            <span className="text-[11px] font-bold text-gray-900 dark:text-gray-100 tabular-nums">
              {p.value?.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

function CustomDot({ cx, cy, stroke, active }) {
  if (!active) return null
  return (
    <g>
      <circle cx={cx} cy={cy} r={5} fill={stroke} />
      <circle cx={cx} cy={cy} r={9} fill={stroke} fillOpacity={0.15} />
    </g>
  )
}

export function PerformanceChart({ data }) {
  const [active, setActive] = useState(['clicks', 'conversions'])
  const [hovered, setHovered] = useState(null)

  const toggle = key => {
    setActive(prev =>
      prev.includes(key)
        ? prev.length > 1 ? prev.filter(k => k !== key) : prev
        : [...prev, key]
    )
  }

  return (
    <AnimateIn>
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">

        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 px-5 pt-5 pb-4 border-b border-gray-100 dark:border-gray-800">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <TrendingUp className="w-4 h-4" style={{ color: '#3889FA' }} />
              <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100">Performance Trend</h2>
            </div>
            <p className="text-[11px] text-gray-400 dark:text-gray-500 ml-6">30-day campaign overview</p>
          </div>

          {/* Metric toggles */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {metrics.map(m => {
              const on = active.includes(m.key)
              return (
                <button
                  key={m.key}
                  onClick={() => toggle(m.key)}
                  onMouseEnter={() => setHovered(m.key)}
                  onMouseLeave={() => setHovered(null)}
                  className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all select-none"
                  style={{
                    background: on ? `${m.color}14` : 'transparent',
                    color: on ? m.color : '#9ca3af',
                    border: `1.5px solid ${on ? `${m.color}40` : '#e5e7eb'}`,
                  }}
                >
                  {/* Animated dot */}
                  <span
                    className="w-1.5 h-1.5 rounded-full transition-all duration-200"
                    style={{ background: on ? m.color : '#d1d5db' }}
                  />
                  {m.label}
                  {/* strikethrough when off */}
                  {!on && (
                    <span className="absolute inset-x-3 top-1/2 h-px bg-gray-300 dark:bg-gray-600 pointer-events-none" />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Chart */}
        <div className="px-2 pt-4 pb-3">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: -8 }}>
                <defs>
                  {metrics.map(m => (
                    <linearGradient key={m.key} id={`grad-${m.key}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"   stopColor={m.color} stopOpacity={0.12} />
                      <stop offset="100%" stopColor={m.color} stopOpacity={0}    />
                    </linearGradient>
                  ))}
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f0f0f0"
                  vertical={false}
                  strokeOpacity={0.8}
                />

                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 10, fill: '#9CA3AF' }}
                  tickLine={false}
                  axisLine={false}
                  interval={4}
                  dy={6}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: '#9CA3AF' }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={v => v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v}
                  width={36}
                />

                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{
                    stroke: '#3889FA',
                    strokeWidth: 1,
                    strokeDasharray: '4 4',
                    strokeOpacity: 0.4,
                  }}
                />

                {/* Area fills under lines */}
                {metrics.map(m =>
                  active.includes(m.key) && (
                    <Area
                      key={`area-${m.key}`}
                      type="monotone"
                      dataKey={m.key}
                      stroke="none"
                      fill={`url(#grad-${m.key})`}
                      dot={false}
                      activeDot={false}
                      legendType="none"
                      isAnimationActive
                      animationDuration={800}
                      animationEasing="ease-out"
                    />
                  )
                )}

                {/* Lines on top */}
                {metrics.map(m =>
                  active.includes(m.key) && (
                    <Line
                      key={m.key}
                      type="monotone"
                      dataKey={m.key}
                      stroke={m.color}
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 5, fill: m.color, strokeWidth: 2, stroke: '#fff' }}
                      isAnimationActive
                      animationDuration={900}
                      animationEasing="ease-out"
                    />
                  )
                )}
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Footer summary */}
        <div className="px-5 pb-4 flex items-center gap-4 flex-wrap">
          {metrics.filter(m => active.includes(m.key)).map(m => {
            const total = data?.reduce((sum, d) => sum + (d[m.key] ?? 0), 0) ?? 0
            return (
              <div key={m.key} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ background: m.color }} />
                <span className="text-[11px] text-gray-400 dark:text-gray-500">{m.label}</span>
                <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300 tabular-nums">
                  {total.toLocaleString()}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </AnimateIn>
  )
}