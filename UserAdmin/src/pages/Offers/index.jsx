import { useEffect, useState } from 'react'
import { offersAPI } from '../../api/services'
import { PageHeader, Table, Modal, Badge } from '../../components/common'
import { Plus, Pencil, Trash2 } from 'lucide-react'

export default function Offers() {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', discount_percent: '', valid_till: '' })

  useEffect(() => {
    offersAPI.getAll()
      .then(res => setList(res.data.data || []))
      .catch(() => setList([]))
      .finally(() => setLoading(false))
  }, [])

  const deleteOffer = async (id) => {
    if (!confirm('Delete this offer?')) return
    await offersAPI.delete(id)
    setList(prev => prev.filter(o => o._id !== id))
  }

  return (
    <div>
      <PageHeader
        title="Offers"
        subtitle="Manage promotional offers"
        action={
          <button onClick={() => setModalOpen(true)} className="btn-primary">
            <Plus size={16} /> Add Offer
          </button>
        }
      />
      <div className="card">
        <Table
          headers={['#', 'Title', 'Description', 'Discount', 'Valid Till', 'Actions']}
          loading={loading}
          empty={!list.length}
        >
          {list.map((o, i) => (
            <tr key={o._id} className="hover:bg-bg-main transition-colors">
              <td className="table-td">{i + 1}</td>
              <td className="table-td font-medium text-text-dark">{o.title}</td>
              <td className="table-td text-xs max-w-xs truncate">{o.description}</td>
              <td className="table-td">
                <span className="badge bg-success/10 text-success">{o.discount_percent}% OFF</span>
              </td>
              <td className="table-td">{o.valid_till ? new Date(o.valid_till).toLocaleDateString() : '—'}</td>
              <td className="table-td">
                <div className="flex items-center gap-2">
                  <button className="text-primary hover:bg-primary/10 p-1.5 rounded-lg transition"><Pencil size={15} /></button>
                  <button onClick={() => deleteOffer(o._id)} className="text-danger hover:bg-danger/10 p-1.5 rounded-lg transition"><Trash2 size={15} /></button>
                </div>
              </td>
            </tr>
          ))}
        </Table>
      </div>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Offer">
        <div className="space-y-3">
          {['title', 'description', 'discount_percent', 'valid_till'].map(field => (
            <input key={field} placeholder={field.replace('_', ' ')} type={field === 'valid_till' ? 'date' : field === 'discount_percent' ? 'number' : 'text'}
              value={form[field]} onChange={e => setForm({...form, [field]: e.target.value})}
              className="w-full border border-border-color rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary" />
          ))}
          <button onClick={() => { offersAPI.create(form).then(res => { setList(prev => [...prev, res.data.data]); setModalOpen(false) }) }}
            className="btn-primary w-full justify-center">Save Offer</button>
        </div>
      </Modal>
    </div>
  )
}
