import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Megaphone, Users, FileText, Settings, Zap, ChevronLeft, X, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import data from '../../data/campaigns.json';

const nav = [
  { label: 'Dashboard', to: '/', icon: LayoutDashboard },
  { label: 'Campaigns', to: '/campaigns', icon: Megaphone },
  { label: 'Clients', to: '/clients', icon: Users },
  { label: 'Creative Brief', to: '/brief', icon: FileText },
  { label: 'Settings', to: '/settings', icon: Settings },
];

function NavItem({ item, collapsed }) {
  return (
    <NavLink
      to={item.to}
      end={item.to === '/'}
      className={({ isActive }) =>
        `w-full flex items-center gap-3 px-3 py-2.5 rounded-[6px] transition-all duration-200 group
        ${isActive
          ? 'bg-[var(--brand)] text-white shadow-lg shadow-[var(--brand-glow)]'
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <item.icon 
            className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 
              ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} 
            strokeWidth={isActive ? 2.5 : 2} 
          />
          
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="tracking-tight rob-medium whitespace-nowrap"
              >
                {item.label}
              </motion.span>
            )}
          </AnimatePresence>

          {collapsed && (
            <div className="absolute left-full ml-3 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs font-semibold rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
              {item.label}
            </div>
          )}
        </>
      )}
    </NavLink>
  );
}

// Logout Modal (Same as your admin panel)
const LogoutModal = ({ onConfirm, onCancel, loading }) => (
  <AnimatePresence>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/30 backdrop-blur-[3px]"
      onClick={onCancel}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 16 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-[90vw] max-w-[380px] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Blue accent bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[var(--brand)] to-[#60a5fa]" />

        <div className="px-7 pt-7 pb-6">
          <div className="flex items-center justify-center mb-5">
            <div className="w-[60px] h-[60px] rounded-full bg-[#EEF5FF] dark:bg-gray-800 flex items-center justify-center">
              <div className="w-[42px] h-[42px] rounded-full bg-[var(--brand)]/10 flex items-center justify-center">
                <LogOut className="w-6 h-6 text-[var(--brand)]" />
              </div>
            </div>
          </div>

          <h3 className="text-[17px] rob-semibold text-gray-900 dark:text-white text-center mb-2">
            Sign out of your account?
          </h3>
          <p className="text-[13.5px] rob-medium text-gray-500 dark:text-gray-400 text-center leading-relaxed mb-7">
            You'll be redirected to the login page. Any unsaved changes will be lost.
          </p>

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Stay signed in
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-white font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <>Signing out...</>
              ) : (
                <>Sign out</>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  </AnimatePresence>
);

export function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }) {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      // Clear token from localStorage
      localStorage.removeItem('accessToken');
      // Optional: clear other items if needed
      // localStorage.clear();

      setTimeout(() => {
        navigate('/login');
      }, 600);
    } catch (err) {
      console.error('Logout error:', err);
      setLogoutLoading(false);
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo Section */}
      <div className={`flex items-center ${collapsed ? 'justify-center px-3' : 'justify-between px-6'} py-4 border-b border-gray-100 dark:border-gray-800`}>
        <div className="flex items-center gap-3">
          {!collapsed && (
            <>
              <div className="flex items-center w-[53px]">
                <div className="w-10 h-10 bg-[var(--brand)] rounded-2xl flex items-center justify-center shadow-lg shadow-[var(--brand-glow)]">
                  <Zap className="w-5 h-5 text-white" strokeWidth={2.5} />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-[20px] whitespace-nowrap rob-semibold text-[var(--brand)] tracking-tight leading-tight">
                  AdPlatform
                </span>
                <span className="text-xs text-[#003374] dark:text-gray-400 rob-semibold">Campaign Manager</span>
              </div>
            </>
          )}

          {collapsed && (
            <div className="w-10 h-10 bg-[var(--brand)] rounded-2xl flex items-center justify-center shadow-lg shadow-[var(--brand-glow)]">
              <Zap className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
          )}
        </div>

        <button
          onClick={onToggle}
          className="hidden lg:flex p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 transition-all"
        >
          <ChevronLeft className={`w-4 h-4 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} />
        </button>

        <button 
          onClick={onMobileClose} 
          className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        {nav.map((item) => (
          <NavItem key={item.to} item={item} collapsed={collapsed} />
        ))}
      </nav>

      {/* Footer + Logout */}
      {!collapsed && (
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 space-y-4">
          {/* Active Clients Info */}
          <div className="bg-[var(--brand-light)] dark:bg-gray-800 rounded-xl p-4 text-center">
            <p className="text-sm font-semibold text-[var(--brand)]">
              {data.clients.length} Active Clients
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {data.campaigns.filter((c) => c.status === 'active').length} running campaigns
            </p>
          </div>

          {/* User Profile + Logout Button */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-[var(--brand)] rounded-full flex items-center justify-center text-white font-semibold">
                AD
              </div>
              <div>
                <p className="text-sm rob-medium text-gray-900 dark:text-white">Admin User</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">admin@adplatform.com</p>
              </div>
            </div>

            <button
              onClick={() => setShowLogoutModal(true)}
              className="p-2.5 text-gray-400 hover:text-[var(--brand)] hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all"
              title="Sign out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 68 : 268 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="hidden lg:flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 h-screen sticky top-0 shadow-sm overflow-hidden"
      >
        {sidebarContent}
      </motion.aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 z-50 bg-black/30 backdrop-blur-[3px]"
              onClick={onMobileClose}
            />

            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="lg:hidden fixed left-0 top-0 bottom-0 z-[60] w-68 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-xl"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Logout Modal */}
      <AnimatePresence>
        {showLogoutModal && (
          <LogoutModal
            onConfirm={handleLogout}
            onCancel={() => setShowLogoutModal(false)}
            loading={logoutLoading}
          />
        )}
      </AnimatePresence>
    </>
  );
}