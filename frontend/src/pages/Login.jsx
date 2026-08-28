import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store'
import { auth } from '../utils/api'
import { Zap, Lock, User } from 'lucide-react'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { setAuth } = useStore()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const data = await auth.login(username, password)
      if (data.token) {
        setAuth(data.token, data.user)
        navigate('/')
      } else {
        setError(data.error || 'Login failed')
      }
    } catch (err) {
      setError('Connection error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-wuzen-bg flex items-center justify-center relative overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(0,212,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* World map background */}
      <div className="absolute inset-0 opacity-5">
        <svg viewBox="0 0 1000 500" className="w-full h-full">
          <path fill="currentColor" className="text-wuzen-primary" d="M150,100 Q200,80 250,120 T350,100 T450,130 T550,90 T650,110 T750,100 T850,120" />
        </svg>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-wuzen-primary to-wuzen-accent rounded-lg flex items-center justify-center animate-pulse-glow">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold tracking-widest text-wuzen-primary glow-text">WUZEN</h1>
              <p className="text-[10px] text-wuzen-muted tracking-[0.3em]">POWERED BY WUZEN</p>
            </div>
          </div>
          <p className="text-xs text-wuzen-muted font-mono tracking-wider">SECURE TERMINAL // TIER-3 // ZERO-TRUST</p>
        </div>

        <div className="wuzen-panel p-8">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-sm bg-wuzen-secondary" />
              <span className="text-xs text-wuzen-secondary font-mono">DEFCON-2</span>
              <span className="text-xs text-wuzen-muted font-mono">UPLINK QUARANTINED - MFA REQUIRED</span>
            </div>
            <div className="flex gap-2 mt-2">
              <div className="flex-1 h-1 bg-wuzen-border rounded overflow-hidden">
                <div className="h-full bg-wuzen-primary w-3/4" />
              </div>
              <span className="text-[10px] text-wuzen-muted font-mono">CPU</span>
              <div className="flex-1 h-1 bg-wuzen-border rounded overflow-hidden">
                <div className="h-full bg-wuzen-primary w-1/2" />
              </div>
              <span className="text-[10px] text-wuzen-muted font-mono">NET</span>
              <div className="flex-1 h-1 bg-wuzen-border rounded overflow-hidden">
                <div className="h-full bg-wuzen-primary w-2/3" />
              </div>
              <span className="text-[10px] text-wuzen-muted font-mono">RAM</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-wuzen-muted uppercase tracking-wider mb-1 block">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-wuzen-muted" />
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="wuzen-input w-full pl-10"
                  placeholder="username"
                  required
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-wuzen-muted uppercase tracking-wider mb-1 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-wuzen-muted" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="wuzen-input w-full pl-10"
                  placeholder="**********"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-wuzen-muted cursor-pointer">
                <input type="checkbox" className="rounded bg-wuzen-bg border-wuzen-border" />
                Trust this terminal for 24h
              </label>
              <button type="button" className="text-wuzen-primary hover:underline">Lost key?</button>
            </div>

            {error && (
              <div className="p-3 rounded bg-wuzen-danger/10 border border-wuzen-danger/30 text-wuzen-danger text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="wuzen-btn-primary w-full py-3 font-mono tracking-wider"
            >
              {loading ? 'AUTHENTICATING...' : 'LOGIN'}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-wuzen-border">
            <div className="flex gap-2">
              <button className="flex-1 wuzen-btn border border-wuzen-border text-wuzen-muted text-xs">
                SSO - Federation
              </button>
              <button className="flex-1 wuzen-btn border border-wuzen-border text-wuzen-muted text-xs">
                Hardware Token
              </button>
            </div>
          </div>

          <div className="mt-4 text-[10px] text-wuzen-muted font-mono space-y-1">
            <div className="flex justify-between">
              <span>ENCRYPTION</span>
              <span className="text-wuzen-primary">X25519 + AES-256-GCM</span>
            </div>
            <div className="flex justify-between">
              <span>POLICY</span>
              <span className="text-wuzen-primary">ZERO-TRUST - MFA REQUIRED</span>
            </div>
            <div className="flex justify-between">
              <span>CONSOLE</span>
              <span className="text-wuzen-primary">term-58AE-E623</span>
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-between text-[10px] text-wuzen-muted font-mono">
          <span>STATUS: INTRUSION</span>
          <span>GLOBAL: 98.6%</span>
          <span>UTC: {new Date().toISOString().split('T')[1].split('.')[0]}</span>
        </div>
      </div>
    </div>
  )
}
