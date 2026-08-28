export default function StatCard({ title, value, icon: Icon, color = 'primary', subtitle }) {
  const colorMap = {
    primary: 'text-wuzen-primary border-wuzen-primary/20 bg-wuzen-primary/5',
    secondary: 'text-wuzen-secondary border-wuzen-secondary/20 bg-wuzen-secondary/5',
    success: 'text-wuzen-success border-wuzen-success/20 bg-wuzen-success/5',
    warning: 'text-wuzen-warning border-wuzen-warning/20 bg-wuzen-warning/5',
    danger: 'text-wuzen-danger border-wuzen-danger/20 bg-wuzen-danger/5'
  }

  return (
    <div className={`wuzen-card p-5 border ${colorMap[color]}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-wuzen-muted uppercase tracking-wider mb-1">{title}</p>
          <p className="text-2xl font-bold font-mono">{value}</p>
          {subtitle && <p className="text-xs text-wuzen-muted mt-1">{subtitle}</p>}
        </div>
        <div className={`p-2 rounded-lg ${colorMap[color]} bg-opacity-20`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  )
}
