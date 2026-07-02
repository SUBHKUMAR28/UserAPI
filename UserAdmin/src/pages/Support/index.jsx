import { useEffect, useState } from 'react'
import { supportAPI } from '../../api/services'
import { PageHeader, Badge, Table, Modal } from '../../components/common'
import { Eye, Send } from 'lucide-react'

export default function Support() {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [reply, setReply] = useState('')

  useEffect(() => {
    supportAPI.getAll()
      .then(res => setList(res.data.data || []))
      .catch(() => setList([]))
      .finally(() => setLoading(false))
  }, [])

  const sendReply = async () => {
    await supportAPI.reply(selected._id, { message: reply })
    setReply('')
    setModalOpen(false)
  }

  return (
    <div>
      <PageHeader title="Support Tickets" subtitle="Manage customer support requests" />
      <div className="card">
        <Table headers={['#', 'User', 'Subject', 'Status', 'Created', 'Actions']} loading={loading} empty={!list.length}>
          {list.map((t, i) => (
            <tr key={t._id} className="hover:bg-bg-main transition-colors">
              <td className="table-td">{i + 1}</td>
              <td className="table-td font-medium text-text-dark">{t.user?.full_name || 'N/A'}</td>
              <td className="table-td">{t.subject}</td>
              <td className="table-td"><Badge status={t.status} /></td>
              <td className="table-td">{new Date(t.createdAt).toLocaleDateString()}</td>
              <td className="table-td">
                <button onClick={() => { setSelected(t); setModalOpen(true) }} className="text-primary hover:bg-primary/10 p-1.5 rounded-lg transition">
                  <Eye size={16} />
                </button>
              </td>
            </tr>
          ))}
        </Table>
      </div>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Support Ticket">
        {selected && (
          <div className="space-y-4">
            <div>
              <p className="text-xs text-secondary">Subject</p>
              <p className="font-medium text-text-dark">{selected.subject}</p>
            </div>
            <div>
              <p className="text-xs text-secondary">Message</p>
              <p className="text-sm text-text-main bg-bg-main p-3 rounded-lg">{selected.message}</p>
            </div>
            <div className="border-t border-border-color pt-4">
              <textarea placeholder="Write reply..." value={reply} onChange={e => setReply(e.target.value)} rows={3}
                className="w-full border border-border-color rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary resize-none" />
              <button onClick={sendReply} className="btn-primary mt-2"><Send size={16} /> Send Reply</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
