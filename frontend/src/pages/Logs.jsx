import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import DataTable from '../components/DataTable'
import { api } from '../utils/api'
import { FileText, RefreshCw } from 'lucide-react'

export default function LogsPage() {
  const { deviceId } = useParams()
  const [logs, setLogs] = useState([])
  const [logType, setLogType] = useState('audit')

  useEffect(() => { loadLogs() }, [deviceId, logType])

  const loadLogs = async () => {
    const data = logType === 'audit' 
      ? await api.get('/logs/audit')
      : await api.get(`/logs/${logType}/${deviceId}`)
    if (data) setLogs(data)
  }

  const columns = [
    { key: 'action', label: 'Action' },
    { key: 'target_type', label: 'Target' },
    { key: 'username', label: 'User', render: (row) => <span className="text-xs">{row.username || 'System'}</span> },
    { key: 'ip_address', label: 'IP', render: (row) => <span className="font-mono text-xs">{row.ip_address}</span> },
    { key: 'created_at', label: 'Time', render: (row) => (
      <span className="text-xs font-mono">{new Date(row.created_at).toLocaleString()}</span>
    )}
  ]

  return (
    <div className="animate-fade-in">
      <PageHeader title="Logs" icon={FileText} onDeviceChange={() => {}}>
        <button onClick={loadLogs} className="wuzen-btn border border-wuzen-border text-wuzen-muted text-xs">
          <RefreshCw className="w-3 h-3" /> Refresh
        </button>
      </PageHeader>

      <div className="flex gap-2 mb-4">
        {['audit', 'commands', 'network'].map(t => (
          <button
            key={t}
            onClick={() => setLogType(t)}
            className={`px-3 py-1.5 rounded text-xs uppercase tracking-wider border transition-all
              ${logType === t ? 'bg-wuzen-primary/10 border-wuzen-primary text-wuzen-primary' : 'border-wuzen-border text-wuzen-muted'}`}
          >
            {t}
          </button>
        ))}
      </div>

      <DataTable columns={columns} data={logs} keyField="id" searchable />
    </div>
  )
}
