import { useEffect, useState } from 'react'
import { walletAPI } from '../../api/services'
import { PageHeader, Table, Spinner } from '../../components/common'

export default function Wallet() {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    walletAPI.getAll()
      .then(res => setList(res.data.data || []))
      .catch(() => setList([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <PageHeader title="Wallet Management" subtitle="Monitor user wallet balances" />
      <div className="card">
        <Table
          headers={['#', 'User', 'Balance', 'Total Added', 'Total Spent', 'Currency', 'Actions']}
          loading={loading}
          empty={!list.length}
        >
          {list.map((w, i) => (
            <tr key={w._id} className="hover:bg-bg-main transition-colors">
              <td className="table-td">{i + 1}</td>
              <td className="table-td font-medium text-text-dark">{w.user?.full_name || 'N/A'}</td>
              <td className="table-td font-semibold text-primary">₹{w.balance?.toLocaleString()}</td>
              <td className="table-td text-success">₹{w.total_added?.toLocaleString()}</td>
              <td className="table-td text-danger">₹{w.total_spent?.toLocaleString()}</td>
              <td className="table-td">{w.currency}</td>
              <td className="table-td">
                <button className="btn-outline text-xs py-1">Edit</button>
              </td>
            </tr>
          ))}
        </Table>
      </div>
    </div>
  )
}
