
// import { useEffect, useState } from 'react'
// import { productsAPI, categoriesAPI } from '../../api/services'
// import { PageHeader, Table, Modal } from '../../components/common'
// import { Plus, Pencil, Trash2 } from 'lucide-react'

// export default function Products() {
//   const [list, setList] = useState([])
//   const [categories, setCategories] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [modalOpen, setModalOpen] = useState(false)
//   const [editingId, setEditingId] = useState(null)
//   const [form, setForm] = useState({
//     name: '', description: '', price: '', discounted_price: '',
//     stock: '', category: '', brand: '', sku: '',
//     gst_percent: '18', hsn_code: '',
//     weight: '', length: '', width: '', height: '',
//     is_fragile: false,
//     warranty_period: '', warranty_type: 'none',
//     tags: '',
//   })
//   const [imageFiles, setImageFiles] = useState([])
//   const [showNewCategoryInput, setShowNewCategoryInput] = useState(false)
//   const [newCategoryName, setNewCategoryName] = useState('')
//   const [addingCategory, setAddingCategory] = useState(false)

//   useEffect(() => { fetchProducts(); fetchCategories() }, [])

//   const fetchProducts = () => {
//     productsAPI.getAll()
//       .then(res => setList(res.data.data || []))
//       .catch(() => setList([]))
//       .finally(() => setLoading(false))
//   }

//   const fetchCategories = () => {
//     categoriesAPI.getAll()
//       .then(res => setCategories(res.data.data || []))
//       .catch(() => setCategories([]))
//   }

//   const resetForm = () => {
//     setForm({
//       name: '', description: '', price: '', discounted_price: '',
//       stock: '', category: '', brand: '', sku: '',
//       gst_percent: '18', hsn_code: '',
//       weight: '', length: '', width: '', height: '',
//       is_fragile: false, warranty_period: '', warranty_type: 'none', tags: '',
//     })
//     setImageFiles([])
//     setEditingId(null)
//     setShowNewCategoryInput(false)
//     setNewCategoryName('')
//   }

//   const handleCategoryChange = (e) => {
//     const value = e.target.value
//     if (value === '__add_new__') { setShowNewCategoryInput(true); setForm({ ...form, category: '' }) }
//     else { setShowNewCategoryInput(false); setForm({ ...form, category: value }) }
//   }

//   const handleAddNewCategory = () => {
//     if (!newCategoryName.trim()) return
//     setAddingCategory(true)
//     const slug = newCategoryName.trim().toLowerCase().replace(/\s+/g, '-')
//     categoriesAPI.create({ name: newCategoryName.trim(), slug })
//       .then(res => {
//           console.log('1. Category API Full Response:', res.data)        // ADD KARO
//       const newCategory = res.data.data
//       console.log('2. New Category Object:', newCategory)             // ADD KARO
//       console.log('3. New Category ID:', newCategory?._id) 
//         // const newCat = res.data.data
//         setCategories(prev => [...prev, newCategory])
//         setForm(prev => ({ ...prev, category: newCategory._id }))
//         setShowNewCategoryInput(false)
//         setNewCategoryName('')
//       })
//       .catch(err => alert(err.response?.data?.message || 'Failed to create category'))
//        console.log('ERROR creating category:', err.response?.data) 
//       .finally(() => setAddingCategory(false))
//   }

//   const handleSave = () => {

//   console.log('4. Form State Before Save:', form)                     // ADD KARO

//     const formData = new FormData()
//     const { length, width, height, tags, ...rest } = form
//     Object.keys(rest).forEach(key => { if (rest[key] !== '') formData.append(key, rest[key]) })
//     if (length && width && height) {
//       formData.append('dimensions[length]', length)
//       formData.append('dimensions[width]', width)
//       formData.append('dimensions[height]', height)
//     }
//     if (tags) formData.append('tags', tags.split(',').map(t => t.trim()).join(','))
//     imageFiles.forEach(file => formData.append('images', file))

//     const apiCall = editingId ? productsAPI.update(editingId, formData) : productsAPI.create(formData)
//     apiCall.then(() => { fetchProducts(); setModalOpen(false); resetForm() })
//       .catch(err => alert(err.response?.data?.message || 'Something went wrong'))
//   }

