import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Users, FileCheck, Wallet, CreditCard,
  Package, ShoppingCart, Tag, Bell, HeadphonesIcon,
  Gift, BarChart3, Image, ChevronRight,FolderTree
} from 'lucide-react'

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { label: 'Users', icon: Users, path: '/users' },
  { label: 'KYC', icon: FileCheck, path: '/kyc' },
  { label: 'Loans', icon: BarChart3, path: '/loans' },
  { label: 'EMI', icon: CreditCard, path: '/emi' },
  { label: 'Wallet', icon: Wallet, path: '/wallet' },
  { label: 'Transactions', icon: ChevronRight, path: '/transactions' },
  { label: 'Categories', icon: FolderTree, path: '/categories' },
  { label: 'Products', icon: Package, path: '/products' },
  { label: 'Orders', icon: ShoppingCart, path: '/orders' },
  { label: 'Banners', icon: Image, path: '/banners' },
  { label: 'Offers', icon: Tag, path: '/offers' },
  { label: 'Rewards', icon: Gift, path: '/rewards' },
  { label: 'Notifications', icon: Bell, path: '/notifications' },
  { label: 'Support', icon: HeadphonesIcon, path: '/support' },
]

export default function Sidebar({ open }) {
  return (
    <aside className={`fixed top-0 left-0 h-screen bg-white shadow-sidebar z-30 transition-all duration-300 ${open ? 'w-64' : 'w-20'} flex flex-col`}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-border-color">
        <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-lg">L</span>
        </div>
        {open && <span className="text-text-dark font-bold text-xl">LockPe</span>}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {open && <p className="text-xs font-semibold text-secondary uppercase tracking-widest px-2 mb-2">Menu</p>}
        {navItems.map(({ label, icon: Icon, path }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 
              ${isActive ? 'bg-primary text-white shadow-md' : 'text-text-main hover:bg-primary/10 hover:text-primary'}`
            }
          >
            <Icon size={18} className="flex-shrink-0" />
            {open && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Version */}
      {open && (
        <div className="px-5 py-4 border-t border-border-color">
          <p className="text-xs text-secondary">LockPe Admin v1.0</p>
        </div>
      )}
    </aside>
  )
}
