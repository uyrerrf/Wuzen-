import { useEffect, useState } from 'react'
import PageHeader from '../components/PageHeader'
import { api } from '../utils/api'
import { Settings, Server, Key, Wifi, Database } from 'lucide-react'

export default function SettingsPage() {
  const [c2Config, setC2Config] = useState({})

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    const data = await api.get('/settings/c2')
    if (data) setC2Config(data)
  }

  return (
    <div className="animate-fade-in">
      <PageHeader title="Settings" icon={Settings} deviceSelector={false} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="wuzen-panel p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-wuzen-muted mb-4 flex items-center gap-2">
            <Server className="w-4 h-4" /> C2 Configuration
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 rounded bg-wuzen-card">
              <span className="text-sm text-wuzen-muted">WebSocket Endpoint</span>
              <span className="font-mono text-xs text-wuzen-primary">{c2Config.wsEndpoint}</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded bg-wuzen-card">
              <span className="text-sm text-wuzen-muted">MQTT Broker</span>
              <span className="font-mono text-xs text-wuzen-primary">{c2Config.mqttBroker}</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded bg-wuzen-card">
              <span className="text-sm text-wuzen-muted">Encryption</span>
              <span className="font-mono text-xs text-wuzen-success">{c2Config.encryption}</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded bg-wuzen-card">
              <span className="text-sm text-wuzen-muted">Heartbeat Interval</span>
              <span className="font-mono text-xs">{c2Config.heartbeatInterval}s</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded bg-wuzen-card">
              <span className="text-sm text-wuzen-muted">Command Timeout</span>
              <span className="font-mono text-xs">{c2Config.commandTimeout}s</span>
            </div>
          </div>
        </div>

        <div className="wuzen-panel p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-wuzen-muted mb-4 flex items-center gap-2">
            <Database className="w-4 h-4" /> Storage & Encryption
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-wuzen-muted uppercase mb-1 block">Master Encryption Key</label>
              <div className="flex gap-2">
                <input type="password" className="wuzen-input flex-1 font-mono text-xs" value="************************" readOnly />
                <button className="wuzen-btn border border-wuzen-border text-wuzen-muted text-xs">Rotate</button>
              </div>
            </div>
            <div>
              <label className="text-xs text-wuzen-muted uppercase mb-1 block">JWT Secret</label>
              <div className="flex gap-2">
                <input type="password" className="wuzen-input flex-1 font-mono text-xs" value="************************" readOnly />
                <button className="wuzen-btn border border-wuzen-border text-wuzen-muted text-xs">Rotate</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
