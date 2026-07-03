
// import { useEffect, useState } from 'react'
// import { offersAPI, productsAPI } from '../../api/services'
// import { PageHeader, Table, Modal } from '../../components/common'
// import { Plus, Pencil, Trash2, X, Package } from 'lucide-react'

// const inputClass = "w-full border border-border-color rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"

// export default function Offers() {
//   const [list, setList] = useState([])
//   const [products, setProducts] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [modalOpen, setModalOpen] = useState(false)
//   const [editingId, setEditingId] = useState(null)
//   const [saving, setSaving] = useState(false)

//   // Product link modal
//   const [productModalOpen, setProductModalOpen] = useState(false)
//   const [selectedOfferId, setSelectedOfferId] = useState(null)
//   const [selectedOffer, setSelectedOffer] = useState(null)

//   const [form, setForm] = useState({
//     title: '',
//     description: '',
//     discount_amount: '',
//     min_order_amount: '',
//     valid_till: '',
//     is_active: true,
//   })

//   useEffect(() => {
//     fetchOffers()
//     fetchProducts()
//   }, [])

//   const fetchOffers = () => {
//     setLoading(true)
//     offersAPI.getAll()
//       .then(res => setList(res.data.data || []))
//       .catch(() => setList([]))
//       .finally(() => setLoading(false))
//   }

//   const fetchProducts = () => {
//     productsAPI.getAll()
//       .then(res => setProducts(res.data.data || []))
//       .catch(() => setProducts([]))
//   }

//   const resetForm = () => {
//     setForm({ title: '', description: '', discount_amount: '', min_order_amount: '', valid_till: '', is_active: true })
//     setEditingId(null)
//   }

//   const openEditModal = (offer) => {
//     setForm({
//       title: offer.title || '',
//       description: offer.description || '',
//       discount_amount: offer.discount_amount || '',
//       min_order_amount: offer.min_order_amount || '',
//       valid_till: offer.valid_till ? offer.valid_till.split('T')[0] : '',
//       is_active: offer.is_active !== undefined ? offer.is_active : true,
//     })
//     setEditingId(offer._id)
//     setModalOpen(true)
//   }

//   const handleSave = () => {
//     if (!form.title.trim()) { alert('Title is required'); return }
//     if (!form.discount_amount) { alert('Discount amount is required'); return }

//     setSaving(true)
//     const payload = {
//       title: form.title.trim(),
//       description: form.description.trim() || null,
//       discount_amount: Number(form.discount_amount),
//       min_order_amount: Number(form.min_order_amount) || 0,
//       valid_till: form.valid_till || null,
//       is_active: form.is_active,
//     }

//     const apiCall = editingId
//       ? offersAPI.update(editingId, payload)
//       : offersAPI.create(payload)

//     apiCall
//       .then(() => {
//         fetchOffers()
//         setModalOpen(false)
//         resetForm()
//       })
//       .catch(err => alert(err.response?.data?.message || 'Something went wrong'))
//       .finally(() => setSaving(false))
//   }

//   const handleDelete = (id) => {
//     if (!window.confirm('Delete this offer?')) return
//     offersAPI.delete(id).then(() => setList(prev => prev.filter(o => o._id !== id)))
//   }

//   // Product link modal open karo
//   const openProductModal = (offer) => {
//     setSelectedOfferId(offer._id)
//     setSelectedOffer(offer)
//     setProductModalOpen(true)
//   }

//   // Product offer se link karo
//   const handleAddProduct = (productId) => {
//     offersAPI.addProduct(selectedOfferId, productId)
//       .then(() => {
//         fetchOffers()
//         // Selected offer update karo
//         offersAPI.getById(selectedOfferId)
//           .then(res => setSelectedOffer(res.data.data))
//       })
//       .catch(err => alert(err.response?.data?.message || 'Failed to add product'))
//   }

//   // Product offer se remove karo
//   const handleRemoveProduct = (productId) => {
//     offersAPI.removeProduct(selectedOfferId, productId)
//       .then(() => {
//         fetchOffers()
//         offersAPI.getById(selectedOfferId)
//           .then(res => setSelectedOffer(res.data.data))
//       })
//       .catch(err => alert(err.response?.data?.message || 'Failed to remove product'))
//   }

//   // Check karo product already linked hai ya nahi
//   const isProductLinked = (productId) => {
//     return selectedOffer?.applicable_products?.some(
//       p => (p._id || p) === productId
//     )
//   }

//   return (
//     <div>
//       <PageHeader
//         title="Offers"
//         subtitle="Manage promotional offers"
//         action={
//           <button onClick={() => { resetForm(); setModalOpen(true) }} className="btn-primary">
//             <Plus size={16} /> Add Offer
//           </button>
//         }
//       />

