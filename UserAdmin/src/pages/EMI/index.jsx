import { useEffect, useState } from 'react'
import { emiAPI } from '../../api/services'
import { PageHeader, Badge, Table } from '../../components/common'

export default function EMI() {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    emiAPI.getAll()
      .then(res => setList(res.data.data || []))
      .catch(() => setList([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <PageHeader title="EMI Management" subtitle="Track all active and completed EMIs" />
      <div className="card">
        <Table
          headers={['#', 'Product', 'Total Amount', 'Paid', 'Balance', 'Due Date', 'Status']}
          loading={loading}
          empty={!list.length}
        >
          {list.map((e, i) => (
            <tr key={e._id} className="hover:bg-bg-main transition-colors">
              <td className="table-td">{i + 1}</td>
              <td className="table-td font-medium text-text-dark">{e.product_name}</td>
              <td className="table-td">₹{e.amount?.toLocaleString()}</td>
              <td className="table-td text-success">₹{e.paid_amount?.toLocaleString()}</td>
              <td className="table-td text-danger">₹{(e.amount - e.paid_amount)?.toLocaleString()}</td>
              <td className="table-td">{new Date(e.due_date).toLocaleDateString()}</td>
              <td className="table-td"><Badge status={e.status} /></td>
            </tr>
          ))}
        </Table>
      </div>
    </div>
  )
}