//   const handleEdit = (p) => {
//     setForm({
//       name: p.name || '', description: p.description || '',
//       price: p.price || '', discounted_price: p.discounted_price || '',
//       stock: p.stock || '', category: p.category?._id || p.category || '',
//       brand: p.brand || '', sku: p.sku || '',
//       gst_percent: p.gst_percent || '18', hsn_code: p.hsn_code || '',
//       weight: p.weight || '', length: p.dimensions?.length || '',
//       width: p.dimensions?.width || '', height: p.dimensions?.height || '',
//       is_fragile: p.is_fragile || false,
//       warranty_period: p.warranty_period || '', warranty_type: p.warranty_type || 'none',
//       tags: p.tags?.join(', ') || '',
//     })
//     setEditingId(p._id)
//     setModalOpen(true)
//   }

//   const handleDelete = (id) => {
//     if (!window.confirm('Delete this product?')) return
//     productsAPI.delete(id).then(() => setList(l => l.filter(x => x._id !== id)))
//   }

//   const inputClass = "w-full border border-border-color rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
//   const labelClass = "text-xs font-medium text-secondary mb-1 block"

//   return (
//     <div>
//       <PageHeader
//         title="Products"
//         subtitle="Manage product catalog"
//         action={
//           <button onClick={() => { resetForm(); setModalOpen(true) }} className="btn-primary">
//             <Plus size={16} /> Add Product
//           </button>
//         }
//       />
//       <div className="card">
//         <Table headers={['#', 'Image', 'Name', 'Price', 'Discounted', 'Category', 'Stock', 'Actions']} loading={loading} empty={!list.length}>
//           {list.map((p, i) => (
//             <tr key={p._id} className="hover:bg-bg-main transition-colors">
//               <td className="table-td">{i + 1}</td>
//               <td className="table-td">
//                 {p.images?.[0]
//                   ? <img src={p.images[0]} className="w-10 h-10 object-cover rounded-lg" alt={p.name} />
//                   : <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary text-xs font-bold">{p.name?.charAt(0)}</div>}
//               </td>
//               <td className="table-td font-medium text-text-dark">{p.name}</td>
//               <td className="table-td">₹{p.price?.toLocaleString()}</td>
//               <td className="table-td text-success">₹{p.discounted_price?.toLocaleString()}</td>
//               <td className="table-td">{p.category?.name || '-'}</td>
//               <td className="table-td">{p.stock}</td>
//               <td className="table-td">
//                 <div className="flex gap-2">
//                   <button onClick={() => handleEdit(p)} className="text-primary hover:bg-primary/10 p-1.5 rounded-lg"><Pencil size={15} /></button>
//                   <button onClick={() => handleDelete(p._id)} className="text-danger hover:bg-danger/10 p-1.5 rounded-lg"><Trash2 size={15} /></button>
//                 </div>
//               </td>
//             </tr>
//           ))}
//         </Table>
//       </div>

//       <Modal open={modalOpen} onClose={() => { setModalOpen(false); resetForm() }} title={editingId ? 'Edit Product' : 'Add Product'}>
//         <div className="space-y-4">

//           {/* Basic Info */}
//           <div className="bg-bg-main rounded-lg p-3 space-y-3">
//             <p className="text-xs font-semibold text-primary uppercase tracking-wider">Basic Info</p>
//             <input placeholder="Product Name *" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className={inputClass} />
//             <textarea placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className={inputClass} rows={3} />
//             <div className="grid grid-cols-2 gap-2">
//               <input placeholder="Brand" value={form.brand} onChange={e => setForm({...form, brand: e.target.value})} className={inputClass} />
//               <input placeholder="SKU Code" value={form.sku} onChange={e => setForm({...form, sku: e.target.value})} className={inputClass} />
//             </div>
//             <input placeholder="Tags (comma separated)" value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} className={inputClass} />
//           </div>

