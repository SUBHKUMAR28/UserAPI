import { useEffect, useState } from 'react'
import { transactionsAPI } from '../../api/services'
import { PageHeader, Badge, Table } from '../../components/common'

export default function Transactions() {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    transactionsAPI.getAll()
      .then(res => setList(res.data.data || []))
      .catch(() => setList([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <PageHeader title="Transactions" subtitle="All payment transactions" />
      <div className="card">
        <Table
          headers={['#', 'Transaction ID', 'Amount', 'Method', 'Status', 'Date']}
          loading={loading}
          empty={!list.length}
        >
          {list.map((t, i) => (
            <tr key={t._id} className="hover:bg-bg-main transition-colors">
              <td className="table-td">{i + 1}</td>
              <td className="table-td"><code className="text-xs bg-bg-main px-2 py-0.5 rounded">{t.transaction_id}</code></td>
              <td className="table-td font-semibold text-primary">₹{t.amount?.toLocaleString()}</td>
              <td className="table-td capitalize">{t.payment_method}</td>
              <td className="table-td"><Badge status={t.status} /></td>
              <td className="table-td">{new Date(t.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </Table>
      </div>
    </div>
  )
}
