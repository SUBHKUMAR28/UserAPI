// Stat Card
export function StatCard({ title, value, icon: Icon, color, trend }) {
  const colors = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    danger: 'bg-danger/10 text-danger',
    info: 'bg-info/10 text-info',
  }
  return (
    <div className="card flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colors[color] || colors.primary}`}>
        <Icon size={22} />
      </div>
      <div>
        <p className="text-xs text-secondary font-medium">{title}</p>
        <p className="text-2xl font-bold text-text-dark">{value}</p>
        {trend && <p className="text-xs text-success mt-0.5">{trend}</p>}
      </div>
    </div>
  )
}

// Badge
export function Badge({ status }) {
  const map = {
    active: 'bg-success/10 text-success',
    inactive: 'bg-secondary/10 text-secondary',
    blocked: 'bg-danger/10 text-danger',
    pending: 'bg-warning/10 text-warning',
    approved: 'bg-success/10 text-success',
    rejected: 'bg-danger/10 text-danger',
    under_review: 'bg-info/10 text-info',
    paid: 'bg-success/10 text-success',
    overdue: 'bg-danger/10 text-danger',
    disbursed: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    failed: 'bg-danger/10 text-danger',
  }
  return (
    <span className={`badge ${map[status] || 'bg-secondary/10 text-secondary'}`}>
      {status?.replace('_', ' ')}
    </span>
  )
}

// Loading Spinner
export function Spinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  )
}

// Empty State
export function Empty({ message = 'No data found' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-secondary">
      <div className="w-16 h-16 bg-bg-main rounded-full flex items-center justify-center mb-3">
        <span className="text-3xl">📭</span>
      </div>
      <p className="text-sm">{message}</p>
    </div>
  )
}

// Page Header
export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-xl font-bold text-text-dark">{title}</h1>
        {subtitle && <p className="text-sm text-secondary mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

// Table wrapper
export function Table({ headers, children, loading, empty }) {
  if (loading) return <Spinner />
  if (empty) return <Empty />
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr>
            {headers.map((h) => <th key={h} className="table-th text-left">{h}</th>)}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  )
}

// Modal
export function Modal({ open, onClose, title, children }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-card w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-border-color">
          <h3 className="font-semibold text-text-dark">{title}</h3>
          <button onClick={onClose} className="text-secondary hover:text-danger text-xl">✕</button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}

// Select
export function Select({ label, value, onChange, options }) {
  return (
    <div>
      {label && <label className="text-xs font-medium text-secondary mb-1 block">{label}</label>}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-border-color rounded-lg px-3 py-2 text-sm text-text-dark focus:outline-none focus:border-primary bg-white"
      >
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  )
}
