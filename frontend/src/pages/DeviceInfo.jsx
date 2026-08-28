import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import { devices, hardware } from '../utils/api'
import {
  Smartphone, Battery, Wifi, MapPin, Shield, Cpu, HardDrive,
  Monitor, Thermometer, Activity, Globe, Hash
} from 'lucide-react'

export default function DeviceInfoPage() {
  const { deviceId } = useParams()
  const [device, setDevice] = useState(null)
  const [hw, setHw] = useState(null)

  useEffect(() => {
    if (deviceId) loadDevice(deviceId)
  }, [deviceId])

  const loadDevice = async (id) => {
    const [d, h] = await Promise.all([devices.get(id), hardware.info(id)])
    if (d) setDevice(d)
    if (h) setHw(h)
  }

  const InfoRow = ({ icon: Icon, label, value, color = 'primary' }) => (
    <div className="flex items-center gap-3 p-3 rounded bg-wuzen-card/50">
      <Icon className={`w-4 h-4 text-wuzen-${color}`} />
      <div className="flex-1">
        <p className="text-[10px] text-wuzen-muted uppercase tracking-wider">{label}</p>
        <p className="text-sm font-mono">{value || 'N/A'}</p>
      </div>
    </div>
  )

  return (
    <div className="animate-fade-in">
      <PageHeader title="Device Info" icon={Smartphone} onDeviceChange={loadDevice} />

      {device && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="wuzen-panel p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-wuzen-muted">Device Identity</h3>
                <div className={`px-2 py-1 rounded text-xs font-mono ${device.status === 'online' ? 'bg-wuzen-success/10 text-wuzen-success' : 'bg-wuzen-danger/10 text-wuzen-danger'}`}>
                  {device.status?.toUpperCase()}
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <InfoRow icon={Smartphone} label="Device Name" value={device.device_name} />
                <InfoRow icon={Cpu} label="Model" value={device.model} />
                <InfoRow icon={Globe} label="Manufacturer" value={device.manufacturer} />
                <InfoRow icon={Monitor} label="Android" value={device.android_version} />
                <InfoRow icon={Hash} label="SDK" value={device.sdk_level} />
                <InfoRow icon={Hash} label="IMEI" value={device.imei} />
                <InfoRow icon={Hash} label="IMSI" value={device.imsi} />
                <InfoRow icon={Smartphone} label="Phone" value={device.phone_number} />
                <InfoRow icon={Wifi} label="Carrier" value={device.carrier} />
                <InfoRow icon={Globe} label="MCC/MNC" value={device.mcc_mnc} />
                <InfoRow icon={MapPin} label="Country" value={device.country} />
                <InfoRow icon={Wifi} label="IP" value={device.ip_address} />
                <InfoRow icon={Hash} label="MAC" value={device.mac_address} />
              </div>
            </div>

            {hw && (
              <div className="wuzen-panel p-6">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-wuzen-muted mb-4">Hardware Specifications</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <InfoRow icon={Cpu} label="CPU Arch" value={hw.cpu_arch} />
                  <InfoRow icon={Cpu} label="Cores" value={hw.cpu_cores} />
                  <InfoRow icon={HardDrive} label="Total RAM" value={hw.total_ram ? `${Math.round(hw.total_ram / 1024 / 1024)} MB` : null} />
                  <InfoRow icon={HardDrive} label="Avail RAM" value={hw.available_ram ? `${Math.round(hw.available_ram / 1024 / 1024)} MB` : null} />
                  <InfoRow icon={HardDrive} label="Storage" value={hw.total_storage ? `${Math.round(hw.total_storage / 1024 / 1024 / 1024)} GB` : null} />
                  <InfoRow icon={Monitor} label="Resolution" value={hw.screen_resolution} />
                  <InfoRow icon={Monitor} label="Density" value={hw.screen_density} />
                  <InfoRow icon={Activity} label="Sensors" value={hw.sensors?.length} />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="wuzen-panel p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-wuzen-muted mb-4">Device Status</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-wuzen-muted">Battery</span>
                    <span className={device.battery_level < 20 ? 'text-wuzen-danger' : 'text-wuzen-success'}>{device.battery_level}%</span>
                  </div>
                  <div className="h-2 bg-wuzen-border rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all ${device.battery_level < 20 ? 'bg-wuzen-danger' : 'bg-wuzen-success'}`}
                      style={{ width: `${device.battery_level}%` }}
                    />
                  </div>
                </div>
                <InfoRow icon={Battery} label="Charging" value={device.is_charging ? 'Yes' : 'No'} color="warning" />
                <InfoRow icon={Shield} label="Screen Locked" value={device.screen_locked ? 'Yes' : 'No'} />
                <InfoRow icon={Shield} label="Rooted" value={device.is_rooted ? 'YES' : 'No'} color={device.is_rooted ? 'danger' : 'success'} />
                <InfoRow icon={Shield} label="Emulator" value={device.is_emulator ? 'YES' : 'No'} color={device.is_emulator ? 'warning' : 'success'} />
                <InfoRow icon={Shield} label="Admin Enabled" value={device.admin_enabled ? 'Yes' : 'No'} />
                <InfoRow icon={Shield} label="Doze Whitelisted" value={device.doze_whitelisted ? 'Yes' : 'No'} />
              </div>
            </div>

            {device.latitude && (
              <div className="wuzen-panel p-6">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-wuzen-muted mb-4">Last Location</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-wuzen-muted">Lat</span>
                    <span className="font-mono">{device.latitude}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-wuzen-muted">Lng</span>
                    <span className="font-mono">{device.longitude}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-wuzen-muted">Accuracy</span>
                    <span className="font-mono">{device.accuracy}m</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-wuzen-muted">Updated</span>
                    <span className="font-mono text-xs">{device.location_updated ? new Date(device.location_updated).toLocaleString() : 'Never'}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
