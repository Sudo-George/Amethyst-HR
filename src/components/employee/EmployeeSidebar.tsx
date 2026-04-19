'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Clock,
  CalendarDays,
  ClipboardList,
  User,
  MessageSquare,
  TrendingUp,
  Bell,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Mail,
  Fingerprint,
  FileText,
  Users,
  BarChart3,
  Star,
  AlertCircle,
  CheckCircle,
  LucideIcon
} from 'lucide-react'
import { useAuthStore } from '@/lib/store'

// User Profile type
interface UserProfile {
  id: string
  email: string
  username: string
  fullName?: string
  firstName?: string
  lastName?: string
  role?: string
  position?: string
  department?: string
  employeeId?: string
}

// Navigation items configuration
interface NavItem {
  label: string
  icon: LucideIcon
  href: string
  badge?: number
}

interface NavCategory {
  category: string
  items: NavItem[]
}

const navItems: NavCategory[] = [
  {
    category: 'Main',
    items: [
      { label: 'Dashboard', icon: LayoutDashboard, href: '/employee' },
      { label: 'Attendance', icon: Clock, href: '/employee/attendance' },
      { label: 'Leave Management', icon: ClipboardList, href: '/employee/leave' },
      { label: 'My Profile', icon: User, href: '/employee/profile' },
    ]
  },
  {
    category: 'Communication',
    items: [
      { label: 'Messages', icon: MessageSquare, href: '/employee/messages', badge: 3 },
      { label: 'Notifications', icon: Bell, href: '/employee/notifications', badge: 5 },
    ]
  },
  {
    category: 'Performance',
    items: [
      { label: 'Performance', icon: TrendingUp, href: '/employee/performance' },
      { label: 'Settings', icon: Settings, href: '/employee/settings' },
    ]
  }
]

interface EmployeeSidebarProps {
  children?: React.ReactNode
  isMobile?: boolean
  collapsed?: boolean
  onToggle?: () => void
}

export default function EmployeeSidebar({ children, isMobile = false, collapsed = false, onToggle }: EmployeeSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)

  // Load user profile from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('userProfile')
      if (stored) {
        try {
          setUserProfile(JSON.parse(stored))
        } catch (e) {
          console.error('Failed to parse user profile:', e)
        }
      }
    }
  }, [])

  // Get user info
  const firstName = userProfile?.firstName || user?.email?.split('@')[0] || 'User'
  const fullName = userProfile?.fullName || firstName
  const initials = getInitials(fullName)
  const userRole = userProfile?.role || user?.role || 'employee'

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userProfile')
    }
    logout()
    router.push('/login')
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#12121a] to-[#0a0a0f]">
      {/* Glassmorphic Sidebar */}
      <motion.aside
        initial={false}
        animate={{ 
          width: collapsed ? 80 : 280,
          x: isMobile && collapsed ? -280 : 0
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed left-0 top-0 h-screen flex flex-col z-50"
        style={{
          background: 'rgba(20, 20, 35, 0.8)',
          backdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(153, 102, 204, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
        }}
      >
        {/* Logo Section */}
        <div className="p-4 flex items-center justify-between border-b border-white/5">
          <motion.div
            className="flex items-center gap-3"
            animate={{ opacity: collapsed ? 0 : 1 }}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#9966CC] to-[#7b4bb3] flex items-center justify-center shadow-lg">
              <span className="text-xl font-bold text-white">A</span>
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                >
                  <h1 className="text-lg font-bold text-white">Amethyst</h1>
                  <p className="text-xs text-gray-500">Employee Portal</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          
          {/* Collapse Toggle */}
          <button
            onClick={onToggle}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            {collapsed ? (
              <ChevronRight size={18} className="text-gray-400" />
            ) : (
              <ChevronLeft size={18} className="text-gray-400" />
            )}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
          {navItems.map((category, catIndex) => (
            <div key={category.category}>
              <AnimatePresence>
                {!collapsed && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="px-3 mb-2 text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {category.category}
                  </motion.p>
                )}
              </AnimatePresence>
              
              <div className="space-y-1">
                {category.items.map((item) => {
                  const isActive = pathname === item.href
                  const Icon = item.icon
                  
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${
                        isActive
                          ? 'bg-gradient-to-r from-[#9966CC]/20 to-[#9966CC]/10 text-white'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {/* Active indicator */}
                      {isActive && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#9966CC] rounded-r-full"
                        />
                      )}
                      
                      <div className={`relative ${isActive ? 'text-[#9966CC]' : 'text-gray-500 group-hover:text-[#9966CC]'}`}>
                        <Icon size={20} />
                        {item.badge && (
                          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      
                      <AnimatePresence>
                        {!collapsed && (
                          <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className={`text-sm font-medium ${isActive ? 'text-white' : ''}`}
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>
                      
                      {/* Glow effect on hover */}
                      <div className="absolute inset-0 rounded-xl bg-[#9966CC]/0 group-hover:bg-[#9966CC]/5 transition-colors" />
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom Section - User & Logout */}
        <div className="p-3 border-t border-white/5">
          {/* User Profile Preview */}
          <div className={`flex items-center gap-3 p-3 rounded-xl bg-white/5 mb-3 ${collapsed ? 'justify-center' : ''}`}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#9966CC] to-[#7b4bb3] flex items-center justify-center flex-shrink-0 shadow-lg">
              <span className="text-sm font-semibold text-white">{initials}</span>
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 min-w-0"
                >
                  <p className="text-sm font-medium text-white truncate">{fullName}</p>
                  <p className="text-xs text-gray-500 truncate capitalize">{userRole}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 group ${
              collapsed ? 'justify-center' : ''
            }`}
          >
            <LogOut size={20} className="flex-shrink-0 group-hover:scale-110 transition-transform" />
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-sm font-medium"
                >
                  Sign Out
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <motion.main
        initial={false}
        animate={{ marginLeft: collapsed ? 80 : 280 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="flex-1 min-h-screen"
      >
        {/* Top Header Bar */}
        <header className="h-16 px-6 flex items-center justify-between border-b border-white/5 bg-black/20 backdrop-blur-xl sticky top-0 z-40">
          {/* Left - Greeting */}
          <div>
            <h2 className="text-lg font-semibold text-white">
              Welcome back, {firstName}!
            </h2>
            <p className="text-xs text-gray-500">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* Right - Quick Actions & User */}
          <div className="flex items-center gap-4">
            {/* Quick Clock In/Out */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#9966CC] to-[#7b4bb3] text-white text-sm font-medium"
            >
              <Fingerprint size={18} />
              Clock In
            </motion.button>

            {/* Notifications */}
            <button className="p-2 rounded-lg hover:bg-white/5 transition-colors relative">
              <Bell size={20} className="text-gray-400" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#9966CC] rounded-full" />
            </button>

            {/* User Avatar (Top Right) */}
            <div className="flex items-center gap-3 pl-4 border-l border-white/10">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#9966CC] to-[#7b4bb3] flex items-center justify-center shadow-lg">
                <span className="text-sm font-semibold text-white">{initials}</span>
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-white">{fullName}</p>
                <p className="text-xs text-gray-500 capitalize">{userRole}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">
          {children}
        </div>
      </motion.main>
    </div>
  )
}

// Helper function to generate initials
function getInitials(name: string): string {
  if (!name) return 'U'
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return name.slice(0, 2).toUpperCase()
}