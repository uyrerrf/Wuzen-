import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import DataTable from '../components/DataTable'
import { processes } from '../utils/api'
import { Activity, Terminal } from 'lucide-react'

export default function ProcessesPage() {
  const { deviceId } = useParams()
  const [procList, setProcList] = useState([])

  useEffect(() => { if (deviceId) loadProcesses() }, [deviceId])

  const loadProcesses = async () => {
    const data = await processes.list(deviceId)
    if (data) setProcList(data)
  }

  const columns = [
    { key: 'pid', label: 'PID', render: (row) => <span className="font-mono text-xs">{row.pid}</span> },
    { key: 'process_name', label: 'Process' },
    { key: 'package_name', label: 'Package', render: (row) => (
      <span className="text-xs font-mono text-wuzen-muted">{row.package_name}</span>
    )},
    { key: 'cpu_usage', label: 'CPU %', render: (row) => (
      <div className="flex items-center gap-2">
        <div className="w-16 h-1.5 bg-wuzen-border rounded-full overflow-hidden">
          <div className="h-full bg-wuzen-primary rounded-full" style={{ width: `${Math.min(row.cpu_usage || 0, 100)}%` }} />
        </div>
        <span className="text-xs font-mono">{row.cpu_usage?.toFixed(1)}%</span>
      </div>
    )},
    { key: 'memory_usage', label: 'Memory', render: (row) => (
      <span className="font-mono text-xs">{row.memory_usage ? `${(row.memory_usage / 1024).toFixed(1)} MB` : '-'}</span>
    )},
    { key: 'recorded_at', label: 'Time', render: (row) => (
      <span className="text-xs font-mono">{new Date(row.recorded_at).toLocaleTimeString()}</span>
    )}
  ]

  return (
    <div className="animate-fade-in">
      <PageHeader title="Running Processes" icon={Activity} onDeviceChange={() => {}}>
        <button onClick={loadProcesses} className="wuzen-btn border border-wuzen-border text-wuzen-muted text-xs">
          <Terminal className="w-3 h-3" /> Refresh
        </button>
      </PageHeader>
      <DataTable columns={columns} data={procList} keyField="id" searchable />
    </div>
  )
}
