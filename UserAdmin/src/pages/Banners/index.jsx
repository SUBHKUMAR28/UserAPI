// import { useEffect, useState } from 'react'
// import { bannersAPI } from '../../api/services'
// import { PageHeader, Table, Modal } from '../../components/common'
// import { Plus, Pencil, Trash2 } from 'lucide-react'

// export default function Banners() {
//   const [list, setList] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [modalOpen, setModalOpen] = useState(false)
//   const [form, setForm] = useState({ title: '', redirect_url: '', position: 1 })

//   useEffect(() => {
//     bannersAPI.getAll()
//       .then(res => setList(res.data.data || []))
//       .catch(() => setList([]))
//       .finally(() => setLoading(false))
//   }, [])

//   const deleteBanner = async (id) => {
//     if (!confirm('Delete this banner?')) return
//     await bannersAPI.delete(id)
//     setList(prev => prev.filter(b => b._id !== id))
//   }

//   return (
//     <div>
//       <PageHeader
//         title="Banners"
//         subtitle="Manage homepage banners"
//         action={
//           <button onClick={() => setModalOpen(true)} className="btn-primary">
//             <Plus size={16} /> Add Banner
//           </button>
//         }
//       />
//       <div className="card">
//         <Table
//           headers={['#', 'Title', 'Image', 'Redirect URL', 'Position', 'Actions']}
//           loading={loading}
//           empty={!list.length}
//         >
//           {list.map((b, i) => (
//             <tr key={b._id} className="hover:bg-bg-main transition-colors">
//               <td className="table-td">{i + 1}</td>
//               <td className="table-td font-medium text-text-dark">{b.title}</td>
//               <td className="table-td">
//                 {b.image_url
//                   ? <img src={b.image_url} alt={b.title} className="w-16 h-10 object-cover rounded-lg" />
//                   : <span className="text-xs text-secondary">No image</span>
//                 }
//               </td>
//               <td className="table-td text-xs truncate max-w-xs">{b.redirect_url || '—'}</td>
//               <td className="table-td">{b.position}</td>
//               <td className="table-td">
//                 <div className="flex items-center gap-2">
//                   <button className="text-primary hover:bg-primary/10 p-1.5 rounded-lg transition"><Pencil size={15} /></button>
//                   <button onClick={() => deleteBanner(b._id)} className="text-danger hover:bg-danger/10 p-1.5 rounded-lg transition"><Trash2 size={15} /></button>
//                 </div>
//               </td>
//             </tr>
//           ))}
//         </Table>
//       </div>
//       <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Banner">
//         <div className="space-y-3">
//           <input placeholder="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})}
//             className="w-full border border-border-color rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary" />
//           <input placeholder="Redirect URL" value={form.redirect_url} onChange={e => setForm({...form, redirect_url: e.target.value})}
//             className="w-full border border-border-color rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary" />
//           <input type="number" placeholder="Position" value={form.position} onChange={e => setForm({...form, position: e.target.value})}
//             className="w-full border border-border-color rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary" />
//           <button onClick={() => { bannersAPI.create(form).then(res => { setList(prev => [...prev, res.data.data]); setModalOpen(false) }) }}
//             className="btn-primary w-full justify-center">Save Banner</button>
//         </div>
//       </Modal>
//     </div>
//   )
// }
import { useEffect, useState } from 'react'
import { bannersAPI } from '../../api/services'
import { PageHeader, Table, Modal } from '../../components/common'
import { Plus, Pencil, Trash2, Upload } from 'lucide-react'

export default function Banners() {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ title: '', redirect_url: '', position: 1 })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

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

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const resetForm = () => {
    setForm({ title: '', redirect_url: '', position: 1 })
    setImageFile(null)
    setImagePreview(null)
  }

  const handleSave = async () => {
    if (!form.title || !imageFile) {
      alert('Title aur image dono zaroori hain')
      return
    }
    setSaving(true)
    try {
      const fd = new FormData()
      fd.append('title', form.title)
      fd.append('redirect_url', form.redirect_url)
      fd.append('position', form.position)
      fd.append('image', imageFile) // 'image' backend ke uploadBanner.single('image') se match hona chahiye

      const res = await bannersAPI.create(fd)
      setList(prev => [...prev, res.data.data])
      setModalOpen(false)
      resetForm()
    } catch (err) {
      alert(err?.response?.data?.message || 'Banner add karne me error aaya')
    } finally {
      setSaving(false)
    }
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

      <Modal open={modalOpen} onClose={() => { setModalOpen(false); resetForm() }} title="Add Banner">
        <div className="space-y-3">
          <input
            placeholder="Title"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            className="w-full border border-border-color rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
          />
          <input
            placeholder="Redirect URL"
            value={form.redirect_url}
            onChange={e => setForm({ ...form, redirect_url: e.target.value })}
            className="w-full border border-border-color rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
          />
          <input
            type="number"
            placeholder="Position"
            value={form.position}
            onChange={e => setForm({ ...form, position: e.target.value })}
            className="w-full border border-border-color rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
          />

          {/* Image picker */}
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-border-color rounded-lg p-4 cursor-pointer hover:border-primary transition">
            {imagePreview ? (
              <img src={imagePreview} alt="preview" className="w-full h-32 object-cover rounded-lg mb-2" />
            ) : (
              <Upload size={22} className="text-secondary mb-1" />
            )}
            <span className="text-xs text-secondary">
              {imageFile ? imageFile.name : 'Click to choose photo from device'}
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary w-full justify-center disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save Banner'}
          </button>
        </div>
      </Modal>
    </div>
  )
}
