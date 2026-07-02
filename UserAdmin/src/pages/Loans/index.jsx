import { useEffect, useState } from 'react'
import { loansAPI } from '../../api/services'
import { PageHeader, Badge, Table, Modal, Select } from '../../components/common'
import { Eye, CheckCircle, XCircle } from 'lucide-react'

export default function Loans() {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    loansAPI.getAll()
      .then(res => setList(res.data.data || []))
      .catch(() => setList([]))
      .finally(() => setLoading(false))
  }, [])

  const updateStatus = async (id, status, rejection_reason) => {
    await loansAPI.updateStatus(id, { status, rejection_reason })
    setList(prev => prev.map(l => l._id === id ? { ...l, status } : l))
    setModalOpen(false)
  }

  return (
    <div>
      <PageHeader title="Loan Applications" subtitle="Review and manage loan requests" />
      <div className="card">
        <Table
          headers={['#', 'Applicant', 'Amount', 'Tenure', 'Purpose', 'Status', 'Applied', 'Actions']}
          loading={loading}
          empty={!list.length}
        >
          {list.map((l, i) => (
            <tr key={l._id} className="hover:bg-bg-main transition-colors">
              <td className="table-td">{i + 1}</td>
              <td className="table-td font-medium text-text-dark">{l.full_name}</td>
              <td className="table-td font-semibold text-primary">₹{l.requested_amount?.toLocaleString()}</td>
              <td className="table-td">{l.tenure_months} months</td>
              <td className="table-td">{l.purpose || '—'}</td>
              <td className="table-td"><Badge status={l.status} /></td>
              <td className="table-td">{new Date(l.createdAt).toLocaleDateString()}</td>
              <td className="table-td">
                <div className="flex items-center gap-2">
                  <button onClick={() => { setSelected(l); setModalOpen(true) }} className="text-primary hover:bg-primary/10 p-1.5 rounded-lg transition">
                    <Eye size={16} />
                  </button>
                  {l.status === 'pending' && (
                    <>
                      <button onClick={() => updateStatus(l._id, 'approved')} className="text-success hover:bg-success/10 p-1.5 rounded-lg transition">
                        <CheckCircle size={16} />
                      </button>
                      <button onClick={() => updateStatus(l._id, 'rejected')} className="text-danger hover:bg-danger/10 p-1.5 rounded-lg transition">
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
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Loan Details">
        {selected && (
          <div className="grid grid-cols-2 gap-3 text-sm">
            {[
              ['Name', selected.full_name], ['Email', selected.email],
              ['Mobile', selected.mobile], ['PAN', selected.pan_number],
              ['Bank', selected.bank_name], ['IFSC', selected.ifsc_code],
              ['Requested', `₹${selected.requested_amount?.toLocaleString()}`],
              ['Tenure', `${selected.tenure_months} months`],
              ['Purpose', selected.purpose || '—'], ['Status', selected.status],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="text-xs text-secondary">{label}</p>
                <p className="font-medium text-text-dark">{value}</p>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  )
}