//       <div className="card">
//         <Table
//           headers={['#', 'Title', 'Discount', 'Min Order', 'Valid Till', 'Products', 'Status', 'Actions']}
//           loading={loading}
//           empty={!list.length}
//         >
//           {list.map((o, i) => (
//             <tr key={o._id} className="hover:bg-bg-main transition-colors">
//               <td className="table-td">{i + 1}</td>
//               <td className="table-td">
//                 <p className="font-medium text-text-dark">{o.title}</p>
//                 {o.description && <p className="text-xs text-text-light truncate max-w-xs">{o.description}</p>}
//               </td>
//               <td className="table-td">
//                 <span className="px-2 py-1 bg-success/10 text-success rounded-full text-xs font-medium">
//                   ₹{o.discount_amount} OFF
//                 </span>
//               </td>
//               <td className="table-td text-text-light">
//                 {o.min_order_amount ? `₹${o.min_order_amount}` : '—'}
//               </td>
//               <td className="table-td text-text-light">
//                 {o.valid_till ? new Date(o.valid_till).toLocaleDateString() : '—'}
//               </td>
//               <td className="table-td">
//                 <button
//                   onClick={() => openProductModal(o)}
//                   className="flex items-center gap-1 text-xs text-primary hover:bg-primary/10 px-2 py-1 rounded-lg"
//                 >
//                   <Package size={13} />
//                   {o.applicable_products?.length || 0} Products
//                 </button>
//               </td>
//               <td className="table-td">
//                 <span className={`px-2 py-1 rounded-full text-xs font-medium ${o.is_active ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
//                   {o.is_active ? 'Active' : 'Inactive'}
//                 </span>
//               </td>
//               <td className="table-td">
//                 <div className="flex gap-2">
//                   <button onClick={() => openEditModal(o)} className="text-primary hover:bg-primary/10 p-1.5 rounded-lg">
//                     <Pencil size={15} />
//                   </button>
//                   <button onClick={() => handleDelete(o._id)} className="text-danger hover:bg-danger/10 p-1.5 rounded-lg">
//                     <Trash2 size={15} />
//                   </button>
//                 </div>
//               </td>
//             </tr>
//           ))}
//         </Table>
//       </div>

//       {/* Add/Edit Offer Modal */}
//       <Modal open={modalOpen} onClose={() => { setModalOpen(false); resetForm() }} title={editingId ? 'Edit Offer' : 'Add Offer'}>
//         <div className="space-y-3">
//           <div>
//             <label className="text-xs font-semibold text-text-light uppercase tracking-wider mb-1 block">Title *</label>
//             <input
//               placeholder="e.g. Flat ₹500 Off"
//               value={form.title}
//               onChange={e => setForm({ ...form, title: e.target.value })}
//               className={inputClass}
//               autoFocus
//             />
//           </div>

//           <div>
//             <label className="text-xs font-semibold text-text-light uppercase tracking-wider mb-1 block">Description</label>
//             <textarea
//               placeholder="e.g. Get ₹500 off on selected products"
//               value={form.description}
//               onChange={e => setForm({ ...form, description: e.target.value })}
//               className={inputClass}
//               rows={2}
//             />
//           </div>

//           <div className="grid grid-cols-2 gap-3">
//             <div>
//               <label className="text-xs font-semibold text-text-light uppercase tracking-wider mb-1 block">Discount Amount (₹) *</label>
//               <input
//                 type="number"
//                 placeholder="e.g. 500"
//                 value={form.discount_amount}
//                 onChange={e => setForm({ ...form, discount_amount: e.target.value })}
//                 className={inputClass}
//               />
//             </div>
//             <div>
//               <label className="text-xs font-semibold text-text-light uppercase tracking-wider mb-1 block">Min Order Amount (₹)</label>
//               <input
//                 type="number"
//                 placeholder="e.g. 2000"
//                 value={form.min_order_amount}
//                 onChange={e => setForm({ ...form, min_order_amount: e.target.value })}
//                 className={inputClass}
//               />
//             </div>
//           </div>

//           <div>
//             <label className="text-xs font-semibold text-text-light uppercase tracking-wider mb-1 block">Valid Till</label>
//             <input
//               type="date"
//               value={form.valid_till}
//               onChange={e => setForm({ ...form, valid_till: e.target.value })}
//               className={inputClass}
//             />
//           </div>

//           <div className="flex items-center gap-2">
//             <input
//               type="checkbox"
//               id="is_active"
//               checked={form.is_active}
//               onChange={e => setForm({ ...form, is_active: e.target.checked })}
//               className="w-4 h-4"
//             />
//             <label htmlFor="is_active" className="text-sm text-text-dark">Active</label>
//           </div>