//           {/* Category */}
//           <div className="bg-bg-main rounded-lg p-3 space-y-3">
//             <p className="text-xs font-semibold text-primary uppercase tracking-wider">Category</p>
//             <select value={showNewCategoryInput ? '__add_new__' : form.category} onChange={handleCategoryChange} className={inputClass}>
//               <option value="">Select Category</option>
//               {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
//               <option value="__add_new__">+ Add New Category</option>
//             </select>
//             {showNewCategoryInput && (
//               <div className="flex gap-2">
//                 <input placeholder="New category name" value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} className="flex-1 border border-primary rounded-lg px-3 py-2 text-sm focus:outline-none" autoFocus />
//                 <button onClick={handleAddNewCategory} disabled={addingCategory || !newCategoryName.trim()} className="btn-primary px-4 disabled:opacity-50">
//                   {addingCategory ? '...' : 'Add'}
//                 </button>
//               </div>
//             )}
//           </div>

//           {/* Pricing */}
//           <div className="bg-bg-main rounded-lg p-3 space-y-3">
//             <p className="text-xs font-semibold text-primary uppercase tracking-wider">Pricing & Stock</p>
//             <div className="grid grid-cols-2 gap-2">
//               <input type="number" placeholder="MRP (₹) *" value={form.price} onChange={e => setForm({...form, price: e.target.value})} className={inputClass} />
//               <input type="number" placeholder="Sale Price (₹)" value={form.discounted_price} onChange={e => setForm({...form, discounted_price: e.target.value})} className={inputClass} />
//               <input type="number" placeholder="Stock Qty *" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} className={inputClass} />
//               <input type="number" placeholder="GST %" value={form.gst_percent} onChange={e => setForm({...form, gst_percent: e.target.value})} className={inputClass} />
//             </div>
//             <input placeholder="HSN Code" value={form.hsn_code} onChange={e => setForm({...form, hsn_code: e.target.value})} className={inputClass} />
//           </div>

//           {/* Shipping */}
//           <div className="bg-bg-main rounded-lg p-3 space-y-3">
//             <p className="text-xs font-semibold text-primary uppercase tracking-wider">Shipping</p>
//             <div className="grid grid-cols-2 gap-2">
//               <input type="number" placeholder="Weight (grams)" value={form.weight} onChange={e => setForm({...form, weight: e.target.value})} className={inputClass} />
//               <input type="number" placeholder="Length (cm)" value={form.length} onChange={e => setForm({...form, length: e.target.value})} className={inputClass} />
//               <input type="number" placeholder="Width (cm)" value={form.width} onChange={e => setForm({...form, width: e.target.value})} className={inputClass} />
//               <input type="number" placeholder="Height (cm)" value={form.height} onChange={e => setForm({...form, height: e.target.value})} className={inputClass} />
//             </div>
//             <label className="flex items-center gap-2 text-sm text-text-main cursor-pointer">
//               <input type="checkbox" checked={form.is_fragile} onChange={e => setForm({...form, is_fragile: e.target.checked})} className="accent-primary" />
//               Fragile Item
//             </label>
//           </div>

//           {/* Warranty */}
//           <div className="bg-bg-main rounded-lg p-3 space-y-3">
//             <p className="text-xs font-semibold text-primary uppercase tracking-wider">Warranty</p>
//             <div className="grid grid-cols-2 gap-2">
//               <input placeholder="Period (e.g. 1 year)" value={form.warranty_period} onChange={e => setForm({...form, warranty_period: e.target.value})} className={inputClass} />
//               <select value={form.warranty_type} onChange={e => setForm({...form, warranty_type: e.target.value})} className={inputClass}>
//                 <option value="none">No Warranty</option>
//                 <option value="brand">Brand Warranty</option>
//                 <option value="seller">Seller Warranty</option>
//               </select>
//             </div>
//           </div>

//           {/* Images */}
//           <div className="bg-bg-main rounded-lg p-3 space-y-2">
//             <p className="text-xs font-semibold text-primary uppercase tracking-wider">Product Images</p>
//             <input type="file" multiple accept="image/*" onChange={e => setImageFiles(Array.from(e.target.files))} className={inputClass} />
//             {imageFiles.length > 0 && <p className="text-xs text-secondary">{imageFiles.length} file(s) selected</p>}
//           </div>

