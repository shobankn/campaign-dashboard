import { useState, useMemo } from 'react'
import { Eye, MousePointer, Target, TrendingUp, DollarSign, BarChart2 } from 'lucide-react'
import { KpiCard } from '../../components/ui/KpiCard'
import { PerformanceChart } from '../../components/ui/PerformanceChart'
import { CampaignTable } from '../../components/ui/CampaignTable'
import { DateRangePicker } from '../../components/ui/DateRangePicker'
import { StaggerContainer } from '../../components/ui/AnimateIn'
import { formatNumber, formatCurrency, formatPercent, calcCTR, calcROAS, buildTrendData } from '../../utils/metrics'
import data from '../../data/campaigns.json'

export function Dashboard() {
  const [dateRange, setDateRange] = useState({ start: null, end: null })

  const campaigns = data.campaigns

  const totals = useMemo(() => {
    const impressions = campaigns.reduce((s, c) => s + c.impressions, 0)
    const clicks = campaigns.reduce((s, c) => s + c.clicks, 0)
    const conversions = campaigns.reduce((s, c) => s + c.conversions, 0)
    const spend = campaigns.reduce((s, c) => s + c.spend, 0)
    return {
      impressions,
      clicks,
      ctr: calcCTR(clicks, impressions),
      conversions,
      spend,
      roas: calcROAS(conversions, spend),
    }
  }, [campaigns])

  const trendData = useMemo(() => buildTrendData(campaigns), [campaigns])

  const kpis = [
    { label: 'Impressions', value: formatNumber(totals.impressions), change: 12.4, icon: Eye, color: 'brand' },
    { label: 'Clicks', value: formatNumber(totals.clicks), change: 8.2, icon: MousePointer, color: 'emerald' },
    { label: 'CTR', value: formatPercent(totals.ctr), change: -1.3, icon: Target, color: 'violet' },
    { label: 'Conversions', value: formatNumber(totals.conversions), change: 15.7, icon: TrendingUp, color: 'cyan' },
    { label: 'Spend', value: formatCurrency(totals.spend), change: 5.1, icon: DollarSign, color: 'amber', prefix: '' },
    { label: 'ROAS', value: totals.roas.toFixed(2) + 'x', change: 3.8, icon: BarChart2, color: 'rose' },
  ]

  return (
    <div className="px-4 lg:px-6 py-6 space-y-6 max-w-[1400px] mx-auto">
    <div className="flex flex-wrap items-center justify-between gap-4">
  <div>
    <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
      Campaign Dashboard
    </h1>
    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
      {campaigns.length} campaigns across {data.clients.length} clients
    </p>
  </div>

  <div className="w-full sm:w-auto">
    <DateRangePicker
      startDate={dateRange.start}
      endDate={dateRange.end}
      onChange={(s, e) => setDateRange({ start: s, end: e })}
    />
  </div>
</div>

      <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpis.map(kpi => (
          <KpiCard key={kpi.label} {...kpi} />
        ))}
      </StaggerContainer>

      <PerformanceChart data={trendData} />

      <div>
        <div className="mb-3">
          <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100">All Campaigns</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Click column headers to sort</p>
        </div>
        <CampaignTable campaigns={campaigns} />
      </div>
    </div>
  )
}
