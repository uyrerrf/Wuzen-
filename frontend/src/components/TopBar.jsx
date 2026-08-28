import { useStore } from '../store'
import { Wifi, WifiOff, Clock, Server } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function TopBar() {
  const { wsConnected, user, sidebarOpen } = useStore()
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <header className={`h-16 bg-wuzen-panel border-b border-wuzen-border flex items-center justify-between px-6 transition-all duration-300 ${sidebarOpen ? 'ml-0' : 'ml-0'}`}>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-xs text-wuzen-muted font-mono">
          <Server className="w-3 h-3" />
          <span>LATENCY</span>
          <span className="text-wuzen-primary">{Math.floor(Math.random() * 200 + 50)}ms</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-wuzen-muted font-mono">
          <span className="text-wuzen-success">UPLINK ACTIVE</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-wuzen-muted font-mono">
          <span>DEVICES</span>
          <span className="text-wuzen-primary">3</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-wuzen-muted font-mono">
          <span>THREATS</span>
          <span className="text-wuzen-secondary">8</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-xs text-wuzen-muted font-mono">
          <Clock className="w-3 h-3" />
          <span>{time.toISOString().split('T')[1].split('.')[0]} UTC</span>
        </div>
        <div className="flex items-center gap-2">
          {wsConnected ? (
            <Wifi className="w-4 h-4 text-wuzen-success" />
          ) : (
            <WifiOff className="w-4 h-4 text-wuzen-danger" />
          )}
          <span className="text-xs text-wuzen-muted">{user?.username || 'Operator'}</span>
        </div>
      </div>
    </header>
  )
}
