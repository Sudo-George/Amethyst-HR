'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LayoutDashboard, 
  Users, 
  Clock, 
  DollarSign, 
  Calendar, 
  TrendingUp, 
  Menu, 
  X,
  LogOut,
  Settings,
  ChevronLeft,
  UserCog
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/lib/store'

const navItems = [
  { href: '/hradmin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/employees', icon: Users, label: 'Employees' },
  { href: '/attendance', icon: Clock, label: 'Attendance' },
  { href: '/payroll', icon: DollarSign, label: 'Payroll' },
  { href: '/leave', icon: Calendar, label: 'Leave' },
  { href: '/performance', icon: TrendingUp, label: 'Performance' },
  { href: '/users', icon: UserCog, label: 'User Management' },
]

interface SidebarProps {
  collapsed?: boolean
  onToggle?: () => void
  isMobile?: boolean
}

export function Sidebar({ collapsed = false, onToggle, isMobile = false }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { logout } = useAuthStore()
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <motion.aside
      initial={false}
      animate={{ 
        width: collapsed ? 80 : 280,
        x: isMobile && collapsed ? -280 : 0
      }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed left-0 top-0 h-screen bg-bg-primary/95 backdrop-blur-xl border-r border-border-glass z-50 flex flex-col"
    >
      {/* Logo */}
      <div className="h-20 flex items-center justify-between px-4 border-b border-border-glass">
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3"
            >
              <motion.div
                className="w-10 h-10 rounded-xl gradient-amethyst flex items-center justify-center"
                animate={{
                  boxShadow: ['0 0 20px rgba(153, 102, 204, 0.5)', '0 0 40px rgba(153, 102, 204, 0.8)', '0 0 20px rgba(153, 102, 204, 0.5)'],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="text-xl font-bold text-white">A</span>
              </motion.div>
              <span className="text-xl font-bold text-gradient font-heading">Amethyst Security</span>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={onToggle}
          className="p-2 rounded-lg hover:bg-white/5 transition-colors text-text-secondary hover:text-text-primary"
        >
          {collapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300',
                isActive 
                  ? 'bg-amethyst/10 text-amethyst' 
                  : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
              )}
              onMouseEnter={() => setHoveredItem(item.href)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-amethyst rounded-r-full"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}

              <Icon size={22} className={cn(isActive && 'text-amethyst')} />
              
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="font-medium"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>

              {/* Glow effect on hover */}
              {(hoveredItem === item.href || isActive) && (
                <motion.div
                  className="absolute inset-0 bg-amethyst/5 rounded-xl -z-10"
                  layoutId="hoverGlow"
                  transition={{ duration: 0.2 }}
                />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Bottom section */}
      <div className="p-3 border-t border-border-glass space-y-2">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all"
        >
          <Settings size={22} />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-medium"
              >
                Settings
              </motion.span>
            )}
          </AnimatePresence>
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-error hover:bg-error/10 transition-all"
        >
          <LogOut size={22} />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-medium"
              >
                Sign Out
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  )
}