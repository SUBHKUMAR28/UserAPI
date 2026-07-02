import { useState } from 'react'
import { notificationsAPI } from '../../api/services'
import { PageHeader, Modal } from '../../components/common'
import { Send, Bell } from 'lucide-react'

export default function Notifications() {
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ title: '', message: '', type: 'all' })
  const [sent, setSent] = useState([])

  const sendNotification = async () => {
    await notificationsAPI.send(form)
    setSent(prev => [{ ...form, sentAt: new Date().toISOString(), _id: Date.now() }, ...prev])
    setModalOpen(false)
    setForm({ title: '', message: '', type: 'all' })
  }

  return (
    <div>
      <PageHeader
        title="Notifications"
        subtitle="Send push notifications to users"
        action={<button onClick={() => setModalOpen(true)} className="btn-primary"><Send size={16} /> Send Notification</button>}
      />
      <div className="card">
        {sent.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-secondary">
            <Bell size={40} className="mb-3 text-primary/30" />
            <p className="text-sm">No notifications sent yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sent.map(n => (
              <div key={n._id} className="flex items-start gap-3 p-4 bg-bg-main rounded-lg">
                <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Bell size={16} className="text-primary" />
                </div>
                <div>
                  <p className="font-medium text-text-dark text-sm">{n.title}</p>
                  <p className="text-xs text-secondary mt-0.5">{n.message}</p>
                  <p className="text-xs text-secondary mt-1">{new Date(n.sentAt).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Send Notification">
        <div className="space-y-3">
          <input placeholder="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})}
            className="w-full border border-border-color rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary" />
          <textarea placeholder="Message" value={form.message} onChange={e => setForm({...form, message: e.target.value})} rows={4}
            className="w-full border border-border-color rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary resize-none" />
          <select value={form.type} onChange={e => setForm({...form, type: e.target.value})}
            className="w-full border border-border-color rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary">
            <option value="all">All Users</option>
            <option value="active">Active Users</option>
            <option value="kyc_pending">KYC Pending</option>
          </select>
          <button onClick={sendNotification} className="btn-primary w-full justify-center"><Send size={16} /> Send</button>
        </div>
      </Modal>
    </div>
  )
}
