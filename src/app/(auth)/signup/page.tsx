'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, Sparkles, User } from 'lucide-react'
import { useAuthStore } from '@/lib/store'

export default function SignUpPage() {
  const router = useRouter()
  const { login, isAuthenticated } = useAuthStore()
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
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

    if (!email || !username || !password || !confirmPassword) {
      setError('Please fill in all fields')
      return
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Registration failed')
      }

      router.push('/login?registered=true')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
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

      {/* Left Side - Lamp */}
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

      {/* Right Side - Sign Up Card */}
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
            className="text-center mb-6"
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
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Username Input */}
            <div className="relative">
              <User 
                size={20} 
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 transition-colors duration-300"
                style={{ color: isOn ? '#9966CC' : '#666' }}
              />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-900/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                style={{
                  borderColor: isOn ? 'rgba(153, 102, 204, 0.3)' : 'rgba(100, 100, 120, 0.3)',
                  boxShadow: isOn ? '0 0 20px rgba(153, 102, 204, 0.1) inset' : 'none'
                }}
                autoComplete="username"
              />
            </div>

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
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-900/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
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
                className="w-full pl-12 pr-12 py-3 rounded-xl bg-gray-900/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                style={{
                  borderColor: isOn ? 'rgba(153, 102, 204, 0.3)' : 'rgba(100, 100, 120, 0.3)',
                  boxShadow: isOn ? '0 0 20px rgba(153, 102, 204, 0.1) inset' : 'none'
                }}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-400 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Confirm Password Input */}
            <div className="relative">
              <Lock 
                size={20} 
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 transition-colors duration-300"
                style={{ color: isOn ? '#9966CC' : '#666' }}
              />
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-900/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                style={{
                  borderColor: isOn ? 'rgba(153, 102, 204, 0.3)' : 'rgba(100, 100, 120, 0.3)',
                  boxShadow: isOn ? '0 0 20px rgba(153, 102, 204, 0.1) inset' : 'none'
                }}
                autoComplete="new-password"
              />
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 rounded-xl font-semibold text-white transition-all duration-300 relative overflow-hidden group"
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
                  'Sign Up'
                )}
              </span>
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: 'linear-gradient(135deg, #BB88DD 0%, #9966CC 100%)',
                }}
              />
            </motion.button>

            <p className="text-center mt-4 text-gray-400 text-sm">
              Already have an account?{' '}
              <a href="/login" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                Sign In
              </a>
            </p>
          </form>
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