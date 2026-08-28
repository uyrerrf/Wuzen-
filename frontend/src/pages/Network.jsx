import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import DataTable from '../components/DataTable'
import { network } from '../utils/api'
import { Wifi, Globe, Shield } from 'lucide-react'

export default function NetworkPage() {
  const { deviceId } = useParams()
  const [events, setEvents] = useState([])

  useEffect(() => { if (deviceId) loadEvents() }, [deviceId])

  const loadEvents = async () => {
    const data = await network.list(deviceId)
    if (data) setEvents(data)
  }

  const columns = [
    { key: 'event_type', label: 'Event' },
    { key: 'ssid', label: 'SSID', render: (row) => (
      <span className="font-mono text-xs">{row.ssid || 'N/A'}</span>
    )},
    { key: 'ip_address', label: 'IP', render: (row) => (
      <span className="font-mono text-xs text-wuzen-primary">{row.ip_address}</span>
    )},
    { key: 'gateway', label: 'Gateway', render: (row) => (
      <span className="font-mono text-xs">{row.gateway}</span>
    )},
    { key: 'is_vpn', label: 'VPN', render: (row) => (
      <span className={`text-xs ${row.is_vpn ? 'text-wuzen-danger' : 'text-wuzen-muted'}`}>{row.is_vpn ? 'YES' : 'No'}</span>
    )},
    { key: 'is_proxy', label: 'Proxy', render: (row) => (
      <span className={`text-xs ${row.is_proxy ? 'text-wuzen-warning' : 'text-wuzen-muted'}`}>{row.is_proxy ? 'YES' : 'No'}</span>
    )},
    { key: 'recorded_at', label: 'Time', render: (row) => (
      <span className="text-xs font-mono">{new Date(row.recorded_at).toLocaleString()}</span>
    )}
  ]

  return (
    <div className="animate-fade-in">
      <PageHeader title="Network Events" icon={Wifi} onDeviceChange={() => {}} />
      <DataTable columns={columns} data={events} keyField="id" searchable />
    </div>
  )
}
