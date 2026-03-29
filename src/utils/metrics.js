export function formatNumber(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K'
  return n.toString()
}

export function formatCurrency(n) {
  if (n >= 1_000_000) return '$' + (n / 1_000_000).toFixed(2) + 'M'
  if (n >= 1_000) return '$' + (n / 1_000).toFixed(1) + 'K'
  return '$' + n.toFixed(0)
}

export function formatPercent(n, decimals = 2) {
  return n.toFixed(decimals) + '%'
}

export function calcCTR(clicks, impressions) {
  if (!impressions) return 0
  return (clicks / impressions) * 100
}

export function calcROAS(conversions, spend, avgOrderValue = 45) {
  if (!spend) return 0
  return (conversions * avgOrderValue) / spend
}

export function buildTrendData(campaigns) {
  const days = 30
  const result = []
  for (let i = 0; i < days; i++) {
    const date = new Date()
    date.setDate(date.getDate() - (days - 1 - i))
    const label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    const impressions = campaigns.reduce((sum, c) => sum + (c.trend?.[i] || 0) * 80, 0)
    const clicks = campaigns.reduce((sum, c) => sum + (c.trend?.[i] || 0), 0)
    result.push({ label, impressions, clicks, conversions: Math.round(clicks * 0.025) })
  }
  return result
}
