import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import DataTable from '../components/DataTable'
import { apps } from '../utils/api'
import { AppWindow, Smartphone } from 'lucide-react'

export default function AppsPage() {
  const { deviceId } = useParams()
  const [appList, setAppList] = useState([])
  const [filter, setFilter] = useState('all')

  useEffect(() => { if (deviceId) loadApps() }, [deviceId, filter])

  const loadApps = async () => {
    let params = ''
    if (filter === 'system') params = '?system=true'
    else if (filter === 'user') params = '?system=false'
    const data = await apps.list(deviceId, params)
    if (data) setAppList(data)
  }

  const columns = [
    { key: 'app_name', label: 'App Name' },
    { key: 'package_name', label: 'Package', render: (row) => (
      <span className="text-xs font-mono text-wuzen-muted">{row.package_name}</span>
    )},
    { key: 'version', label: 'Version', render: (row) => (
      <span className="text-xs">{row.version}</span>
    )},
    { key: 'is_system_app', label: 'Type', render: (row) => (
      <span className={`text-xs px-2 py-0.5 rounded ${row.is_system_app ? 'bg-wuzen-warning/10 text-wuzen-warning' : 'bg-wuzen-success/10 text-wuzen-success'}`}>
        {row.is_system_app ? 'SYSTEM' : 'USER'}
      </span>
    )},
    { key: 'is_enabled', label: 'Status', render: (row) => (
      <span className={`text-xs ${row.is_enabled ? 'text-wuzen-success' : 'text-wuzen-danger'}`}>
        {row.is_enabled ? 'Enabled' : 'Disabled'}
      </span>
    )},
    { key: 'first_install', label: 'Installed', render: (row) => (
      <span className="text-xs font-mono">{row.first_install ? new Date(row.first_install).toLocaleDateString() : 'Unknown'}</span>
    )}
  ]

  return (
    <div className="animate-fade-in">
      <PageHeader title="Installed Apps" icon={AppWindow} onDeviceChange={() => {}}>
        <div className="flex gap-2">
          {['all', 'system', 'user'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`wuzen-btn text-xs ${filter === f ? 'wuzen-btn-primary' : 'border border-wuzen-border text-wuzen-muted'}`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </PageHeader>
      <DataTable columns={columns} data={appList} keyField="id" searchable />
    </div>
  )
}
