import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import DataTable from '../components/DataTable'
import { sms, calls } from '../utils/api'
import { MessageSquare, Phone, Inbox, PhoneCall } from 'lucide-react'

export default function SmsCallPage() {
  const { deviceId } = useParams()
  const [activeTab, setActiveTab] = useState('sms')
  const [smsData, setSmsData] = useState([])
  const [callData, setCallData] = useState([])

  useEffect(() => {
    if (deviceId) loadData()
  }, [deviceId])

  const loadData = async () => {
    const [s, c] = await Promise.all([sms.list(deviceId), calls.list(deviceId)])
    if (s) setSmsData(s)
    if (c) setCallData(c)
  }

  const smsColumns = [
    { key: 'address', label: 'From/To', render: (row) => (
      <div>
        <span className="text-sm">{row.address}</span>
        {row.contact_name && <span className="text-xs text-wuzen-muted ml-2">({row.contact_name})</span>}
      </div>
    )},
    { key: 'body', label: 'Message', render: (row) => (
      <span className="text-xs text-wuzen-text truncate max-w-[400px] block">{row.body}</span>
    )},
    { key: 'type', label: 'Type', render: (row) => (
      <span className={`text-xs px-2 py-0.5 rounded ${row.type === '1' ? 'bg-wuzen-success/10 text-wuzen-success' : 'bg-wuzen-primary/10 text-wuzen-primary'}`}>
        {row.type === '1' ? 'INBOX' : 'SENT'}
      </span>
    )},
    { key: 'date', label: 'Date', render: (row) => (
      <span className="text-xs font-mono">{row.date ? new Date(row.date).toLocaleString() : 'Unknown'}</span>
    )}
  ]

  const callColumns = [
    { key: 'number', label: 'Number', render: (row) => (
      <div>
        <span className="text-sm">{row.number}</span>
        {row.name && <span className="text-xs text-wuzen-muted ml-2">({row.name})</span>}
      </div>
    )},
    { key: 'type', label: 'Type', render: (row) => (
      <span className={`text-xs px-2 py-0.5 rounded ${
        row.type === '1' ? 'bg-wuzen-success/10 text-wuzen-success' :
        row.type === '2' ? 'bg-wuzen-primary/10 text-wuzen-primary' :
        row.type === '3' ? 'bg-wuzen-danger/10 text-wuzen-danger' : 'bg-wuzen-muted/20'
      }`}>
        {row.type === '1' ? 'INCOMING' : row.type === '2' ? 'OUTGOING' : row.type === '3' ? 'MISSED' : 'UNKNOWN'}
      </span>
    )},
    { key: 'duration', label: 'Duration', render: (row) => (
      <span className="font-mono text-xs">{row.duration}s</span>
    )},
    { key: 'date', label: 'Date', render: (row) => (
      <span className="text-xs font-mono">{row.date ? new Date(row.date).toLocaleString() : 'Unknown'}</span>
    )}
  ]

  return (
    <div className="animate-fade-in">
      <PageHeader title="SMS & Call" icon={MessageSquare} onDeviceChange={() => {}}>
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveTab('sms')}
            className={`wuzen-btn text-xs ${activeTab === 'sms' ? 'wuzen-btn-primary' : 'border border-wuzen-border text-wuzen-muted'}`}
          >
            <Inbox className="w-3 h-3" /> SMS
          </button>
          <button 
            onClick={() => setActiveTab('calls')}
            className={`wuzen-btn text-xs ${activeTab === 'calls' ? 'wuzen-btn-primary' : 'border border-wuzen-border text-wuzen-muted'}`}
          >
            <PhoneCall className="w-3 h-3" /> Calls
          </button>
        </div>
      </PageHeader>

      <DataTable 
        columns={activeTab === 'sms' ? smsColumns : callColumns} 
        data={activeTab === 'sms' ? smsData : callData} 
        keyField="id" 
        searchable 
      />
    </div>
  )
}
