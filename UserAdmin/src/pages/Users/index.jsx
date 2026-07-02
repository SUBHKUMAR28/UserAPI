import { useEffect, useState } from 'react'
import { usersAPI } from '../../api/services'
import { PageHeader, Badge, Table, Modal, Select, Spinner } from '../../components/common'
import { UserCheck, UserX } from 'lucide-react'

export default function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    usersAPI.getAll()
      .then(res => setUsers(res.data.data || []))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false))
  }, [])

  const updateStatus = async (id, status) => {
    await usersAPI.updateStatus(id, { account_status: status })
    setUsers(prev => prev.map(u => u._id === id ? { ...u, account_status: status } : u))
  }

  return (
    <div>
      <PageHeader title="Users" subtitle="Manage all registered users" />
      <div className="card">
        <Table
          headers={['#', 'Name', 'Email', 'Mobile', 'Member ID', 'Status', 'Joined', 'Actions']}
          loading={loading}
          empty={!users.length}
        >
          {users.map((u, i) => (
            <tr key={u._id} className="hover:bg-bg-main transition-colors">
              <td className="table-td">{i + 1}</td>
              <td className="table-td font-medium text-text-dark">{u.full_name}</td>
              <td className="table-td">{u.email}</td>
              <td className="table-td">{u.mobile}</td>
              <td className="table-td"><code className="bg-bg-main px-2 py-0.5 rounded text-xs">{u.member_id}</code></td>
              <td className="table-td"><Badge status={u.account_status} /></td>
              <td className="table-td">{new Date(u.createdAt).toLocaleDateString()}</td>
              <td className="table-td">
                <div className="flex items-center gap-2">
                  {u.account_status !== 'active' ? (
                    <button onClick={() => updateStatus(u._id, 'active')} className="text-success hover:bg-success/10 p-1.5 rounded-lg transition" title="Activate">
                      <UserCheck size={16} />
                    </button>
                  ) : (
                    <button onClick={() => updateStatus(u._id, 'blocked')} className="text-danger hover:bg-danger/10 p-1.5 rounded-lg transition" title="Block">
                      <UserX size={16} />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </Table>
      </div>
    </div>
  )
}
