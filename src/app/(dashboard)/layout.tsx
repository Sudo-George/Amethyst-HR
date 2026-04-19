'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LayoutDashboard, 
  Users, 
  Clock, 
  DollarSign, 
  Calendar, 
  TrendingUp, 
  Menu,
  ChevronLeft,
  LogOut,
  UserCog
} from 'lucide-react'
import { Sidebar } from '@/components/layout/Sidebar'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/lib/store'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const pathname = usePathname()
  
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
      setSidebarCollapsed(true)
    }
  }, [isMobile])
  
  // Check if we're on employee routes - they have their own sidebar
  const isEmployeeRoute = pathname?.startsWith('/employee')

  // Don't show global sidebar for employee pages
  if (isEmployeeRoute) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#12121a] to-[#0a0a0f]">
        <div className="pt-20">
          {children}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#12121a] to-[#0a0a0f]">
      {/* Mobile overlay backdrop */}
      {!sidebarCollapsed && isMobile && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
        isMobile={isMobile}
      />
      {/* Mobile hamburger button (visible only when sidebar is collapsed on mobile) */}
      {isMobile && sidebarCollapsed && (
        <button
          onClick={() => setSidebarCollapsed(false)}
          className="fixed top-4 left-4 z-30 p-2 rounded-lg bg-bg-secondary/80 backdrop-blur-xl border border-border-glass text-text-primary hover:bg-white/10 transition-colors"
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
      )}
      <main className="transition-all duration-300 min-h-screen">
        <div 
          className={`pt-20 p-4 md:p-6 ${!isMobile ? (sidebarCollapsed ? 'lg:ml-[80px]' : 'lg:ml-[280px]') : ''}`}
        >
          {children}
        </div>
      </main>
    </div>
  )
}