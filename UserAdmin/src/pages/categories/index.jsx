// import { useEffect, useState } from 'react'
// import { categoriesAPI } from '../../api/services'
// import { PageHeader, Table, Modal } from '../../components/common'
// import { Plus, Pencil, Trash2 } from 'lucide-react'

// const inputClass = "w-full border border-border-color rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"

// export default function Categories() {
//   const [list, setList] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [modalOpen, setModalOpen] = useState(false)
//   const [editingId, setEditingId] = useState(null)
//   const [saving, setSaving] = useState(false)
//   const [name, setName] = useState('')

//   useEffect(() => {
//     fetchCategories()
//   }, [])

//   const fetchCategories = () => {
//     setLoading(true)
//     categoriesAPI.getAll()
//       .then(res => setList(res.data.data || []))
//       .catch(() => setList([]))
//       .finally(() => setLoading(false))
//   }

//   const resetForm = () => {
//     setName('')
//     setEditingId(null)
//   }

//   const openAddModal = () => {
//     resetForm()
//     setModalOpen(true)
//   }

//   const openEditModal = (cat) => {
//     setName(cat.name || '')
//     setEditingId(cat._id)
//     setModalOpen(true)
//   }

//   const handleSave = () => {
//     if (!name.trim()) {
//       alert('Category name is required')
//       return
//     }

//     setSaving(true)
//     const slug = name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
//     const payload = { name: name.trim(), slug }

//     const apiCall = editingId
//       ? categoriesAPI.update(editingId, payload)
//       : categoriesAPI.create(payload)

//     apiCall
//       .then(() => {
//         fetchCategories()
//         setModalOpen(false)
//         resetForm()
//       })
//       .catch((err) => {
//         alert(err.response?.data?.message || 'Something went wrong')
//       })
//       .finally(() => setSaving(false))
//   }

//   const handleDelete = (id) => {
//     if (!window.confirm('Delete this category? Products linked to it may be affected.')) return
//     categoriesAPI.delete(id)
//       .then(() => setList((l) => l.filter((c) => c._id !== id)))
//       .catch((err) => alert(err.response?.data?.message || 'Failed to delete'))
//   }

//   return (
//     <div>
//       <PageHeader
//         title="Categories"
//         subtitle="Manage product and service categories"
//         action={
//           <button onClick={openAddModal} className="btn-primary">
//             <Plus size={16} /> Add Category
//           </button>
//         }
//       />

//       <div className="card">
//         <Table headers={['#', 'Name', 'Slug', 'Actions']} loading={loading} empty={!list.length}>
//           {list.map((c, i) => (
//             <tr key={c._id} className="hover:bg-bg-main transition-colors">
//               <td className="table-td">{i + 1}</td>
//               <td className="table-td font-medium text-text-dark">{c.name}</td>
//               <td className="table-td text-text-light">{c.slug}</td>
//               <td className="table-td">
//                 <div className="flex gap-2">
//                   <button onClick={() => openEditModal(c)} className="text-primary hover:bg-primary/10 p-1.5 rounded-lg">
//                     <Pencil size={15} />
//                   </button>
//                   <button onClick={() => handleDelete(c._id)} className="text-danger hover:bg-danger/10 p-1.5 rounded-lg">
//                     <Trash2 size={15} />
//                   </button>
//                 </div>
//               </td>
//             </tr>
//           ))}
//         </Table>
//       </div>

//       <Modal open={modalOpen} onClose={() => { setModalOpen(false); resetForm() }} title={editingId ? 'Edit Category' : 'Add Category'}>
//         <div className="space-y-3">
//           <div>
//             <label className="text-xs font-semibold text-text-light uppercase tracking-wider mb-1 block">Name</label>
//             <input
//               placeholder="e.g. Mobile Phones"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               className={inputClass}
//               autoFocus
//             />
//           </div>

//           <button onClick={handleSave} disabled={saving} className="btn-primary w-full justify-center disabled:opacity-50">
//             {saving ? 'Saving...' : 'Save'}
//           </button>
//         </div>
//       </Modal>
//     </div>
//   )
// }
import { useEffect, useState } from 'react'
import { categoriesAPI } from '../../api/services'
import { PageHeader, Table, Modal } from '../../components/common'
import { Plus, Pencil, Trash2, X } from 'lucide-react'

const inputClass = "w-full border border-border-color rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"

