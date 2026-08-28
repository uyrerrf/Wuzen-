import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import DataTable from '../components/DataTable'
import { notifications } from '../utils/api'
import { AlertTriangle, Bell } from 'lucide-react'

export default function NotificationsLogPage() {
  const { deviceId } = useParams()
  const [notifs, setNotifs] = useState([])

  useEffect(() => {
    if (deviceId) loadNotifs()
  }, [deviceId])

  const loadNotifs = async () => {
    const data = await notifications.list(deviceId)
    if (data) setNotifs(data)
  }

  const columns = [
    { key: 'app_name', label: 'App', render: (row) => (
      <span className="text-xs px-2 py-1 rounded bg-wuzen-primary/10 text-wuzen-primary">{row.app_name || row.package_name}</span>
    )},
    { key: 'title', label: 'Title', render: (row) => <span className="text-sm">{row.title}</span> },
    { key: 'text', label: 'Content', render: (row) => (
      <span className="text-xs text-wuzen-muted truncate max-w-[300px] block">{row.text}</span>
    )},
    { key: 'post_time', label: 'Time', render: (row) => (
      <span className="text-xs font-mono">{new Date(row.post_time).toLocaleTimeString()}</span>
    )},
    { key: 'priority', label: 'Priority', render: (row) => (
      <span className={`text-xs px-2 py-0.5 rounded ${row.priority >= 1 ? 'bg-wuzen-danger/10 text-wuzen-danger' : 'bg-wuzen-muted/20 text-wuzen-muted'}`}>
        {row.priority}
      </span>
    )}
  ]

  return (
    <div className="animate-fade-in">
      <PageHeader title="Notifications Log" icon={AlertTriangle} onDeviceChange={() => {}} />
      <DataTable columns={columns} data={notifs} keyField="id" searchable />
    </div>
  )
}