//           <button onClick={handleSave} disabled={saving} className="btn-primary w-full justify-center disabled:opacity-50">
//             {saving ? 'Saving...' : 'Save Offer'}
//           </button>
//         </div>
//       </Modal>

//       {/* Products Link Modal */}
//       <Modal open={productModalOpen} onClose={() => setProductModalOpen(false)} title={`Manage Products — ${selectedOffer?.title || ''}`}>
//         <div className="space-y-3 max-h-[60vh] overflow-y-auto">
//           <p className="text-xs text-text-light">Click on a product to add/remove it from this offer</p>

//           {products.length === 0 && (
//             <p className="text-center text-text-light text-sm py-4">No products found</p>
//           )}

//           {products.map((p) => {
//             const linked = isProductLinked(p._id)
//             return (
//               <div key={p._id} className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${linked ? 'border-success bg-success/5' : 'border-border-color hover:bg-bg-main'}`}>
//                 <div className="flex items-center gap-3">
//                   {p.images?.[0] ? (
//                     <img src={p.images[0]} className="w-10 h-10 object-cover rounded-lg" alt={p.name} />
//                   ) : (
//                     <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary text-xs font-bold">
//                       {p.name?.charAt(0)}
//                     </div>
//                   )}
//                   <div>
//                     <p className="text-sm font-medium text-text-dark">{p.name}</p>
//                     <p className="text-xs text-text-light">₹{p.price?.toLocaleString()}</p>
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => linked ? handleRemoveProduct(p._id) : handleAddProduct(p._id)}
//                   className={`text-xs px-3 py-1.5 rounded-lg font-medium transition ${linked ? 'bg-danger/10 text-danger hover:bg-danger/20' : 'bg-primary/10 text-primary hover:bg-primary/20'}`}
//                 >
//                   {linked ? 'Remove' : 'Add'}
//                 </button>
//               </div>
//             )
//           })}
//         </div>
//       </Modal>
//     </div>
//   )
// }



import { useEffect, useState } from 'react'
import { offersAPI, productsAPI } from '../../api/services'
import { PageHeader, Table, Modal } from '../../components/common'
import { Plus, Pencil, Trash2, X, Package } from 'lucide-react'

const inputClass = "w-full border border-border-color rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"

