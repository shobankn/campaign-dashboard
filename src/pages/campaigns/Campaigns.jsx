import { CampaignTable } from '../../components/ui/CampaignTable'
import { DateRangePicker } from '../../components/ui/DateRangePicker'
import { AnimateIn } from '../../components/ui/AnimateIn'
import { useState } from 'react'
import data from '../../data/campaigns.json'

export function Campaigns() {
  const [dateRange, setDateRange] = useState({ start: null, end: null })

  return (
    <div className="px-4 lg:px-6 py-6 space-y-6 max-w-[1400px] mx-auto">
      <AnimateIn>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Campaigns</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{data.campaigns.length} total campaigns</p>
          </div>
          <DateRangePicker
            startDate={dateRange.start}
            endDate={dateRange.end}
            onChange={(s, e) => setDateRange({ start: s, end: e })}
          />
        </div>
      </AnimateIn>
      <CampaignTable campaigns={data.campaigns} />
    </div>
  )
}
