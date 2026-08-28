import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import DataTable from '../components/DataTable'
import { location } from '../utils/api'
import { MapPin, Navigation, Crosshair } from 'lucide-react'

export default function LocationPage() {
  const { deviceId } = useParams()
  const [locations, setLocations] = useState([])
  const [latest, setLatest] = useState(null)

  useEffect(() => {
    if (deviceId) loadData()
  }, [deviceId])

  const loadData = async () => {
    const [l, latestLoc] = await Promise.all([
      location.list(deviceId),
      location.latest(deviceId)
    ])
    if (l) setLocations(l)
    if (latestLoc) setLatest(latestLoc)
  }

  const columns = [
    { key: 'latitude', label: 'Latitude', render: (row) => <span className="font-mono">{row.latitude}</span> },
    { key: 'longitude', label: 'Longitude', render: (row) => <span className="font-mono">{row.longitude}</span> },
    { key: 'accuracy', label: 'Accuracy', render: (row) => <span>{row.accuracy}m</span> },
    { key: 'speed', label: 'Speed', render: (row) => <span>{row.speed ? `${row.speed} m/s` : 'Stationary'}</span> },
    { key: 'provider', label: 'Provider' },
    { key: 'recorded_at', label: 'Time', render: (row) => (
      <span className="text-xs font-mono">{new Date(row.recorded_at).toLocaleString()}</span>
    )}
  ]

  return (
    <div className="animate-fade-in">
      <PageHeader title="Location Tracking" icon={MapPin} onDeviceChange={() => {}} />

      {latest && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="wuzen-panel p-6">
            <div className="flex items-center gap-2 mb-4">
              <Crosshair className="w-4 h-4 text-wuzen-primary" />
              <h3 className="text-sm font-semibold uppercase tracking-wider text-wuzen-muted">Current Position</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-xs text-wuzen-muted">Latitude</span>
                <span className="font-mono text-wuzen-primary">{latest.latitude}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-wuzen-muted">Longitude</span>
                <span className="font-mono text-wuzen-primary">{latest.longitude}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-wuzen-muted">Accuracy</span>
                <span className="font-mono">{latest.accuracy}m</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-wuzen-muted">Altitude</span>
                <span className="font-mono">{latest.altitude || 0}m</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-wuzen-muted">Speed</span>
                <span className="font-mono">{latest.speed || 0} m/s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-wuzen-muted">Provider</span>
                <span className="font-mono">{latest.provider}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 wuzen-panel p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-wuzen-muted mb-4">Location History</h3>
            <DataTable columns={columns} data={locations} keyField="id" />
          </div>
        </div>
      )}
    </div>
  )
}
