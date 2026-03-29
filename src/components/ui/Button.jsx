import { motion } from 'framer-motion'

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-sm',
}

const variantStyles = {
  primary: {
    className: 'text-white shadow-md disabled:opacity-50 disabled:cursor-not-allowed',
    style: { background: '#3889FA', boxShadow: '0 4px 12px rgba(56,137,250,0.25)' },
    hoverStyle: { background: '#2d7ae8' },
  },
  secondary: {
    className: [
      'border border-gray-200 dark:border-gray-700',
      'bg-white dark:bg-gray-800',
      'text-gray-700 dark:text-gray-200',
      'hover:bg-gray-50 dark:hover:bg-gray-700',
      'disabled:opacity-50 disabled:cursor-not-allowed',
    ].join(' '),
    style: {},
  },
  ghost: {
    className: [
      'text-gray-600 dark:text-gray-400',
      'hover:bg-gray-100 dark:hover:bg-gray-800',
      'disabled:opacity-50 disabled:cursor-not-allowed',
    ].join(' '),
    style: {},
  },
  danger: {
    className: 'bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed',
    style: {},
  },
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  disabled,
  type = 'button',
  icon,
}) {
  const v = variantStyles[variant] ?? variantStyles.primary

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.015 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={v.style}
      className={`
        inline-flex items-center gap-2 rounded-xl font-semibold transition-all duration-150
        ${v.className} ${sizes[size]} ${className}
      `}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </motion.button>
  )
}