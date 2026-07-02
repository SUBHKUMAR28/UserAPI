import { useEffect, useState } from 'react'
import { dashboardAPI } from '../../api/services'
import { StatCard, Spinner } from '../../components/common'
import { Users, Wallet, CreditCard, BarChart3, Package, ShoppingCart, Gift } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'

const monthlyData = [
  { month: 'Jan', earning: 40000, expense: 24000 },
  { month: 'Feb', earning: 30000, expense: 13980 },
  { month: 'Mar', earning: 60000, expense: 28000 },
  { month: 'Apr', earning: 80000, expense: 39080 },
  { month: 'May', earning: 55000, expense: 48000 },
  { month: 'Jun', earning: 70000, expense: 38000 },
  { month: 'Jul', earning: 65000, expense: 43000 },
  { month: 'Aug', earning: 90000, expense: 43000 },
  { month: 'Sep', earning: 75000, expense: 35000 },
]

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    dashboardAPI.get()
      .then(res => setData(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Spinner />

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="card bg-gradient-to-r from-primary to-primary-light text-white flex items-center justify-between">
        <div>
          <p className="text-white/80 text-sm">Congratulations 🎉</p>
          <h2 className="text-2xl font-bold mt-1">{data?.user_details?.full_name || 'Admin'}</h2>
          <p className="text-white/80 text-sm mt-1">You have 3 new KYC requests today!</p>
          <button className="mt-3 bg-white text-primary text-sm font-semibold px-4 py-2 rounded-lg hover:bg-white/90 transition">
            View Reports
          </button>
        </div>
        <div className="hidden md:block text-6xl">🏆</div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Users" value="8.5k" icon={Users} color="primary" trend="↑ 12% this month" />
        <StatCard title="Wallet Balance" value={`₹${(data?.wallet_balance || 0).toLocaleString()}`} icon={Wallet} color="success" />
        <StatCard title="Active EMIs" value={data?.active_emi_count || 0} icon={CreditCard} color="warning" />
        <StatCard title="Products" value="1.4k" icon={Package} color="info" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-text-dark">Revenue Report</h3>
            <div className="flex items-center gap-4 text-xs text-secondary">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary inline-block" /> Earning</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-warning inline-block" /> Expense</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EBE9F1" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6E6B7B' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#6E6B7B' }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Bar dataKey="earning" fill="#7367F0" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" fill="#FF9F43" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Stats */}
        <div className="card">
          <h3 className="font-semibold text-text-dark mb-4">Quick Stats</h3>
          <div className="space-y-4">
            {[
              { label: 'Orders', value: '2.76k', icon: ShoppingCart, color: 'text-primary' },
              { label: 'Rewards', value: '1.2k', icon: Gift, color: 'text-success' },
              { label: 'Loans', value: '342', icon: BarChart3, color: 'text-warning' },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="flex items-center justify-between p-3 bg-bg-main rounded-lg">
                <div className="flex items-center gap-3">
                  <Icon size={18} className={color} />
                  <span className="text-sm text-text-main">{label}</span>
                </div>
                <span className="font-bold text-text-dark">{value}</span>
              </div>
            ))}
          </div>

          {/* Earnings donut placeholder */}
          <div className="mt-4 p-4 bg-bg-main rounded-lg text-center">
            <p className="text-xs text-secondary">This Month Earnings</p>
            <p className="text-2xl font-bold text-primary mt-1">₹40,55.56</p>
            <p className="text-xs text-success mt-1">↑ 68.2% more than last month</p>
          </div>
        </div>
      </div>

      {/* Banners + Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Banners */}
        <div className="card">
          <h3 className="font-semibold text-text-dark mb-4">Active Banners</h3>
          <div className="space-y-3">
            {data?.banners?.length ? data.banners.map((b) => (
              <div key={b.id} className="flex items-center gap-3 p-2 bg-bg-main rounded-lg">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-bold text-xs">
                  {b.title?.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-text-dark">{b.title}</p>
                  <p className="text-xs text-secondary truncate">{b.redirect_url || 'No redirect'}</p>
                </div>
              </div>
            )) : (
              <p className="text-sm text-secondary text-center py-4">No banners available</p>
            )}
          </div>
        </div>

        {/* Categories */}
        <div className="card">
          <h3 className="font-semibold text-text-dark mb-4">Categories</h3>
          <div className="grid grid-cols-2 gap-3">
            {data?.categories?.length ? data.categories.map((c) => (
              <div key={c.id} className="p-3 bg-bg-main rounded-lg">
                <p className="text-sm font-medium text-text-dark">{c.name}</p>
                <p className="text-xs text-secondary">{c.slug}</p>
              </div>
            )) : (
              <p className="text-sm text-secondary col-span-2 text-center py-4">No categories</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
