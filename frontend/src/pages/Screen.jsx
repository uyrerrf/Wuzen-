import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import DataTable from '../components/DataTable'
import { screen } from '../utils/api'
import { Monitor, Play, Download, Film } from 'lucide-react'

export default function ScreenPage() {
  const { deviceId } = useParams()
  const [recordings, setRecordings] = useState([])
  const [recording, setRecording] = useState(false)

  useEffect(() => { if (deviceId) loadRecordings() }, [deviceId])

  const loadRecordings = async () => {
    const data = await screen.list(deviceId)
    if (data) setRecordings(data)
  }

  const downloadRecording = async (id) => {
    const data = await screen.download(id)
    if (data?.url) window.open(data.url, '_blank')
  }

  const columns = [
    { key: 'duration', label: 'Duration', render: (row) => (
      <span className="font-mono text-sm">{row.duration}s</span>
    )},
    { key: 'width', label: 'Resolution', render: (row) => (
      <span className="font-mono text-xs">{row.width}x{row.height} @{row.fps}fps</span>
    )},
    { key: 'file_size', label: 'Size', render: (row) => (
      <span className="font-mono text-xs">{(row.file_size / 1024 / 1024).toFixed(2)} MB</span>
    )},
    { key: 'recorded_at', label: 'Recorded', render: (row) => (
      <span className="text-xs font-mono">{new Date(row.recorded_at).toLocaleString()}</span>
    )},
    { key: 'actions', label: '', render: (row) => (
      <button onClick={() => downloadRecording(row.id)} className="p-1 rounded hover:bg-wuzen-card text-wuzen-primary">
        <Download className="w-4 h-4" />
      </button>
    )}
  ]

  return (
    <div className="animate-fade-in">
      <PageHeader title="Screen Scraping" icon={Monitor} onDeviceChange={() => {}}>
        <div className="flex items-center gap-2">
          {recording ? (
            <button onClick={() => setRecording(false)} className="wuzen-btn-danger text-xs">
              <Film className="w-3 h-3" /> STOP
            </button>
          ) : (
            <button onClick={() => setRecording(true)} className="wuzen-btn-primary text-xs">
              <Play className="w-3 h-3" /> RECORD
            </button>
          )}
        </div>
      </PageHeader>

      <DataTable columns={columns} data={recordings} keyField="id" searchable />
    </div>
  )
}
