import { Menu, Bell, Search, LogOut, User } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useState } from 'react'

export default function Navbar({ toggleSidebar }) {
  const { user, logout } = useAuth()
  const [dropOpen, setDropOpen] = useState(false)

  return (
    <header className="bg-white shadow-card px-6 py-3 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="text-text-main hover:text-primary transition-colors">
          <Menu size={22} />
        </button>
        <div className="relative hidden md:flex items-center">
          <Search size={16} className="absolute left-3 text-secondary" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-9 pr-4 py-2 bg-bg-main border border-border-color rounded-lg text-sm focus:outline-none focus:border-primary w-64"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative text-text-main hover:text-primary transition-colors">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-danger rounded-full text-white text-xs flex items-center justify-center">3</span>
        </button>

        <div className="relative">
          <button onClick={() => setDropOpen(!dropOpen)} className="flex items-center gap-2">
            <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center">
              <User size={16} className="text-white" />
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-semibold text-text-dark">{user?.full_name || 'Admin'}</p>
              <p className="text-xs text-secondary">Admin</p>
            </div>
          </button>

          {dropOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-card border border-border-color py-2 z-50">
              <button
                onClick={logout}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-danger hover:bg-danger/10 transition-colors"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
