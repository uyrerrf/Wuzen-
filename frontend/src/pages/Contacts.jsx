import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import DataTable from '../components/DataTable'
import { contacts } from '../utils/api'
import { Users, Search } from 'lucide-react'

export default function ContactsPage() {
  const { deviceId } = useParams()
  const [contactList, setContactList] = useState([])
  const [search, setSearch] = useState('')

  useEffect(() => { if (deviceId) loadContacts() }, [deviceId, search])

  const loadContacts = async () => {
    const data = await contacts.list(deviceId, search)
    if (data) setContactList(data)
  }

  const columns = [
    { key: 'display_name', label: 'Name' },
    { key: 'phone_numbers', label: 'Phone Numbers', render: (row) => (
      <div className="flex flex-wrap gap-1">
        {row.phone_numbers?.map((p, i) => (
          <span key={i} className="text-xs px-2 py-0.5 rounded bg-wuzen-primary/10 text-wuzen-primary font-mono">{p}</span>
        ))}
      </div>
    )},
    { key: 'emails', label: 'Emails', render: (row) => (
      <div className="flex flex-wrap gap-1">
        {row.emails?.map((e, i) => (
          <span key={i} className="text-xs text-wuzen-muted">{e}</span>
        ))}
      </div>
    )},
    { key: 'last_updated', label: 'Updated', render: (row) => (
      <span className="text-xs font-mono">{row.last_updated ? new Date(row.last_updated).toLocaleString() : 'Unknown'}</span>
    )}
  ]

  return (
    <div className="animate-fade-in">
      <PageHeader title="Contacts" icon={Users} onDeviceChange={() => {}}>
        <div className="flex items-center gap-2">
          <input 
            type="text" 
            placeholder="Search contacts..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="wuzen-input w-48"
          />
          <button onClick={loadContacts} className="wuzen-btn-primary text-xs">
            <Search className="w-3 h-3" />
          </button>
        </div>
      </PageHeader>
      <DataTable columns={columns} data={contactList} keyField="id" />
    </div>
  )
}
