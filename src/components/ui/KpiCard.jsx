import { TrendingUp, TrendingDown } from 'lucide-react'
import { StaggerItem } from '../ui/AnimateIn'
import { motion, animate } from 'framer-motion'
import { useEffect, useState } from 'react'

function AnimatedValue({ value, prefix }) {
  const [display, setDisplay] = useState(0)
  const raw = parseFloat(String(value).replace(/,/g, ''))
  const isNumeric = !isNaN(raw)

  useEffect(() => {
    if (!isNumeric) return
    const ctrl = animate(0, raw, {
      duration: 1.2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: v => setDisplay(v),
    })
    return () => ctrl.stop()
  }, [raw])

  if (!isNumeric) return <span>{prefix}{value}</span>

  const formatted = raw >= 1000
    ? Math.round(display).toLocaleString('en-US')
    : display.toLocaleString('en-US', { maximumFractionDigits: 1 })

  return <span>{prefix}{formatted}</span>
}

export function KpiCard({ label, value, change, icon: Icon, color = 'brand', prefix = '' }) {
  const isPositive = change >= 0

  return (
    <StaggerItem>
      <motion.div
        whileHover={{ y: -3, boxShadow: '0 12px 40px rgba(56,137,250,0.13)' }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        className="
          bg-white dark:bg-gray-900
          border border-gray-100 dark:border-gray-800
          rounded-2xl p-5
          flex flex-col gap-4
          cursor-default select-none
        "
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-semibold uppercase tracking-[0.13em] text-gray-400 dark:text-gray-500">
            {label}
          </p>

          {/* Icon badge */}
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(56,137,250,0.08)' }}
          >
            <Icon className="w-4 h-4" strokeWidth={2} style={{ color: '#3889FA' }} />
          </div>
        </div>

        {/* Value */}
        <div>
          <motion.p
            className="text-[26px] font-bold tracking-tight text-gray-900 dark:text-white"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <AnimatedValue value={value} prefix={prefix} />
          </motion.p>

          {/* Change pill */}
          <div className="flex items-center gap-1.5 mt-2">
            <span
              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[11px] font-semibold"
              style={
                isPositive
                  ? { background: 'rgba(56,137,250,0.08)', color: '#3889FA' }
                  : { background: 'rgba(239,68,68,0.08)', color: '#ef4444' }
              }
            >
              {isPositive
                ? <TrendingUp className="w-3 h-3" strokeWidth={2.5} />
                : <TrendingDown className="w-3 h-3" strokeWidth={2.5} />
              }
              {isPositive ? '+' : ''}{change}%
            </span>
            <span className="text-[11px] text-gray-400 dark:text-gray-500">vs last period</span>
          </div>
        </div>

        {/* Progress bar accent */}
        <div className="h-[2px] rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: '#3889FA' }}
            initial={{ width: '0%' }}
            animate={{ width: `${Math.min(Math.abs(change) * 4, 100)}%` }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          />
        </div>
      </motion.div>
    </StaggerItem>
  )
}