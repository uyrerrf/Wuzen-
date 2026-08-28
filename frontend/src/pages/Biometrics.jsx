import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import { biometrics } from '../utils/api'
import { Fingerprint, Eye, Activity } from 'lucide-react'

export default function BiometricsPage() {
  const { deviceId } = useParams()
  const [data, setData] = useState({ sensors: [], cameras: [] })

  useEffect(() => {
    if (deviceId) loadData()
  }, [deviceId])

  const loadData = async () => {
    const res = await biometrics.list(deviceId)
    if (res) setData(res)
  }

  return (
    <div className="animate-fade-in">
      <PageHeader title="Biometrics" icon={Fingerprint} onDeviceChange={() => {}} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="wuzen-panel p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-wuzen-muted mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4" /> Sensors
          </h3>
          <div className="space-y-2">
            {data.sensors?.map((s, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded bg-wuzen-card">
                <span className="text-sm">{s.name || s.type || `Sensor ${i + 1}`}</span>
                <span className="text-xs text-wuzen-muted font-mono">{s.vendor || 'Unknown'}</span>
              </div>
            )) || <p className="text-sm text-wuzen-muted">No sensor data</p>}
          </div>
        </div>

        <div className="wuzen-panel p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-wuzen-muted mb-4 flex items-center gap-2">
            <Eye className="w-4 h-4" /> Cameras
          </h3>
          <div className="space-y-2">
            {data.cameras?.map((c, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded bg-wuzen-card">
                <span className="text-sm">{c.facing || `Camera ${i + 1}`}</span>
                <span className="text-xs text-wuzen-muted font-mono">{c.resolution || 'Unknown'}</span>
              </div>
            )) || <p className="text-sm text-wuzen-muted">No camera data</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
