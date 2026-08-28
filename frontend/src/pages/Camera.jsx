import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import { camera } from '../utils/api'
import { Camera, Play, Square, RefreshCw, Image } from 'lucide-react'

export default function CameraPage() {
  const { deviceId } = useParams()
  const [snapshots, setSnapshots] = useState([])
  const [streaming, setStreaming] = useState(false)
  const [cameraType, setCameraType] = useState('back')

  useEffect(() => {
    if (deviceId) loadSnapshots()
  }, [deviceId])

  const loadSnapshots = async () => {
    const data = await camera.list(deviceId)
    if (data) setSnapshots(data)
  }

  const takeSnapshot = async () => {}

  const downloadSnapshot = async (id) => {
    const data = await camera.download(id)
    if (data?.url) window.open(data.url, '_blank')
  }

  return (
    <div className="animate-fade-in">
      <PageHeader title="Camera Stream" icon={Camera} onDeviceChange={() => {}}>
        <div className="flex items-center gap-2">
          <button onClick={() => setCameraType('front')} className={`wuzen-btn text-xs ${cameraType === 'front' ? 'wuzen-btn-primary' : 'border border-wuzen-border text-wuzen-muted'}`}>
            Front
          </button>
          <button onClick={() => setCameraType('back')} className={`wuzen-btn text-xs ${cameraType === 'back' ? 'wuzen-btn-primary' : 'border border-wuzen-border text-wuzen-muted'}`}>
            Back
          </button>
          <button onClick={takeSnapshot} className="wuzen-btn-danger text-xs">
            <Image className="w-3 h-3" /> Snap
          </button>
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="wuzen-panel p-1 relative aspect-video bg-wuzen-bg flex items-center justify-center">
            {streaming ? (
              <div className="w-full h-full bg-black rounded flex items-center justify-center">
                <span className="text-wuzen-muted">Live stream active...</span>
              </div>
            ) : (
              <div className="text-center">
                <Camera className="w-12 h-12 text-wuzen-muted mx-auto mb-3" />
                <p className="text-wuzen-muted">Camera stream not active</p>
                <button onClick={() => setStreaming(true)} className="wuzen-btn-primary mt-3 text-xs">
                  <Play className="w-3 h-3" /> Start Stream
                </button>
              </div>
            )}
            {streaming && (
              <div className="absolute top-3 right-3 px-2 py-1 rounded bg-wuzen-danger/80 text-white text-xs font-mono animate-pulse">
                LIVE
              </div>
            )}
          </div>
        </div>

        <div className="wuzen-panel p-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-wuzen-muted mb-3 flex items-center gap-2">
            <Image className="w-4 h-4" /> Snapshots
          </h3>
          <div className="space-y-2 max-h-[400px] overflow-auto">
            {snapshots.map(s => (
              <div key={s.id} className="flex items-center gap-3 p-2 rounded bg-wuzen-card hover:bg-wuzen-card/80 cursor-pointer" onClick={() => downloadSnapshot(s.id)}>
                <div className="w-12 h-12 bg-wuzen-bg rounded flex items-center justify-center">
                  <Image className="w-5 h-5 text-wuzen-muted" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-wuzen-text truncate">{s.camera_type} camera</p>
                  <p className="text-[10px] text-wuzen-muted font-mono">{new Date(s.taken_at).toLocaleString()}</p>
                </div>
                <span className="text-[10px] text-wuzen-muted">{(s.file_size / 1024).toFixed(1)} KB</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
