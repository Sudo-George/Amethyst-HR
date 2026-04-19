'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, Sparkles } from 'lucide-react'
import { useAuthStore } from '@/lib/store'
import { signIn } from 'next-auth/react'

// Extended user type to include employee profile data
interface UserProfile {
  id: string
  email: string
  username: string
  fullName?: string
  firstName?: string
  lastName?: string
  phone?: string
  role?: string
  position?: string
  department?: string
  employeeId?: string
  avatar?: string
  address?: string
  joinedDate?: Date
  annualLeave?: number
  sickLeave?: number
  personalLeave?: number
  workFromHome?: number
  isActive?: boolean
}

export default function LoginPage() {
  const router = useRouter()
  const { login, isAuthenticated, logout } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isOn, setIsOn] = useState(false)

  const chainRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/hradmin')
    }
  }, [isAuthenticated, router])

   // Clear any stale auth state on mount
   useEffect(() => {
     const checkAuth = async () => {
       // Check if there's a valid session
       const isAdmin = document.cookie.includes('isAdmin=true')
       if (!isAdmin && isAuthenticated) {
         // Stale auth state, clear it
         logout()
       }
     }
     checkAuth()
   }, [isAuthenticated, logout])

  const toggleLamp = () => {
    setIsOn(prev => {
      const newState = !prev
      document.body.setAttribute('data-on', String(newState))
      document.documentElement.style.setProperty('--light', newState ? '1' : '0')
      return newState
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      if (email === 'hradmin@gmail.com' && password === 'hradmin@2026') {
        document.cookie = 'isAdmin=true; path=/'
        await login(email, password, 'admin')
        router.push('/hradmin')
        return
      }

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Invalid credentials')
      }

      const data = await response.json()
      
      // Extract user profile data from API response
      const userProfile: UserProfile = data.user
      
      // Store user profile data in localStorage for persistence
      if (typeof window !== 'undefined') {
        localStorage.setItem('userProfile', JSON.stringify(userProfile))
      }
      
      if (data.isAdmin) {
        document.cookie = 'isAdmin=true; path=/'
        await login(data.user.email, data.user.password, 'admin')
        router.push('/hradmin')
      } else {
        document.cookie = 'isAdmin=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
        await login(data.user.email, data.user.password, 'employee')
        router.push('/employee')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 md:p-8 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0a0a0f 0%, #12121a 50%, #1a1a2e 100%)',
      }}
    >
      {/* Radial Light Effect */}
      <div 
        className={`absolute left-0 top-0 w-full h-full pointer-events-none transition-opacity duration-700 ${isOn ? 'opacity-100' : 'opacity-10'}`}
        style={{
          background: 'radial-gradient(circle at 20% 50%, rgba(153, 102, 204, 0.15) 0%, rgba(26, 26, 46, 0.8) 50%, rgba(10, 10, 15, 0.95) 100%)',
        }}
      />

      {/* Ambient Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 4 + 2,
              height: Math.random() * 4 + 2,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `rgba(153, 102, 204, ${Math.random() * 0.3 + 0.1})`,
            }}
            animate={{
              y: [0, -80, 0],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: Math.random() * 15 + 10,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      {/* Left Side - Finer Lamp */}
      <div className="absolute left-[8%] top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center">
        {/* Lamp Glow */}
        <div 
          className={`absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full pointer-events-none transition-opacity duration-700`}
          style={{
            background: 'radial-gradient(circle, rgba(153, 102, 204, 0.5) 0%, rgba(153, 102, 204, 0.15) 40%, transparent 70%)',
            filter: 'blur(15px)',
            opacity: isOn ? 1 : 0.2,
            transform: 'translateX(-50%)'
          }}
        />
        
        {/* Lamp Shade */}
        <div 
          className="relative w-20 h-28 cursor-pointer select-none"
          onClick={toggleLamp}
          style={{
            background: isOn 
              ? 'linear-gradient(180deg, rgba(153, 102, 204, 0.95) 0%, rgba(153, 102, 204, 0.7) 100%)'
              : 'linear-gradient(180deg, rgba(60, 60, 80, 0.95) 0%, rgba(40, 40, 60, 0.95) 100%)',
            clipPath: 'polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)',
            boxShadow: isOn ? '0 0 30px rgba(153, 102, 204, 0.7), 0 0 60px rgba(153, 102, 204, 0.4)' : 'none',
          }}
        >
          <div 
            className="absolute bottom-2 left-1/2 -translate-x-1/2 w-5 h-10 rounded-full"
            style={{
              background: isOn 
                ? 'radial-gradient(circle, rgba(255, 255, 255, 0.95) 0%, rgba(200, 150, 255, 0.9) 50%, transparent 100%)'
                : 'rgba(60, 60, 80, 0.5)',
              filter: 'blur(3px)',
            }}
          />
        </div>

        {/* Pull Chain */}
        <button
          ref={chainRef}
          onClick={toggleLamp}
          className="mt-2 flex flex-col items-center cursor-pointer select-none"
          type="button"
        >
          <div className="w-2 h-2 rounded-full bg-gradient-to-b from-gray-400 to-gray-600" />
          <div className="w-0.5 h-16 bg-gradient-to-b from-gray-400 to-gray-300" />
          <div className="w-3 h-4 rounded-full bg-gradient-to-b from-gray-300 to-gray-500 shadow-md" />
        </button>

        {/* Lamp Base */}
        <div className="w-16 h-3 mt-1 bg-gradient-to-b from-gray-700 to-gray-900 rounded-b-lg" />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: isOn ? 0 : 1 }}
          transition={{ delay: 0.5 }}
          className="absolute -bottom-16 text-gray-500 text-xs whitespace-nowrap"
        >
          Click lamp or chain to toggle
        </motion.p>
      </div>

      {/* Right Side - Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isOn ? 1 : 0, y: isOn ? 0 : 20 }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        className="w-full max-w-sm relative z-10"
      >
        <div 
          className="card p-6 md:p-8"
          style={{
            background: 'rgba(20, 20, 35, 0.7)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(153, 102, 204, 0.2)',
            borderRadius: '24px',
            boxShadow: isOn 
              ? '0 25px 50px rgba(0, 0, 0, 0.5), 0 0 30px rgba(153, 102, 204, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
              : '0 25px 50px rgba(0, 0, 0, 0.3)'
          }}
        >
          {/* Logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
            className="text-center mb-8"
          >
            <motion.h1
              className="text-4xl font-bold font-heading"
              style={{
                background: 'linear-gradient(135deg, #9966CC 0%, #DDA0DD 50%, #9966CC 100%)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: isOn ? 'drop-shadow(0 0 20px rgba(153, 102, 204, 0.8))' : 'drop-shadow(0 0 10px rgba(153, 102, 204, 0.3))',
              }}
              animate={{
                backgroundPosition: ['0% center', '200% center'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'linear'
              }}
            >
              Amethyst Security
            </motion.h1>
            <p className="text-gray-400 mt-2 text-sm">Cybersecurity & Web Development</p>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Email Input */}
            <div className="relative">
              <Mail 
                size={20} 
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 transition-colors duration-300"
                style={{ color: isOn ? '#9966CC' : '#666' }}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-gray-900/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                style={{
                  borderColor: isOn ? 'rgba(153, 102, 204, 0.3)' : 'rgba(100, 100, 120, 0.3)',
                  boxShadow: isOn ? '0 0 20px rgba(153, 102, 204, 0.1) inset' : 'none'
                }}
                autoComplete="email"
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <Lock 
                size={20} 
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 transition-colors duration-300"
                style={{ color: isOn ? '#9966CC' : '#666' }}
              />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full pl-12 pr-12 py-4 rounded-xl bg-gray-900/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                style={{
                  borderColor: isOn ? 'rgba(153, 102, 204, 0.3)' : 'rgba(100, 100, 120, 0.3)',
                  boxShadow: isOn ? '0 0 20px rgba(153, 102, 204, 0.1) inset' : 'none'
                }}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-400 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-purple-500 focus:ring-purple-500/20"
                />
                <span className="text-gray-400 group-hover:text-gray-300 transition-colors">Remember me</span>
              </label>
              <a href="#" className="text-purple-400 hover:text-purple-300 transition-colors">
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
              className={`w-full py-4 rounded-xl font-semibold text-white transition-all duration-300 relative overflow-hidden group ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              style={{
                background: 'linear-gradient(135deg, #9966CC 0%, #7B4BB9 100%)',
                boxShadow: isOn 
                  ? '0 4px 20px rgba(153, 102, 204, 0.4), 0 0 40px rgba(153, 102, 204, 0.2)'
                  : '0 4px 15px rgba(100, 60, 150, 0.3)',
              }}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isLoading ? (
                  <Sparkles className="animate-spin" size={20} />
                ) : (
                  'Sign In'
                )}
              </span>
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: 'linear-gradient(135deg, #BB88DD 0%, #9966CC 100%)',
                }}
              />
            </motion.button>

            {/* SSO Options */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-[#141423] text-gray-500">Or continue with</span>
              </div>
            </div>

            {/* Social Login */}
            <div className="flex gap-4">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => signIn('google', { callbackUrl: '/api/auth/callback' })}
                className="flex-1 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white flex items-center justify-center gap-2 hover:bg-gray-700/50 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </motion.button>
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white flex items-center justify-center gap-2 hover:bg-gray-700/50 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z"/>
                </svg>
                Microsoft
              </motion.button>
            </div>
          </form>

           <p className="text-center mt-6 text-gray-400">
             Don&apos;t have an account?{' '}
             <a href="/signup" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
               Sign up
             </a>
           </p>
        </div>
      </motion.div>

      {/* Mobile Toggle Button */}
      <motion.button
        onClick={toggleLamp}
        className="lg:hidden fixed bottom-8 right-8 z-50 p-4 rounded-full"
        style={{
          background: isOn 
            ? 'linear-gradient(135deg, #9966CC 0%, #7B4BB9 100%)'
            : 'linear-gradient(135deg, #3a3a4a 0%, #2a2a3a 100%)',
          boxShadow: isOn 
            ? '0 0 30px rgba(153, 102, 204, 0.5)'
            : '0 4px 15px rgba(0, 0, 0, 0.3)'
        }}
        whileTap={{ scale: 0.9 }}
        type="button"
      >
        <Sparkles size={24} className="text-white" />
      </motion.button>
    </div>
  )
}
