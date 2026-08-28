import DeviceSelector from './DeviceSelector'

export default function PageHeader({ title, icon: Icon, deviceSelector = true, onDeviceChange, children }) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {Icon && <Icon className="w-6 h-6 text-wuzen-primary" />}
          <h2 className="text-xl font-bold tracking-wide">{title}</h2>
        </div>
        <div className="flex items-center gap-3">
          {deviceSelector && <DeviceSelector onChange={onDeviceChange} />}
          {children}
        </div>
      </div>
    </div>
  )
}