//           <button onClick={handleSave} className="btn-primary w-full justify-center">Save Product</button>
//         </div>
//       </Modal>
//     </div>
//   )
// }

// import { useEffect, useState } from 'react'
// import { productsAPI, categoriesAPI } from '../../api/services'
// import { PageHeader, Table, Modal } from '../../components/common'
// import { Plus, Pencil, Trash2 } from 'lucide-react'

// const inputClass = "w-full border border-border-color rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"

// export default function Products() {
//   const [list, setList] = useState([])
//   const [categories, setCategories] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [modalOpen, setModalOpen] = useState(false)
//   const [editingId, setEditingId] = useState(null)
//   const [form, setForm] = useState({
//     name: '',
//     description: '',
//     price: '',
//     discounted_price: '',
//     stock: '',
//     category: '',
//   })
//   const [specs, setSpecs] = useState({})
//   const [imageFiles, setImageFiles] = useState([])
//   const [selectedCategoryFields, setSelectedCategoryFields] = useState([]) // DB se aayega ab

//   useEffect(() => {
//     fetchProducts()
//     fetchCategories()
//   }, [])

//   const fetchProducts = () => {
//     productsAPI.getAll()
//       .then(res => setList(res.data.data || []))
//       .catch(() => setList([]))
//       .finally(() => setLoading(false))
//   }

//   const fetchCategories = () => {
//     categoriesAPI.getAll()
//       .then(res => setCategories(res.data.data || []))
//       .catch(() => setCategories([]))
//   }

//   const resetForm = () => {
//     setForm({ name: '', description: '', price: '', discounted_price: '', stock: '', category: '' })
//     setSpecs({})
//     setSelectedCategoryFields([])
//     setImageFiles([])
//     setEditingId(null)
//   }

//   const handleImageChange = (e) => {
//     setImageFiles(Array.from(e.target.files))
//   }

//   // Category select hote hi DB se uske spec_fields nikalo
//   const handleCategoryChange = (e) => {
//     const categoryId = e.target.value
//     const selectedCat = categories.find((c) => c._id === categoryId)
//     setForm({ ...form, category: categoryId })
//     setSelectedCategoryFields(selectedCat?.spec_fields || [])
//     setSpecs({})
//   }

//   const handleSpecChange = (key, value) => {
//     setSpecs((prev) => ({ ...prev, [key]: value }))
//   }

//   const handleSave = () => {
//     const formData = new FormData()
//     Object.keys(form).forEach((key) => {
//       if (form[key] !== '') formData.append(key, form[key])
//     })

//     if (Object.keys(specs).length > 0) {
//       formData.append('specifications', JSON.stringify(specs))
//     }

//     imageFiles.forEach((file) => {
//       formData.append('images', file)
//     })

//     const apiCall = editingId
//       ? productsAPI.update(editingId, formData)
//       : productsAPI.create(formData)

//     apiCall.then(() => {
//       fetchProducts()
//       setModalOpen(false)
//       resetForm()
//     }).catch((err) => {
//       alert(err.response?.data?.message || 'Something went wrong')
//     })
//   }

//   const handleEdit = (p) => {
//     const categoryId = p.category?._id || p.category || ''
//     const selectedCat = categories.find((c) => c._id === categoryId)

//     setForm({
//       name: p.name || '',
//       description: p.description || '',
//       price: p.price || '',
//       discounted_price: p.discounted_price || '',
//       stock: p.stock || '',
//       category: categoryId,
//     })
//     setSelectedCategoryFields(selectedCat?.spec_fields || [])
//     setSpecs(p.specifications || {})
//     setEditingId(p._id)
//     setModalOpen(true)
//   }

//   const handleDelete = (id) => {
//     if (!window.confirm('Delete this product?')) return
//     productsAPI.delete(id).then(() => setList((l) => l.filter((x) => x._id !== id)))
//   }