export default function Offers() {
  const [list, setList] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    title: '',
    description: '',
    discount_amount: '',
    min_order_amount: '',
    valid_till: '',
    is_active: true,
    product_names: [],
  })

  useEffect(() => {
    fetchOffers()
    fetchProducts()
  }, [])

  const fetchOffers = () => {
    setLoading(true)
    offersAPI.getAll()
      .then(res => setList(res.data.data || []))
      .catch(() => setList([]))
      .finally(() => setLoading(false))
  }

  const fetchProducts = () => {
    productsAPI.getAll()
      .then(res => setProducts(res.data.data || []))
      .catch(() => setProducts([]))
  }

  const resetForm = () => {
    setForm({
      title: '',
      description: '',
      discount_amount: '',
      min_order_amount: '',
      valid_till: '',
      is_active: true,
      product_names: [],
    })
    setEditingId(null)
  }

  const openEditModal = (offer) => {
    setForm({
      title: offer.title || '',
      description: offer.description || '',
      discount_amount: offer.discount_amount || '',
      min_order_amount: offer.min_order_amount || '',
      valid_till: offer.valid_till ? offer.valid_till.split('T')[0] : '',
      is_active: offer.is_active !== undefined ? offer.is_active : true,
      product_names: offer.applicable_products?.map(p => p.name) || [],
    })
    setEditingId(offer._id)
    setModalOpen(true)
  }

  const toggleProductName = (name) => {
    setForm(prev => ({
      ...prev,
      product_names: prev.product_names.includes(name)
        ? prev.product_names.filter(n => n !== name)
        : [...prev.product_names, name],
    }))
  }

  const handleSave = () => {
    if (!form.title.trim()) { alert('Title is required'); return }
    if (!form.discount_amount) { alert('Discount amount is required'); return }

    setSaving(true)
    const payload = {
      title: form.title.trim(),
      description: form.description.trim() || null,
      discount_amount: Number(form.discount_amount),
      min_order_amount: Number(form.min_order_amount) || 0,
      valid_till: form.valid_till || null,
      is_active: form.is_active,
      product_names: form.product_names,
    }

    const apiCall = editingId
      ? offersAPI.update(editingId, payload)
      : offersAPI.create(payload)

    apiCall
      .then(() => {
        fetchOffers()
        setModalOpen(false)
        resetForm()
      })
      .catch(err => alert(err.response?.data?.message || 'Something went wrong'))
      .finally(() => setSaving(false))
  }

  const handleDelete = (id) => {
    if (!window.confirm('Delete this offer?')) return
    offersAPI.delete(id).then(() => setList(prev => prev.filter(o => o._id !== id)))
  }

  return (
    <div>
      <PageHeader
        title="Offers"
        subtitle="Manage promotional offers"
        action={
          <button onClick={() => { resetForm(); setModalOpen(true) }} className="btn-primary">
            <Plus size={16} /> Add Offer
          </button>
        }
      />

      <div className="card">
        <Table
          headers={['#', 'Title', 'Discount', 'Min Order', 'Valid Till', 'Products', 'Status', 'Actions']}
          loading={loading}
          empty={!list.length}
        >
          {list.map((o, i) => (
            <tr key={o._id} className="hover:bg-bg-main transition-colors">
              <td className="table-td">{i + 1}</td>
              <td className="table-td">
                <p className="font-medium text-text-dark">{o.title}</p>
                {o.description && <p className="text-xs text-text-light truncate max-w-xs">{o.description}</p>}
              </td>
              <td className="table-td">
                <span className="px-2 py-1 bg-success/10 text-success rounded-full text-xs font-medium">
                  ₹{o.discount_amount} OFF
                </span>
              </td>
              <td className="table-td text-text-light">
                {o.min_order_amount ? `₹${o.min_order_amount}` : '—'}
              </td>
              <td className="table-td text-text-light">
                {o.valid_till ? new Date(o.valid_till).toLocaleDateString() : '—'}
              </td>
              <td className="table-td">
                <span className="flex items-center gap-1 text-xs text-text-light">
                  <Package size={13} />
                  {o.applicable_products?.length || 0} Products
                </span>
              </td>
              <td className="table-td">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${o.is_active ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                  {o.is_active ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td className="table-td">
                <div className="flex gap-2">
                  <button onClick={() => openEditModal(o)} className="text-primary hover:bg-primary/10 p-1.5 rounded-lg">
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => handleDelete(o._id)} className="text-danger hover:bg-danger/10 p-1.5 rounded-lg">
                    <Trash2 size={15} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </Table>
      </div>

      {/* Add/Edit Offer Modal */}
      <Modal open={modalOpen} onClose={() => { setModalOpen(false); resetForm() }} title={editingId ? 'Edit Offer' : 'Add Offer'}>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-text-light uppercase tracking-wider mb-1 block">Title *</label>
            <input
              placeholder="e.g. Flat ₹500 Off"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              className={inputClass}
              autoFocus
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-text-light uppercase tracking-wider mb-1 block">Description</label>
            <textarea
              placeholder="e.g. Get ₹500 off on selected products"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              className={inputClass}
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-text-light uppercase tracking-wider mb-1 block">Discount Amount (₹) *</label>
              <input
                type="number"
                placeholder="e.g. 500"
                value={form.discount_amount}
                onChange={e => setForm({ ...form, discount_amount: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-text-light uppercase tracking-wider mb-1 block">Min Order Amount (₹)</label>
              <input
                type="number"
                placeholder="e.g. 2000"
                value={form.min_order_amount}
                onChange={e => setForm({ ...form, min_order_amount: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-text-light uppercase tracking-wider mb-1 block">Valid Till</label>
            <input
              type="date"
              value={form.valid_till}
              onChange={e => setForm({ ...form, valid_till: e.target.value })}
              className={inputClass}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_active"
              checked={form.is_active}
              onChange={e => setForm({ ...form, is_active: e.target.checked })}
              className="w-4 h-4"
            />
            <label htmlFor="is_active" className="text-sm text-text-dark">Active</label>
          </div>

          <div>
            <label className="text-xs font-semibold text-text-light uppercase tracking-wider mb-1 block">
              Apply to Products
            </label>
            <div className="border border-border-color rounded-lg max-h-48 overflow-y-auto p-2 space-y-1">
              {products.length === 0 && (
                <p className="text-xs text-text-light text-center py-2">No products found</p>
              )}
              {products.map((p) => (
                <label
                  key={p._id}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-bg-main cursor-pointer text-sm"
                >
                  <input
                    type="checkbox"
                    checked={form.product_names.includes(p.name)}
                    onChange={() => toggleProductName(p.name)}
                    className="w-4 h-4"
                  />
                  <span className="text-text-dark">{p.name}</span>
                </label>
              ))}
            </div>
            {form.product_names.length > 0 && (
              <p className="text-xs text-text-light mt-1">{form.product_names.length} product(s) selected</p>
            )}
          </div>

          <button onClick={handleSave} disabled={saving} className="btn-primary w-full justify-center disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Offer'}
          </button>
        </div>
      </Modal>
    </div>
  )
}