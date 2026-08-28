import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import DataTable from '../components/DataTable'
import { firewall } from '../utils/api'
import { Wifi, Shield, Plus, Trash2 } from 'lucide-react'

export default function FirewallPage() {
  const { deviceId } = useParams()
  const [rules, setRules] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ action: 'block', target: '', port: '', protocol: 'tcp' })

  useEffect(() => { if (deviceId) loadRules() }, [deviceId])

  const loadRules = async () => {
    const data = await firewall.rules(deviceId)
    if (data) setRules(data)
  }

  const handleAdd = async () => {
    await firewall.addRule(deviceId, form)
    setShowForm(false)
    loadRules()
  }

  const columns = [
    { key: 'event_type', label: 'Type' },
    { key: 'ssid', label: 'SSID' },
    { key: 'ip_address', label: 'IP', render: (row) => <span className="font-mono text-xs">{row.ip_address}</span> },
    { key: 'gateway', label: 'Gateway', render: (row) => <span className="font-mono text-xs">{row.gateway}</span> },
    { key: 'is_vpn', label: 'VPN', render: (row) => (
      <span className={`text-xs ${row.is_vpn ? 'text-wuzen-danger' : 'text-wuzen-muted'}`}>{row.is_vpn ? 'YES' : 'No'}</span>
    )},
    { key: 'recorded_at', label: 'Time', render: (row) => (
      <span className="text-xs font-mono">{new Date(row.recorded_at).toLocaleString()}</span>
    )}
  ]

  return (
    <div className="animate-fade-in">
      <PageHeader title="Firewall" icon={Shield} onDeviceChange={() => {}}>
        <button onClick={() => setShowForm(!showForm)} className="wuzen-btn-primary text-xs">
          <Plus className="w-3 h-3" /> Add Rule
        </button>
      </PageHeader>

      {showForm && (
        <div className="wuzen-panel p-4 mb-4 flex items-end gap-3">
          <div className="flex-1">
            <label className="text-[10px] text-wuzen-muted uppercase">Action</label>
            <select className="wuzen-input w-full" value={form.action} onChange={e => setForm(p => ({...p, action: e.target.value}))}>
              <option value="block">Block</option>
              <option value="allow">Allow</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="text-[10px] text-wuzen-muted uppercase">Target</label>
            <input className="wuzen-input w-full" value={form.target} onChange={e => setForm(p => ({...p, target: e.target.value}))} placeholder="IP/Domain" />
          </div>
          <div className="w-24">
            <label className="text-[10px] text-wuzen-muted uppercase">Port</label>
            <input className="wuzen-input w-full" value={form.port} onChange={e => setForm(p => ({...p, port: e.target.value}))} placeholder="443" />
          </div>
          <div className="w-24">
            <label className="text-[10px] text-wuzen-muted uppercase">Protocol</label>
            <select className="wuzen-input w-full" value={form.protocol} onChange={e => setForm(p => ({...p, protocol: e.target.value}))}>
              <option value="tcp">TCP</option>
              <option value="udp">UDP</option>
            </select>
          </div>
          <button onClick={handleAdd} className="wuzen-btn-success text-xs">Add</button>
        </div>
      )}

      <DataTable columns={columns} data={rules} keyField="id" searchable />
    </div>
  )
}
