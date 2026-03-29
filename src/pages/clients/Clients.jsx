import { AnimateIn, StaggerContainer, StaggerItem } from '../../components/ui/AnimateIn'
import { motion } from 'framer-motion'
import { formatCurrency, formatNumber } from '../../utils/metrics'
import { BarChart2, Users, TrendingUp } from 'lucide-react'
import data from '../../data/campaigns.json'

export function Clients() {
  const clientsWithStats = data.clients.map(client => {
    const campaigns = data.campaigns.filter(c => c.client === client.name)
    const totalSpend       = campaigns.reduce((s, c) => s + c.spend, 0)
    const totalImpressions = campaigns.reduce((s, c) => s + c.impressions, 0)
    const active           = campaigns.filter(c => c.status === 'active').length
    return { ...client, campaigns: campaigns.length, active, totalSpend, totalImpressions }
  })

  return (
    <div className="px-4 lg:px-6 py-6 w-full mx-auto">

      {/* Page header */}
      <AnimateIn>
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.13em] text-gray-400 dark:text-gray-500 mb-1">
              Overview
            </p>
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Clients</h1>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              {data.clients.length} clients under management
            </p>
          </div>
        </div>
      </AnimateIn>

      {/* Cards grid */}
      <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {clientsWithStats.map(client => (
          <StaggerItem key={client.id}>
            <motion.div
              whileHover={{ y: -3, boxShadow: '0 12px 40px rgba(56,137,250,0.10)' }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="
                bg-white dark:bg-gray-900
                border border-gray-200 dark:border-gray-800
                rounded-2xl p-5
                flex flex-col gap-4
                shadow-sm
                cursor-default select-none
              "
            >
              {/* Client identity */}
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(56,137,250,0.08)' }}
                >
                  <span className="text-sm font-bold" style={{ color: '#3889FA' }}>
                    {client.name.charAt(0)}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">
                    {client.name}
                  </p>
                  <p className="text-[11px] text-gray-400 dark:text-gray-500 truncate">
                    {client.industry}
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-gray-100 dark:bg-gray-800" />

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-2">

                {/* Campaigns */}
                <div className="flex flex-col gap-1.5 p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/60">
                  <BarChart2 className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                  <p className="text-base font-bold text-gray-900 dark:text-gray-100 tabular-nums leading-none">
                    {client.campaigns}
                  </p>
                  <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">
                    Campaigns
                  </p>
                </div>

                {/* Active */}
                <div className="flex flex-col gap-1.5 p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/60">
                  <Users className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                  <p className="text-base font-bold tabular-nums leading-none" style={{ color: '#3889FA' }}>
                    {client.active}
                  </p>
                  <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">
                    Active
                  </p>
                </div>

                {/* Spend */}
                <div className="flex flex-col gap-1.5 p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/60">
                  <TrendingUp className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                  <p className="text-base font-bold tabular-nums leading-none text-gray-900 dark:text-gray-100">
                    {formatCurrency(client.totalSpend)}
                  </p>
                  <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">
                    Spend
                  </p>
                </div>
              </div>

              {/* Progress bar — spend indicator */}
              <div className="h-[2px] rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: '#3889FA' }}
                  initial={{ width: '0%' }}
                  animate={{
                    width: `${Math.min(
                      (client.totalSpend /
                        Math.max(...clientsWithStats.map(c => c.totalSpend))) * 100,
                      100
                    )}%`
                  }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                />
              </div>
            </motion.div>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </div>
  )
}