export default function Categories() {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [saving, setSaving] = useState(false)

  const [name, setName] = useState('')
  const [specFields, setSpecFields] = useState([]) // [{key, label, placeholder}]
  const [newField, setNewField] = useState({ key: '', label: '', placeholder: '' })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = () => {
    setLoading(true)
    categoriesAPI.getAll()
      .then(res => setList(res.data.data || []))
      .catch(() => setList([]))
      .finally(() => setLoading(false))
  }

  const resetForm = () => {
    setName('')
    setSpecFields([])
    setNewField({ key: '', label: '', placeholder: '' })
    setEditingId(null)
  }

  const openAddModal = () => {
    resetForm()
    setModalOpen(true)
  }

  const openEditModal = (cat) => {
    setName(cat.name || '')
    setSpecFields(cat.spec_fields || [])
    setEditingId(cat._id)
    setModalOpen(true)
  }

  // Naya spec field add karo list me
  const handleAddField = () => {
    if (!newField.label.trim()) {
      alert('Field label is required')
      return
    }
    // label se automatically key generate karo (jaise "RAM" -> "ram")
    const key = newField.key.trim() || newField.label.trim().toLowerCase().replace(/\s+/g, '_')

    setSpecFields((prev) => [...prev, { key, label: newField.label.trim(), placeholder: newField.placeholder.trim() }])
    setNewField({ key: '', label: '', placeholder: '' })
  }

  const handleRemoveField = (index) => {
    setSpecFields((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSave = () => {
    if (!name.trim()) {
      alert('Category name is required')
      return
    }

    setSaving(true)
    const slug = name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    const payload = { name: name.trim(), slug, spec_fields: specFields }

    const apiCall = editingId
      ? categoriesAPI.update(editingId, payload)
      : categoriesAPI.create(payload)

    apiCall
      .then(() => {
        fetchCategories()
        setModalOpen(false)
        resetForm()
      })
      .catch((err) => {
        alert(err.response?.data?.message || 'Something went wrong')
      })
      .finally(() => setSaving(false))
  }

  const handleDelete = (id) => {
    if (!window.confirm('Delete this category? Products linked to it may be affected.')) return
    categoriesAPI.delete(id)
      .then(() => setList((l) => l.filter((c) => c._id !== id)))
      .catch((err) => alert(err.response?.data?.message || 'Failed to delete'))
  }

  return (
    <div>
      <PageHeader
        title="Categories"
        subtitle="Manage product and service categories"
        action={
          <button onClick={openAddModal} className="btn-primary">
            <Plus size={16} /> Add Category
          </button>
        }
      />

      <div className="card">
        <Table headers={['#', 'Name', 'Slug', 'Spec Fields', 'Actions']} loading={loading} empty={!list.length}>
          {list.map((c, i) => (
            <tr key={c._id} className="hover:bg-bg-main transition-colors">
              <td className="table-td">{i + 1}</td>
              <td className="table-td font-medium text-text-dark">{c.name}</td>
              <td className="table-td text-text-light">{c.slug}</td>
              <td className="table-td text-text-light">
                {c.spec_fields?.length ? `${c.spec_fields.length} fields` : 'None'}
              </td>
              <td className="table-td">
                <div className="flex gap-2">
                  <button onClick={() => openEditModal(c)} className="text-primary hover:bg-primary/10 p-1.5 rounded-lg">
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => handleDelete(c._id)} className="text-danger hover:bg-danger/10 p-1.5 rounded-lg">
                    <Trash2 size={15} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </Table>
      </div>

      <Modal open={modalOpen} onClose={() => { setModalOpen(false); resetForm() }} title={editingId ? 'Edit Category' : 'Add Category'}>
        <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
          <div>
            <label className="text-xs font-semibold text-text-light uppercase tracking-wider mb-1 block">Category Name</label>
            <input
              placeholder="e.g. Mobile"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
              autoFocus
            />
          </div>

          {/* Existing Spec Fields List */}
          {specFields.length > 0 && (
            <div className="bg-bg-main rounded-lg p-3 space-y-2">
              <p className="text-xs font-semibold text-primary uppercase tracking-wider">Specification Fields</p>
              {specFields.map((field, index) => (
                <div key={index} className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-border-color">
                  <div>
                    <p className="text-sm font-medium text-text-dark">{field.label}</p>
                    <p className="text-xs text-text-light">key: {field.key} {field.placeholder && `• ${field.placeholder}`}</p>
                  </div>
                  <button onClick={() => handleRemoveField(index)} className="text-danger hover:bg-danger/10 p-1 rounded-lg">
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add New Spec Field Form */}
          <div className="border border-dashed border-primary/40 rounded-lg p-3 space-y-2">
            <p className="text-xs font-semibold text-text-light uppercase tracking-wider">Add Specification Field</p>
            <input
              placeholder="Field Label (e.g. RAM)"
              value={newField.label}
              onChange={(e) => setNewField({ ...newField, label: e.target.value })}
              className={inputClass}
            />
            <input
              placeholder="Placeholder example (e.g. 8GB)"
              value={newField.placeholder}
              onChange={(e) => setNewField({ ...newField, placeholder: e.target.value })}
              className={inputClass}
            />
            <button onClick={handleAddField} className="w-full text-sm font-medium text-primary border border-primary rounded-lg py-1.5 hover:bg-primary/5">
              + Add This Field
            </button>
          </div>

          <button onClick={handleSave} disabled={saving} className="btn-primary w-full justify-center disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Category'}
          </button>
        </div>
      </Modal>
    </div>
  )
}