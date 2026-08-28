import { useState } from 'react'
import { useParams } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import { launch } from '../utils/api'
import { Rocket, ExternalLink, AppWindow } from 'lucide-react'

export default function LaunchIntentPage() {
  const { deviceId } = useParams()
  const [activeTab, setActiveTab] = useState('app')
  const [appPackage, setAppPackage] = useState('')
  const [linkUrl, setLinkUrl] = useState('')

  const handleLaunchApp = async () => {
    if (!deviceId || !appPackage) return
    await launch.app(deviceId, appPackage)
    setAppPackage('')
  }

  const handleLaunchLink = async () => {
    if (!deviceId || !linkUrl) return
    await launch.link(deviceId, linkUrl, activeTab === 'in-app')
    setLinkUrl('')
  }

  return (
    <div className="animate-fade-in">
      <PageHeader title="Launch Intent" icon={Rocket} onDeviceChange={() => {}} />

      <div className="wuzen-panel p-6 max-w-2xl">
        <div className="flex gap-2 mb-6">
          {['app', 'in-app', 'external'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 rounded text-xs font-mono uppercase tracking-wider border transition-all
                ${activeTab === tab ? 'bg-wuzen-primary/10 border-wuzen-primary text-wuzen-primary' : 'border-wuzen-border text-wuzen-muted'}`}
            >
              {tab === 'app' ? 'LAUNCH APP' : tab === 'in-app' ? 'IN-APP LINK' : 'EXTERNAL LINK'}
            </button>
          ))}
        </div>

        {activeTab === 'app' ? (
          <div className="space-y-4">
            <label className="text-xs text-wuzen-muted uppercase mb-1 block">Package Name</label>
            <div className="flex gap-2">
              <input 
                className="wuzen-input flex-1" 
                value={appPackage} 
                onChange={e => setAppPackage(e.target.value)}
                placeholder="com.example.app"
              />
              <button onClick={handleLaunchApp} className="wuzen-btn-primary">
                <AppWindow className="w-4 h-4" /> LAUNCH
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <label className="text-xs text-wuzen-muted uppercase mb-1 block">Enter your link</label>
            <div className="flex gap-2">
              <input 
                className="wuzen-input flex-1" 
                value={linkUrl} 
                onChange={e => setLinkUrl(e.target.value)}
                placeholder="https://..."
              />
              <button onClick={handleLaunchLink} className="wuzen-btn-primary">
                <ExternalLink className="w-4 h-4" /> LAUNCH
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
