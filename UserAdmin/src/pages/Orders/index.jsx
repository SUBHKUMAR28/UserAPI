import { useEffect, useState } from 'react'
import { ordersAPI } from '../../api/services'
import { PageHeader, Badge, Table } from '../../components/common'

export default function Orders() {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ordersAPI.getAll()
      .then(res => setList(res.data.data || []))
      .catch(() => setList([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <PageHeader title="Orders" subtitle="Track all customer orders" />
      <div className="card">
        <Table headers={['#', 'Order ID', 'Customer', 'Amount', 'Items', 'Status', 'Date']} loading={loading} empty={!list.length}>
          {list.map((o, i) => (
            <tr key={o._id} className="hover:bg-bg-main transition-colors">
              <td className="table-td">{i + 1}</td>
              <td className="table-td"><code className="text-xs bg-bg-main px-2 py-0.5 rounded">#{o._id?.slice(-6)}</code></td>
              <td className="table-td font-medium text-text-dark">{o.user?.full_name || 'N/A'}</td>
              <td className="table-td font-semibold text-primary">₹{o.total_amount?.toLocaleString()}</td>
              <td className="table-td">{o.items?.length || 0} items</td>
              <td className="table-td"><Badge status={o.status} /></td>
              <td className="table-td">{new Date(o.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </Table>
      </div>
    </div>
  )
}