//   return (
//     <div>
//       <PageHeader
//         title="Products"
//         subtitle="Manage product catalog"
//         action={
//           <button onClick={() => { resetForm(); setModalOpen(true) }} className="btn-primary">
//             <Plus size={16} /> Add Product
//           </button>
//         }
//       />
//       <div className="card">
//         <Table headers={['#', 'Image', 'Name', 'Price', 'Discounted', 'Category', 'Stock', 'Actions']} loading={loading} empty={!list.length}>
//           {list.map((p, i) => (
//             <tr key={p._id} className="hover:bg-bg-main transition-colors">
//               <td className="table-td">{i + 1}</td>
//               <td className="table-td">
//                 {p.images?.[0] ? (
//                   <img src={p.images[0]} className="w-10 h-10 object-cover rounded-lg" alt={p.name} />
//                 ) : (
//                   <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary text-xs font-bold">
//                     {p.name?.charAt(0)}
//                   </div>
//                 )}
//               </td>
//               <td className="table-td font-medium text-text-dark">{p.name}</td>
//               <td className="table-td">₹{p.price?.toLocaleString()}</td>
//               <td className="table-td text-success">₹{p.discounted_price?.toLocaleString()}</td>
//               <td className="table-td">{p.category?.name || '-'}</td>
//               <td className="table-td">{p.stock}</td>
//               <td className="table-td">
//                 <div className="flex gap-2">
//                   <button onClick={() => handleEdit(p)} className="text-primary hover:bg-primary/10 p-1.5 rounded-lg">
//                     <Pencil size={15} />
//                   </button>
//                   <button onClick={() => handleDelete(p._id)} className="text-danger hover:bg-danger/10 p-1.5 rounded-lg">
//                     <Trash2 size={15} />
//                   </button>
//                 </div>
//               </td>
//             </tr>
//           ))}
//         </Table>
//       </div>

//       <Modal open={modalOpen} onClose={() => { setModalOpen(false); resetForm() }} title={editingId ? 'Edit Product' : 'Add Product'}>
//         <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
//           <input
//             placeholder="Name"
//             value={form.name}
//             onChange={(e) => setForm({ ...form, name: e.target.value })}
//             className={inputClass}
//           />

//           <textarea
//             placeholder="Description"
//             value={form.description}
//             onChange={(e) => setForm({ ...form, description: e.target.value })}
//             className={inputClass}
//             rows={3}
//           />

//           <input
//             type="number"
//             placeholder="Price (MRP)"
//             value={form.price}
//             onChange={(e) => setForm({ ...form, price: e.target.value })}
//             className={inputClass}
//           />

//           <input
//             type="number"
//             placeholder="Discounted Price"
//             value={form.discounted_price}
//             onChange={(e) => setForm({ ...form, discounted_price: e.target.value })}
//             className={inputClass}
//           />

//           <input
//             type="number"
//             placeholder="Stock"
//             value={form.stock}
//             onChange={(e) => setForm({ ...form, stock: e.target.value })}
//             className={inputClass}
//           />

//           <select value={form.category} onChange={handleCategoryChange} className={inputClass}>
//             <option value="">Select Category</option>
//             {categories.map((c) => (
//               <option key={c._id} value={c._id}>{c.name}</option>
//             ))}
//           </select>

//           {/* Dynamic Fields - ab DB se aate hain, hardcoded nahi */}
//           {selectedCategoryFields.length > 0 && (
//             <div className="bg-bg-main rounded-lg p-3 space-y-3">
//               <p className="text-xs font-semibold text-primary uppercase tracking-wider">
//                 Specifications
//               </p>
//               {selectedCategoryFields.map((field) => (
//                 <input
//                   key={field.key}
//                   placeholder={field.placeholder}
//                   value={specs[field.key] || ''}
//                   onChange={(e) => handleSpecChange(field.key, e.target.value)}
//                   className={inputClass}
//                 />
//               ))}
//             </div>
//           )}

//           <div>
//             <label className="text-sm text-text-light block mb-1">Product Images</label>
//             <input
//               type="file"
//               multiple
//               accept="image/*"
//               onChange={handleImageChange}
//               className={inputClass}
//             />
//             {imageFiles.length > 0 && (
//               <p className="text-xs text-text-light mt-1">{imageFiles.length} file(s) selected</p>
//             )}
//           </div>

