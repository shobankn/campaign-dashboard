const config = {
  active: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 ring-1 ring-emerald-200 dark:ring-emerald-800',
  paused: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 ring-1 ring-amber-200 dark:ring-amber-800',
  ended: 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 ring-1 ring-gray-200 dark:ring-gray-700',
  draft: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 ring-1 ring-blue-200 dark:ring-blue-800',
}

const dots = {
  active: 'bg-emerald-500',
  paused: 'bg-amber-500',
  ended: 'bg-gray-400',
  draft: 'bg-blue-500',
}

export function Badge({ status }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${config[status] || config.draft}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dots[status] || dots.draft}`} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}
