import { useState } from 'react'
import { useParams } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import { push } from '../utils/api'
import { Bell, Send } from 'lucide-react'

export default function PushNotificationPage() {
  const { deviceId } = useParams()
  const [form, setForm] = useState({ title: '', body: '', packageName: 'com.android.system' })
  const [sending, setSending] = useState(false)

  const handleSend = async () => {
    if (!deviceId) return
    setSending(true)
    await push.send(deviceId, form)
    setSending(false)
    setForm({ title: '', body: '', packageName: 'com.android.system' })
  }

  return (
    <div className="animate-fade-in">
      <PageHeader title="Push Notification" icon={Bell} onDeviceChange={() => {}} />

      <div className="wuzen-panel p-6 max-w-2xl">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-wuzen-muted mb-4">Send Fake Notification</h3>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-wuzen-muted uppercase mb-1 block">Target Package</label>
            <input className="wuzen-input w-full" value={form.packageName} onChange={e => setForm(p => ({...p, packageName: e.target.value}))} />
          </div>
          <div>
            <label className="text-xs text-wuzen-muted uppercase mb-1 block">Title</label>
            <input className="wuzen-input w-full" value={form.title} onChange={e => setForm(p => ({...p, title: e.target.value}))} placeholder="Notification title" />
          </div>
          <div>
            <label className="text-xs text-wuzen-muted uppercase mb-1 block">Body</label>
            <textarea className="wuzen-input w-full h-24" value={form.body} onChange={e => setForm(p => ({...p, body: e.target.value}))} placeholder="Notification body text..." />
          </div>
          <button onClick={handleSend} disabled={sending} className="wuzen-btn-primary">
            <Send className="w-4 h-4" /> {sending ? 'SENDING...' : 'SEND NOTIFICATION'}
          </button>
        </div>
      </div>
    </div>
  )
}
