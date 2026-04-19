'use client'

import { useState, useEffect, ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Clock,
  ClipboardList,
  User,
  MessageSquare,
  TrendingUp,
  Bell,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu
} from 'lucide-react'
import { useAuthStore } from '@/lib/store'
import EmployeeSidebar from '@/components/employee/EmployeeSidebar'

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
  annualLeave?: number
  sickLeave?: number
  personalLeave?: number
  workFromHome?: number
}

// Navigation items configuration
const navItems = [
  {
    category: 'Main',
    items: [
      { label: 'Dashboard', icon: LayoutDashboard, href: '/employee', active: true },
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

interface EmployeeLayoutProps {
  children: ReactNode
}

export default function EmployeeLayout({ children }: EmployeeLayoutProps) {
  const pathname = usePathname()
  const { logout } = useAuthStore()
  const [collapsed, setCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Default to collapsed on mobile
  useEffect(() => {
    if (isMobile) {
      setCollapsed(true)
    }
  }, [isMobile])

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
  const firstName = userProfile?.firstName || 'User'
  const fullName = userProfile?.fullName || firstName
  const initials = getInitials(fullName)

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#12121a] to-[#0a0a0f]">
      {/* Mobile overlay backdrop */}
      {!collapsed && isMobile && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setCollapsed(true)}
        />
      )}
      <EmployeeSidebar 
        collapsed={collapsed} 
        onToggle={() => setCollapsed(!collapsed)}
        isMobile={isMobile}
      />
      {/* Mobile hamburger button */}
      {isMobile && collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          className="fixed top-4 left-4 z-30 p-2 rounded-lg bg-bg-secondary/80 backdrop-blur-xl border border-border-glass text-text-primary hover:bg-white/10 transition-colors"
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
      )}
      <main className="min-h-screen">
        <div className={`pt-20 p-4 md:p-6 ${!isMobile ? (collapsed ? 'lg:ml-[80px]' : 'lg:ml-[280px]') : ''}`}>
          {children}
        </div>
      </main>
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