//           <button onClick={handleSave} className="btn-primary w-full justify-center">
//             Save
//           </button>
//         </div>
//       </Modal>
//     </div>
//   )
// }
import { useEffect, useState } from 'react'
import { productsAPI, categoriesAPI } from '../../api/services'
import { PageHeader, Table, Modal } from '../../components/common'
import { Plus, Pencil, Trash2 } from 'lucide-react'

const inputClass = "w-full border border-border-color rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"

export default function Products() {
  const [list, setList] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [saving, setSaving] = useState(false)

  const [selectedCategoryId, setSelectedCategoryId] = useState('')
  const [selectedCategoryFields, setSelectedCategoryFields] = useState([])

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    discounted_price: '',
    stock: '',
  })
  const [specs, setSpecs] = useState({})
  const [imageFiles, setImageFiles] = useState([])

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const fetchProducts = () => {
    productsAPI.getAll()
      .then(res => setList(res.data.data || []))
      .catch(() => setList([]))
      .finally(() => setLoading(false))
  }

  const fetchCategories = () => {
    categoriesAPI.getAll()
      .then(res => setCategories(res.data.data || []))
      .catch(() => setCategories([]))
  }

  const resetForm = () => {
    setSelectedCategoryId('')
    setSelectedCategoryFields([])
    setForm({ name: '', description: '', price: '', discounted_price: '', stock: '' })
    setSpecs({})
    setImageFiles([])
    setEditingId(null)
  }

  const openAddModal = () => {
    resetForm()
    setModalOpen(true)
  }

  // Category select hote hi uske spec_fields nikalo aur dynamic form dikhao
  const handleCategorySelect = (e) => {
    const categoryId = e.target.value
    setSelectedCategoryId(categoryId)
    setSpecs({}) // category badalte hi purane specs clear karo

    const selectedCat = categories.find((c) => c._id === categoryId)
    setSelectedCategoryFields(selectedCat?.spec_fields || [])
  }

  const handleSpecChange = (key, value) => {
    setSpecs((prev) => ({ ...prev, [key]: value }))
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 5) // max 5 images
    setImageFiles(files)
  }

  const handleSave = () => {
    if (!selectedCategoryId) {
      alert('Please select a category first')
      return
    }
    if (!form.name.trim()) {
      alert('Product name is required')
      return
    }
    if (!form.price) {
      alert('Price is required')
      return
    }

    setSaving(true)

    const formData = new FormData()
    formData.append('category', selectedCategoryId)
    Object.keys(form).forEach((key) => {
      if (form[key] !== '') formData.append(key, form[key])
    })

    if (Object.keys(specs).length > 0) {
      formData.append('specifications', JSON.stringify(specs))
    }

    imageFiles.forEach((file) => {
      formData.append('images', file)
    })

    const apiCall = editingId
      ? productsAPI.update(editingId, formData)
      : productsAPI.create(formData)

    apiCall
      .then(() => {
        fetchProducts()
        setModalOpen(false)
        resetForm()
      })
      .catch((err) => {
        alert(err.response?.data?.message || 'Something went wrong')
      })
      .finally(() => setSaving(false))
  }

  const handleEdit = (p) => {
    const categoryId = p.category?._id || p.category || ''
    const selectedCat = categories.find((c) => c._id === categoryId)

    setSelectedCategoryId(categoryId)
    setSelectedCategoryFields(selectedCat?.spec_fields || [])
    setForm({
      name: p.name || '',
      description: p.description || '',
      price: p.price || '',
      discounted_price: p.discounted_price || '',
      stock: p.stock || '',
    })
    setSpecs(p.specifications || {})
    setEditingId(p._id)
    setModalOpen(true)
  }

  const handleDelete = (id) => {
    if (!window.confirm('Delete this product?')) return
    productsAPI.delete(id).then(() => setList((l) => l.filter((x) => x._id !== id)))
  }

  return (
    <div>
      <PageHeader
        title="Products"
        subtitle="Manage product catalog"
        action={
          <button onClick={openAddModal} className="btn-primary">
            <Plus size={16} /> Add Product
          </button>
        }
      />

      <div className="card">
        <Table headers={['#', 'Image', 'Name', 'Price', 'Discounted', 'Category', 'Stock', 'Actions']} loading={loading} empty={!list.length}>
          {list.map((p, i) => (
            <tr key={p._id} className="hover:bg-bg-main transition-colors">
              <td className="table-td">{i + 1}</td>
              <td className="table-td">
                {p.images?.[0] ? (
                  <img src={p.images[0]} className="w-10 h-10 object-cover rounded-lg" alt={p.name} />
                ) : (
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary text-xs font-bold">
                    {p.name?.charAt(0)}
                  </div>
                )}
              </td>
              <td className="table-td font-medium text-text-dark">{p.name}</td>
              <td className="table-td">₹{p.price?.toLocaleString()}</td>
              <td className="table-td text-success">₹{p.discounted_price?.toLocaleString()}</td>
              <td className="table-td">{p.category?.name || '-'}</td>
              <td className="table-td">{p.stock}</td>
              <td className="table-td">
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(p)} className="text-primary hover:bg-primary/10 p-1.5 rounded-lg">
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => handleDelete(p._id)} className="text-danger hover:bg-danger/10 p-1.5 rounded-lg">
                    <Trash2 size={15} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </Table>
      </div>

      <Modal open={modalOpen} onClose={() => { setModalOpen(false); resetForm() }} title={editingId ? 'Edit Product' : 'Add Product'}>
        <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">

          {/* STEP 1: Category - sabse pehle yeh dikhega */}
          <div>
            <label className="text-xs font-semibold text-text-light uppercase tracking-wider mb-1 block">
              Category *
            </label>
            <select value={selectedCategoryId} onChange={handleCategorySelect} className={inputClass}>
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Jab tak category select nahi hoti, baaki form nahi dikhega */}
          {selectedCategoryId && (
            <>
              {/* STEP 2: Category-specific dynamic fields */}
              {selectedCategoryFields.length > 0 && (
                <div className="bg-bg-main rounded-lg p-3 space-y-3">
                  <p className="text-xs font-semibold text-primary uppercase tracking-wider">
                    Specifications
                  </p>
                  {selectedCategoryFields.map((field) => (
                    <div key={field.key}>
                      <label className="text-xs text-text-light mb-1 block">{field.label}</label>
                      <input
                        placeholder={field.placeholder}
                        value={specs[field.key] || ''}
                        onChange={(e) => handleSpecChange(field.key, e.target.value)}
                        className={inputClass}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* STEP 3: Common Product Fields */}
              <div>
                <label className="text-xs font-semibold text-text-light uppercase tracking-wider mb-1 block">Name *</label>
                <input
                  placeholder="Product name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-text-light uppercase tracking-wider mb-1 block">Description</label>
                <textarea
                  placeholder="Product description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className={inputClass}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-text-light uppercase tracking-wider mb-1 block">Price (MRP) *</label>
                  <input
                    type="number"
                    placeholder="999"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-text-light uppercase tracking-wider mb-1 block">Discounted Price</label>
                  <input
                    type="number"
                    placeholder="799"
                    value={form.discounted_price}
                    onChange={(e) => setForm({ ...form, discounted_price: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-text-light uppercase tracking-wider mb-1 block">Stock</label>
                <input
                  type="number"
                  placeholder="50"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  className={inputClass}
                />
              </div>

              {/* STEP 4: Images - max 5 */}
              <div>
                <label className="text-xs font-semibold text-text-light uppercase tracking-wider mb-1 block">
                  Product Images (max 5)
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className={inputClass}
                />
                {imageFiles.length > 0 && (
                  <p className="text-xs text-text-light mt-1">{imageFiles.length} file(s) selected</p>
                )}
              </div>

              <button onClick={handleSave} disabled={saving} className="btn-primary w-full justify-center disabled:opacity-50">
                {saving ? 'Saving...' : 'Save'}
              </button>
            </>
          )}
        </div>
      </Modal>
    </div>
  )
}