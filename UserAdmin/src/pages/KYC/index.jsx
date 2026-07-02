import { useEffect, useState } from 'react'
import { kycAPI } from '../../api/services'
import { PageHeader, Badge, Table, Modal, Select } from '../../components/common'
import { Eye, CheckCircle, XCircle } from 'lucide-react'

export default function KYC() {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [reason, setReason] = useState('')
  const [filter, setFilter] = useState('')

  useEffect(() => {
    kycAPI.getAll(filter ? { status: filter } : {})
      .then(res => setList(res.data.data || []))
      .catch(() => setList([]))
      .finally(() => setLoading(false))
  }, [filter])

  const updateStatus = async (id, status, rejection_reason) => {
    await kycAPI.updateStatus(id, { status, rejection_reason })
    setList(prev => prev.map(k => k._id === id ? { ...k, status } : k))
    setModalOpen(false)
  }

  return (
    <div>
      <PageHeader
        title="KYC Management"
        subtitle="Review and approve user KYC submissions"
        action={
          <Select
            value={filter}
            onChange={setFilter}
            options={[
              { value: '', label: 'All Status' },
              { value: 'pending', label: 'Pending' },
              { value: 'under_review', label: 'Under Review' },
              { value: 'approved', label: 'Approved' },
              { value: 'rejected', label: 'Rejected' },
            ]}
          />
        }
      />
      <div className="card">
        <Table
          headers={['#', 'Name', 'PAN', 'Aadhaar', 'Requested', 'Status', 'Submitted', 'Actions']}
          loading={loading}
          empty={!list.length}
        >
          {list.map((k, i) => (
            <tr key={k._id} className="hover:bg-bg-main transition-colors">
              <td className="table-td">{i + 1}</td>
              <td className="table-td font-medium text-text-dark">{k.full_name}</td>
              <td className="table-td"><code className="text-xs">{k.pan_number}</code></td>
              <td className="table-td"><code className="text-xs">{k.aadhaar_number}</code></td>
              <td className="table-td font-semibold text-primary">₹{k.requested_amount?.toLocaleString()}</td>
              <td className="table-td"><Badge status={k.status} /></td>
              <td className="table-td">{new Date(k.createdAt).toLocaleDateString()}</td>
              <td className="table-td">
                <div className="flex items-center gap-2">
                  <button onClick={() => { setSelected(k); setModalOpen(true) }} className="text-primary hover:bg-primary/10 p-1.5 rounded-lg transition">
                    <Eye size={16} />
                  </button>
                  {k.status === 'pending' && (
                    <>
                      <button onClick={() => updateStatus(k._id, 'approved')} className="text-success hover:bg-success/10 p-1.5 rounded-lg transition">
                        <CheckCircle size={16} />
                      </button>
                      <button onClick={() => { setSelected(k); setModalOpen(true) }} className="text-danger hover:bg-danger/10 p-1.5 rounded-lg transition">
                        <XCircle size={16} />
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </Table>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="KYC Details">
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                ['Name', selected.full_name], ['Email', selected.email],
                ['Mobile', selected.mobile], ['PAN', selected.pan_number],
                ['Aadhaar', selected.aadhaar_number], ['DOB', selected.date_of_birth?.slice(0, 10)],
                ['Gender', selected.gender], ['City', selected.city],
                ['State', selected.state], ['Employment', selected.employment_type],
                ['Salary', `₹${selected.monthly_salary?.toLocaleString()}`],
                ['Requested', `₹${selected.requested_amount?.toLocaleString()}`],
                ['Bank', selected.bank_name], ['IFSC', selected.ifsc_code],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-xs text-secondary">{label}</p>
                  <p className="font-medium text-text-dark">{value}</p>
                </div>
              ))}
            </div>

            {selected.status === 'pending' && (
              <div className="space-y-3 border-t border-border-color pt-4">
                <textarea
                  placeholder="Rejection reason (required for reject)"
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  className="w-full border border-border-color rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary resize-none"
                  rows={3}
                />
                <div className="flex gap-3">
                  <button onClick={() => updateStatus(selected._id, 'approved')} className="btn-primary flex-1 justify-center bg-success hover:bg-success/90">
                    <CheckCircle size={16} /> Approve
                  </button>
                  <button onClick={() => updateStatus(selected._id, 'rejected', reason)} className="btn-primary flex-1 justify-center bg-danger hover:bg-danger/90">
                    <XCircle size={16} /> Reject
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}
