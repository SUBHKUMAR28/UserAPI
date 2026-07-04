// import { Menu, Bell, Search, LogOut, User } from 'lucide-react'
// import { useAuth } from '../../context/AuthContext'
// import { useState } from 'react'

// export default function Navbar({ toggleSidebar }) {
//   const { user, logout } = useAuth()
//   const [dropOpen, setDropOpen] = useState(false)

//   return (
//     <header className="bg-white shadow-card px-6 py-3 flex items-center justify-between sticky top-0 z-20">
//       <div className="flex items-center gap-4">
//         <button onClick={toggleSidebar} className="text-text-main hover:text-primary transition-colors">
//           <Menu size={22} />
//         </button>
//         <div className="relative hidden md:flex items-center">
//           <Search size={16} className="absolute left-3 text-secondary" />
//           <input
//             type="text"
//             placeholder="Search..."
//             className="pl-9 pr-4 py-2 bg-bg-main border border-border-color rounded-lg text-sm focus:outline-none focus:border-primary w-64"
//           />
//         </div>
//       </div>

//       <div className="flex items-center gap-4">
//         <button className="relative text-text-main hover:text-primary transition-colors">
//           <Bell size={20} />
//           <span className="absolute -top-1 -right-1 w-4 h-4 bg-danger rounded-full text-white text-xs flex items-center justify-center">3</span>
//         </button>

//         <div className="relative">
//           <button onClick={() => setDropOpen(!dropOpen)} className="flex items-center gap-2">
//             <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center">
//               <User size={16} className="text-white" />
//             </div>
//             <div className="hidden md:block text-left">
//               <p className="text-sm font-semibold text-text-dark">{user?.full_name || 'Admin'}</p>
//               <p className="text-xs text-secondary">Admin</p>
//             </div>
//           </button>

//           {dropOpen && (
//             <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-card border border-border-color py-2 z-50">
//               <button
//                 onClick={logout}
//                 className="w-full flex items-center gap-2 px-4 py-2 text-sm text-danger hover:bg-danger/10 transition-colors"
//               >
//                 <LogOut size={16} />
//                 Logout
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </header>
//   )
// }

import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { Menu, Bell, Search, LogOut, User } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const socket = io('http://localhost:5000')

export default function Navbar({ toggleSidebar }) {
  const { user, logout } = useAuth()
  const [dropOpen, setDropOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [notifOpen, setNotifOpen] = useState(false)

  useEffect(() => {
    socket.emit('join_admin')

    socket.on('new_notification', (data) => {
      setNotifications(prev => [data, ...prev].slice(0, 20))
    })

    return () => {
      socket.off('new_notification')
    }
  }, [])

  const unreadCount = notifications.length

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

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative text-text-main hover:text-primary transition-colors"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-danger rounded-full text-white text-xs flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-card border border-border-color z-50 max-h-96 overflow-y-auto">
              <div className="px-4 py-3 border-b border-border-color flex items-center justify-between">
                <p className="font-semibold text-text-dark text-sm">Notifications</p>
                <button
                  onClick={() => setNotifications([])}
                  className="text-xs text-danger hover:underline"
                >
                  Clear all
                </button>
              </div>

              {notifications.length === 0 ? (
                <div className="flex flex-col items-center py-8 text-secondary">
                  <Bell size={28} className="mb-2 text-primary/30" />
                  <p className="text-sm">No notifications yet</p>
                </div>
              ) : (
                notifications.map((n, i) => (
                  <div key={i} className="px-4 py-3 border-b border-border-color hover:bg-bg-main transition-colors">
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold
                        ${n.type === 'kyc' ? 'bg-info/10 text-info' :
                          n.type === 'loan' ? 'bg-warning/10 text-warning' :
                          'bg-primary/10 text-primary'}`}>
                        {n.type === 'kyc' ? 'K' : n.type === 'loan' ? 'L' : 'P'}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-text-dark">{n.user_name}</p>
                        <p className="text-xs text-secondary mt-0.5">{n.message}</p>
                        <p className="text-xs text-secondary mt-1">
                          {new Date(n.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* User Profile */}
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