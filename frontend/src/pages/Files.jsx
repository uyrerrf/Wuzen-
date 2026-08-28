import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import DataTable from '../components/DataTable'
import { files } from '../utils/api'
import { HardDrive, Folder, File, ChevronRight, Download, Trash2 } from 'lucide-react'

export default function FilesPage() {
  const { deviceId } = useParams()
  const [currentPath, setCurrentPath] = useState('/')
  const [fileList, setFileList] = useState([])
  const [breadcrumbs, setBreadcrumbs] = useState(['/'])

  useEffect(() => { if (deviceId) loadFiles() }, [deviceId, currentPath])

  const loadFiles = async () => {
    const data = await files.list(deviceId, currentPath)
    if (data) setFileList(data)
  }

  const navigateTo = (path) => {
    setCurrentPath(path)
    const parts = path.split('/').filter(Boolean)
    setBreadcrumbs(['/', ...parts.map((_, i) => '/' + parts.slice(0, i + 1).join('/'))])
  }

  const columns = [
    { key: 'name', label: 'Name', render: (row) => (
      <div className="flex items-center gap-2">
        {row.is_directory ? <Folder className="w-4 h-4 text-wuzen-warning" /> : <File className="w-4 h-4 text-wuzen-primary" />}
        <span className="text-sm">{row.name}</span>
      </div>
    )},
    { key: 'type', label: 'Type' },
    { key: 'size', label: 'Size', render: (row) => (
      <span className="font-mono text-xs">{row.size ? `${(row.size / 1024).toFixed(1)} KB` : '-'}</span>
    )},
    { key: 'permissions', label: 'Permissions', render: (row) => (
      <span className="font-mono text-xs text-wuzen-muted">{row.permissions}</span>
    )},
    { key: 'modified_at', label: 'Modified', render: (row) => (
      <span className="text-xs font-mono">{row.modified_at ? new Date(row.modified_at).toLocaleString() : 'Unknown'}</span>
    )},
    { key: 'actions', label: '', render: (row) => (
      <div className="flex gap-1">
        {!row.is_directory && (
          <button className="p-1 rounded hover:bg-wuzen-card text-wuzen-primary">
            <Download className="w-3 h-3" />
          </button>
        )}
        <button className="p-1 rounded hover:bg-wuzen-danger/10 text-wuzen-danger">
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    )}
  ]

  return (
    <div className="animate-fade-in">
      <PageHeader title="Remote File Manager" icon={HardDrive} onDeviceChange={() => {}} />

      <div className="flex items-center gap-1 mb-4 text-xs">
        {breadcrumbs.map((crumb, i) => (
          <span key={i} className="flex items-center gap-1">
            <button onClick={() => navigateTo(crumb)} className="text-wuzen-primary hover:underline">{crumb === '/' ? 'root' : crumb.split('/').pop()}</button>
            {i < breadcrumbs.length - 1 && <ChevronRight className="w-3 h-3 text-wuzen-muted" />}
          </span>
        ))}
      </div>

      <DataTable 
        columns={columns} 
        data={fileList} 
        keyField="id" 
        onRowClick={(row) => row.is_directory && navigateTo(row.path)}
      />
    </div>
  )
}
