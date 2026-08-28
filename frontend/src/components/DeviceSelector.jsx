import { useEffect, useState } from 'react'
import { useStore } from '../store'
import { api } from '../utils/api'
import { Smartphone, ChevronDown } from 'lucide-react'

export default function DeviceSelector({ value, onChange, showAll = true }) {
  const [devices, setDevices] = useState([])
  const [open, setOpen] = useState(false)
  const { selectedDevice, setSelectedDevice } = useStore()

  useEffect(() => {
    api.get('/devices?limit=100').then(data => {
      if (data) setDevices(data)
    })
  }, [])

  const selected = devices.find(d => d.device_id === (value || selectedDevice?.device_id))

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="wuzen-input flex items-center justify-between gap-2 min-w-[240px]"
      >
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-wuzen-muted" />
          <span className="truncate">
            {selected ? `${selected.device_name || 'Unknown'} (${selected.device_id?.slice(0, 8)}...)` : 'Select Device'}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-wuzen-muted transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 right-0 mt-1 bg-wuzen-panel border border-wuzen-border rounded-lg shadow-xl z-50 max-h-64 overflow-auto">
            {showAll && (
              <button
                onClick={() => { onChange?.(''); setOpen(false) }}
                className="w-full px-4 py-2.5 text-left text-sm text-wuzen-muted hover:bg-wuzen-card hover:text-wuzen-text transition-colors"
              >
                All Devices
              </button>
            )}
            {devices.map(d => (
              <button
                key={d.device_id}
                onClick={() => { onChange?.(d.device_id); setSelectedDevice(d); setOpen(false) }}
                className={`w-full px-4 py-2.5 text-left text-sm hover:bg-wuzen-card transition-colors flex items-center gap-2
                  ${selected?.device_id === d.device_id ? 'text-wuzen-primary bg-wuzen-primary/5' : 'text-wuzen-text'}`}
              >
                <div className={`w-2 h-2 rounded-full ${d.status === 'online' ? 'bg-wuzen-success' : 'bg-wuzen-danger'}`} />
                <span className="truncate">{d.device_name || d.model || d.device_id}</span>
                <span className="text-xs text-wuzen-muted ml-auto">{d.device_id?.slice(0, 8)}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
