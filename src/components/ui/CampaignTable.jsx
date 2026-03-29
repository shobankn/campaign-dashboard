import { useState, useMemo } from 'react'
import { ChevronUp, ChevronDown, Search, SlidersHorizontal } from 'lucide-react'
import { Badge } from '../ui/Badge'
import { AnimateIn } from '../ui/AnimateIn'
import { formatCurrency, formatNumber, formatPercent, calcCTR, calcROAS } from '../../utils/metrics'
import { motion, AnimatePresence } from 'framer-motion'

const COLUMNS = [
  { key: 'name',        label: 'Campaign',    sortable: true },
  { key: 'client',      label: 'Client',      sortable: true },
  { key: 'status',      label: 'Status',      sortable: true },
  { key: 'impressions', label: 'Impressions', sortable: true },
  { key: 'clicks',      label: 'Clicks',      sortable: true },
  { key: 'ctr',         label: 'CTR',         sortable: true },
  { key: 'conversions', label: 'Conv.',        sortable: true },
  { key: 'spend',       label: 'Spend',       sortable: true },
  { key: 'roas',        label: 'ROAS',        sortable: true },
]

const STATUS_FILTERS = ['all', 'active', 'paused', 'ended']

export function CampaignTable({ campaigns }) {
  const [sort, setSort]           = useState({ key: 'impressions', dir: 'desc' })
  const [search, setSearch]       = useState('')
  const [statusFilter, setStatus] = useState('all')

  const rows = useMemo(() => {
    let filtered = campaigns.map(c => ({
      ...c,
      ctr:  calcCTR(c.clicks, c.impressions),
      roas: calcROAS(c.conversions, c.spend),
    }))

    if (search) {
      const q = search.toLowerCase()
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(q) || c.client.toLowerCase().includes(q)
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(c => c.status === statusFilter)
    }

    filtered.sort((a, b) => {
      const aVal = a[sort.key] ?? ''
      const bVal = b[sort.key] ?? ''
      if (typeof aVal === 'string')
        return sort.dir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
      return sort.dir === 'asc' ? aVal - bVal : bVal - aVal
    })

    return filtered
  }, [campaigns, sort, search, statusFilter])

  const handleSort = key => {
    setSort(prev => ({ key, dir: prev.key === key && prev.dir === 'asc' ? 'desc' : 'asc' }))
  }

  return (
    <AnimateIn>
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">

        {/* ── Toolbar ── */}
        <div className="flex flex-wrap items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/40">

          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none"
              style={{ color: '#3889FA' }}
            />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search campaigns or clients…"
              className="
                w-full pl-9 pr-3 py-2 text-xs rounded-xl outline-none transition-all
                bg-white dark:bg-gray-900
                border border-gray-200 dark:border-gray-700
                text-gray-800 dark:text-gray-100
                placeholder-gray-400 dark:placeholder-gray-500
                focus:border-[#3889FA] focus:ring-2 focus:ring-[#3889FA]/10
              "
            />
          </div>

          {/* Status tabs */}
          <div className="flex items-center gap-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-0.5">
            <SlidersHorizontal className="w-3.5 h-3.5 ml-2 flex-shrink-0 text-gray-400 dark:text-gray-500" />
            {STATUS_FILTERS.map(s => {
              const active = statusFilter === s
              return (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className="relative px-3 py-1.5 rounded-lg text-[11px] font-semibold capitalize transition-colors select-none"
                  style={
                    active
                      ? { color: '#fff' }
                      : { color: '#6b7280' }
                  }
                >
                  {active && (
                    <motion.span
                      layoutId="status-pill"
                      className="absolute inset-0 rounded-lg"
                      style={{ background: '#3889FA' }}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{s}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* ── Table ── */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800">
                {COLUMNS.map(col => {
                  const active = sort.key === col.key
                  return (
                    <th
                      key={col.key}
                      onClick={() => col.sortable && handleSort(col.key)}
                      className={`
                        px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider whitespace-nowrap
                        transition-colors select-none
                        ${col.sortable ? 'cursor-pointer' : ''}
                      `}
                      style={{ color: active ? '#3889FA' : '#9ca3af' }}
                    >
                      <div className="flex items-center gap-1">
                        {col.label}
                        {col.sortable && (
                          <span className="opacity-60">
                            {active
                              ? sort.dir === 'asc'
                                ? <ChevronUp  className="w-3 h-3" style={{ color: '#3889FA' }} />
                                : <ChevronDown className="w-3 h-3" style={{ color: '#3889FA' }} />
                              : <ChevronDown className="w-3 h-3 text-gray-300 dark:text-gray-600" />
                            }
                          </span>
                        )}
                      </div>
                    </th>
                  )
                })}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              <AnimatePresence mode="popLayout">
                {rows.map((row, i) => (
                  <motion.tr
                    key={row.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: i * 0.025, duration: 0.2 }}
                    className="group hover:bg-[#3889FA]/[0.03] dark:hover:bg-[#3889FA]/[0.06] transition-colors"
                  >
                    {/* Campaign name */}
                    <td className="px-4 py-3">
                      <p className="text-xs font-semibold text-gray-900 dark:text-gray-100 whitespace-nowrap group-hover:text-[#3889FA] transition-colors">
                        {row.name}
                      </p>
                    </td>

                    {/* Client */}
                    <td className="px-4 py-3">
                      <p className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">{row.client}</p>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <Badge status={row.status} />
                    </td>

                    {/* Impressions */}
                    <td className="px-4 py-3">
                      <p className="text-xs font-medium text-gray-700 dark:text-gray-300 tabular-nums">{formatNumber(row.impressions)}</p>
                    </td>

                    {/* Clicks */}
                    <td className="px-4 py-3">
                      <p className="text-xs font-medium text-gray-700 dark:text-gray-300 tabular-nums">{formatNumber(row.clicks)}</p>
                    </td>

                    {/* CTR */}
                    <td className="px-4 py-3">
                      <p className="text-xs font-semibold tabular-nums" style={{ color: '#3889FA' }}>{formatPercent(row.ctr)}</p>
                    </td>

                    {/* Conversions */}
                    <td className="px-4 py-3">
                      <p className="text-xs font-medium text-gray-700 dark:text-gray-300 tabular-nums">{formatNumber(row.conversions)}</p>
                    </td>

                    {/* Spend */}
                    <td className="px-4 py-3">
                      <p className="text-xs font-medium text-gray-700 dark:text-gray-300 tabular-nums">{formatCurrency(row.spend)}</p>
                    </td>

                    {/* ROAS */}
                    <td className="px-4 py-3">
                      <span
                        className="text-xs font-semibold px-2 py-0.5 rounded-lg tabular-nums"
                        style={
                          row.roas >= 3
                            ? { background: 'rgba(56,137,250,0.08)', color: '#3889FA' }
                            : row.roas >= 2
                            ? { background: 'rgba(245,158,11,0.08)', color: '#d97706' }
                            : { background: 'rgba(239,68,68,0.08)', color: '#ef4444' }
                        }
                      >
                        {row.roas.toFixed(2)}x
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>

          {rows.length === 0 && (
            <div className="py-14 text-center">
              <p className="text-xs font-medium text-gray-400 dark:text-gray-500">No campaigns match your filters</p>
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/40 flex items-center justify-between">
          <p className="text-[11px] text-gray-400 dark:text-gray-500">
            Showing <span className="font-semibold text-gray-600 dark:text-gray-300">{rows.length}</span> of <span className="font-semibold text-gray-600 dark:text-gray-300">{campaigns.length}</span> campaigns
          </p>
          {search && (
            <button
              onClick={() => setSearch('')}
              className="text-[11px] font-semibold transition-colors"
              style={{ color: '#3889FA' }}
            >
              Clear search
            </button>
          )}
        </div>
      </div>
    </AnimateIn>
  )
}