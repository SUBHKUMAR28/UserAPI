import { useEffect, useState } from 'react'
import { bannersAPI } from '../../api/services'
import { PageHeader, Table, Modal } from '../../components/common'
import { Plus, Pencil, Trash2 } from 'lucide-react'

export default function Banners() {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ title: '', redirect_url: '', position: 1 })

  useEffect(() => {
    bannersAPI.getAll()
      .then(res => setList(res.data.data || []))
      .catch(() => setList([]))
      .finally(() => setLoading(false))
  }, [])

  const deleteBanner = async (id) => {
    if (!confirm('Delete this banner?')) return
    await bannersAPI.delete(id)
    setList(prev => prev.filter(b => b._id !== id))
  }

  return (
    <div>
      <PageHeader
        title="Banners"
        subtitle="Manage homepage banners"
        action={
          <button onClick={() => setModalOpen(true)} className="btn-primary">
            <Plus size={16} /> Add Banner
          </button>
        }
      />
      <div className="card">
        <Table
          headers={['#', 'Title', 'Image', 'Redirect URL', 'Position', 'Actions']}
          loading={loading}
          empty={!list.length}
        >
          {list.map((b, i) => (
            <tr key={b._id} className="hover:bg-bg-main transition-colors">
              <td className="table-td">{i + 1}</td>
              <td className="table-td font-medium text-text-dark">{b.title}</td>
              <td className="table-td">
                {b.image_url
                  ? <img src={b.image_url} alt={b.title} className="w-16 h-10 object-cover rounded-lg" />
                  : <span className="text-xs text-secondary">No image</span>
                }
              </td>
              <td className="table-td text-xs truncate max-w-xs">{b.redirect_url || '—'}</td>
              <td className="table-td">{b.position}</td>
              <td className="table-td">
                <div className="flex items-center gap-2">
                  <button className="text-primary hover:bg-primary/10 p-1.5 rounded-lg transition"><Pencil size={15} /></button>
                  <button onClick={() => deleteBanner(b._id)} className="text-danger hover:bg-danger/10 p-1.5 rounded-lg transition"><Trash2 size={15} /></button>
                </div>
              </td>
            </tr>
          ))}
        </Table>
      </div>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Banner">
        <div className="space-y-3">
          <input placeholder="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})}
            className="w-full border border-border-color rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary" />
          <input placeholder="Redirect URL" value={form.redirect_url} onChange={e => setForm({...form, redirect_url: e.target.value})}
            className="w-full border border-border-color rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary" />
          <input type="number" placeholder="Position" value={form.position} onChange={e => setForm({...form, position: e.target.value})}
            className="w-full border border-border-color rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary" />
          <button onClick={() => { bannersAPI.create(form).then(res => { setList(prev => [...prev, res.data.data]); setModalOpen(false) }) }}
            className="btn-primary w-full justify-center">Save Banner</button>
        </div>
      </Modal>
    </div>
  )
}
