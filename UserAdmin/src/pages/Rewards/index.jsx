import { useEffect, useState } from 'react'
import { rewardsAPI } from '../../api/services'
import { PageHeader, Table } from '../../components/common'

export default function Rewards() {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    rewardsAPI.getAll()
      .then(res => setList(res.data.data || []))
      .catch(() => setList([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <PageHeader title="Rewards" subtitle="User reward points overview" />
      <div className="card">
        <Table headers={['#', 'User', 'Points', 'Total Earned', 'Total Redeemed', 'Last Activity']} loading={loading} empty={!list.length}>
          {list.map((r, i) => (
            <tr key={r._id} className="hover:bg-bg-main transition-colors">
              <td className="table-td">{i + 1}</td>
              <td className="table-td font-medium text-text-dark">{r.user?.full_name || 'N/A'}</td>
              <td className="table-td font-semibold text-warning">{r.points?.toLocaleString()} pts</td>
              <td className="table-td text-success">{r.total_earned?.toLocaleString()} pts</td>
              <td className="table-td text-danger">{r.total_redeemed?.toLocaleString()} pts</td>
              <td className="table-td">{r.updatedAt ? new Date(r.updatedAt).toLocaleDateString() : '—'}</td>
            </tr>
          ))}
        </Table>
      </div>
    </div>
  )
}
