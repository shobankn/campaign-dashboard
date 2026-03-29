import { Sun, Moon, Menu, Bell } from 'lucide-react'
import { useDarkMode } from '../../hooks/useDarkMode'
import { motion, AnimatePresence } from 'framer-motion'

export function Header({ onMenuClick }) {
  const { isDark, toggle } = useDarkMode()

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
      <div className="flex items-center justify-between px-4 lg:px-6 h-14">

        {/* Left — mobile menu */}
        <div className="flex items-center gap-3">
          <motion.button
            whileTap={{ scale: 0.93 }}
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Right — actions */}
        <div className="flex items-center gap-1">

          {/* Bell */}
          <motion.button
            whileTap={{ scale: 0.93 }}
            className="relative p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <Bell className="w-4 h-4" />
            {/* Notification dot */}
            <span
              className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
              style={{ background: '#3889FA', boxShadow: '0 0 0 2px white' }}
            />
          </motion.button>

          {/* Dark mode toggle */}
          <motion.button
            whileTap={{ scale: 0.93 }}
            onClick={toggle}
            className="relative p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors overflow-hidden"
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <AnimatePresence mode="wait" initial={false}>
              {isDark ? (
                <motion.span
                  key="sun"
                  initial={{ opacity: 0, rotate: -45, scale: 0.8 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 45, scale: 0.8 }}
                  transition={{ duration: 0.18 }}
                  className="block"
                >
                  <Sun className="w-4 h-4" />
                </motion.span>
              ) : (
                <motion.span
                  key="moon"
                  initial={{ opacity: 0, rotate: 45, scale: 0.8 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: -45, scale: 0.8 }}
                  transition={{ duration: 0.18 }}
                  className="block"
                >
                  <Moon className="w-4 h-4" />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Divider */}
          <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-1" />

          {/* Avatar */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative w-8 h-8 rounded-xl flex items-center justify-center ml-0.5 flex-shrink-0"
            style={{ background: '#3889FA', boxShadow: '0 2px 8px rgba(56,137,250,0.30)' }}
          >
            <span className="text-[11px] font-bold text-white tracking-wide">AD</span>
            {/* Online indicator */}
            <span
              className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-gray-900 bg-emerald-400"
            />
          </motion.button>
        </div>
      </div>
    </header>
  )
}