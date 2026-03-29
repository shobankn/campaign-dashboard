import { AnimateIn, StaggerContainer, StaggerItem } from '../../components/ui/AnimateIn'
import { useDarkMode } from '../../hooks/useDarkMode'
import { Moon, Sun, Bell, Shield, Palette } from 'lucide-react'
import { motion } from 'framer-motion'

/* ── Toggle ────────────────────────────────────────────────────────────── */
function Toggle({ enabled, onToggle }) {
  return (
    <button
      onClick={onToggle}
      role="switch"
      aria-checked={enabled}
      className="relative flex-shrink-0 w-11 h-6 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3889FA]/40"
      style={{
        background: enabled ? '#3889FA' : undefined,
        boxShadow: enabled ? '0 2px 8px rgba(56,137,250,0.35)' : undefined,
      }}
    >
      {/* Track when off */}
      {!enabled && (
        <span className="absolute inset-0 rounded-full bg-gray-200 dark:bg-gray-700 transition-colors duration-300" />
      )}

      {/* Animated thumb */}
      <motion.span
        layout
        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
        className="absolute top-[3px] w-[18px] h-[18px] bg-white rounded-full shadow-md flex items-center justify-center"
        style={{ left: enabled ? 'calc(100% - 21px)' : '3px' }}
      >
        {/* Tiny icon inside thumb */}
        {enabled
          ? <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#3889FA' }} />
          : <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
        }
      </motion.span>
    </button>
  )
}

/* ── Setting row ───────────────────────────────────────────────────────── */
function SettingRow({ label, description, children }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-100 dark:border-gray-800 last:border-0 gap-4">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{label}</p>
        {description && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 leading-relaxed">{description}</p>
        )}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  )
}

/* ── Section card ──────────────────────────────────────────────────────── */
function Section({ icon: Icon, title, children }) {
  return (
    <StaggerItem>
      <motion.div
        whileHover={{ boxShadow: '0 4px 24px rgba(56,137,250,0.07)' }}
        transition={{ duration: 0.2 }}
        className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm"
      >
        {/* Section header */}
        <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/40">
          <div
            className="w-6 h-6 rounded-lg flex items-center justify-center"
            style={{ background: 'rgba(56,137,250,0.10)' }}
          >
            <Icon className="w-3.5 h-3.5" style={{ color: '#3889FA' }} />
          </div>
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-gray-400 dark:text-gray-500">
            {title}
          </p>
        </div>

        <div className="px-5">{children}</div>
      </motion.div>
    </StaggerItem>
  )
}

/* ── Page ──────────────────────────────────────────────────────────────── */
export function Settings() {
  const { isDark, toggle } = useDarkMode()

  return (
    <div className="px-4 lg:px-6 py-6 w-full  mx-auto">
      <AnimateIn>
        <div className="mb-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.13em] text-gray-400 dark:text-gray-500 mb-1">
            Configuration
          </p>
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
            Manage your preferences and account options
          </p>
        </div>
      </AnimateIn>

      <StaggerContainer className="space-y-4">

        {/* Appearance */}
        <Section icon={Palette} title="Appearance">
          <SettingRow
            label="Dark Mode"
            description="Switch between light and dark interface theme"
          >
            <Toggle enabled={isDark} onToggle={toggle} />
          </SettingRow>
        </Section>

        {/* Notifications */}
        <Section icon={Bell} title="Notifications">
          <SettingRow
            label="Campaign Alerts"
            description="Get notified when campaigns exceed their budget threshold"
          >
            <Toggle enabled={true} onToggle={() => {}} />
          </SettingRow>
          <SettingRow
            label="Weekly Reports"
            description="Receive a performance summary every Monday morning"
          >
            <Toggle enabled={false} onToggle={() => {}} />
          </SettingRow>
        </Section>

        {/* Account */}
        <Section icon={Shield} title="Account & Security">
          <SettingRow
            label="Two-Factor Authentication"
            description="Require a verification code when signing in"
          >
            <Toggle enabled={false} onToggle={() => {}} />
          </SettingRow>
        </Section>

      </StaggerContainer>
    </div>
  )
}