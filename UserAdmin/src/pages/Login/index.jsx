// import { useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { useAuth } from '../../context/AuthContext'
// import { Eye, EyeOff, Lock } from 'lucide-react'

// export default function Login() {
//   const { login } = useAuth()
//   const navigate = useNavigate()
//   const [form, setForm] = useState({ email: '', password: '' })
//   const [showPass, setShowPass] = useState(false)
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState('')

//   const handleSubmit = async () => {
//     setLoading(true)
//     setError('')
//     try {
//       await login(form.email, form.password)
//       navigate('/')
//     } catch (e) {
//       setError(e.response?.data?.message || 'Login failed')
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="min-h-screen bg-bg-main flex items-center justify-center p-4">
//       <div className="w-full max-w-md">
//         {/* Logo */}
//         <div className="text-center mb-8">
//           <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-card">
//             <Lock size={26} className="text-white" />
//           </div>
//           <h1 className="text-2xl font-bold text-text-dark">LockPe Admin</h1>
//           <p className="text-secondary text-sm mt-1">Sign in to your admin account</p>
//         </div>

//         {/* Card */}
//         <div className="card">
//           {error && (
//             <div className="bg-danger/10 text-danger text-sm px-4 py-3 rounded-lg mb-4">
//               {error}
//             </div>
//           )}
//           <div className="space-y-4">
//             <div>
//               <label className="text-xs font-medium text-secondary mb-1 block">Email</label>
//               <input
//                 type="email"
//                 placeholder="admin@lockpe.com"
//                 value={form.email}
//                 onChange={e => setForm({ ...form, email: e.target.value })}
//                 className="w-full border border-border-color rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition"
//               />
//             </div>
//             <div>
//               <label className="text-xs font-medium text-secondary mb-1 block">Password</label>
//               <div className="relative">
//                 <input
//                   type={showPass ? 'text' : 'password'}
//                   placeholder="••••••••"
//                   value={form.password}
//                   onChange={e => setForm({ ...form, password: e.target.value })}
//                   onKeyDown={e => e.key === 'Enter' && handleSubmit()}
//                   className="w-full border border-border-color rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition pr-10"
//                 />
//                 <button onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-primary">
//                   {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
//                 </button>
//               </div>
//             </div>
//             <button
//               onClick={handleSubmit}
//               disabled={loading}
//               className="w-full bg-primary text-white py-2.5 rounded-lg font-medium text-sm hover:bg-primary-dark transition disabled:opacity-60"
//             >
//               {loading ? 'Signing in...' : 'Sign In'}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Eye, EyeOff, Lock } from 'lucide-react'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ identifier: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    try {
      // Email hai ya phone — auto detect
      const isEmail = form.identifier.includes('@')
      const payload = isEmail
        ? { email: form.identifier, password: form.password }
        : { phone: form.identifier, password: form.password }

      await login(payload)
      navigate('/')
    } catch (e) {
      setError(e.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg-main flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-card">
            <Lock size={26} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-text-dark">LockPe Admin</h1>
          <p className="text-secondary text-sm mt-1">Sign in to your admin account</p>
        </div>

        {/* Card */}
        <div className="card">
          {error && (
            <div className="bg-danger/10 text-danger text-sm px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-secondary mb-1 block">
                Email or Phone
              </label>
              <input
                type="text"
                placeholder="admin@lockpe.com or 9876543210"
                value={form.identifier}
                onChange={e => setForm({ ...form, identifier: e.target.value })}
                className="w-full border border-border-color rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-secondary mb-1 block">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                  className="w-full border border-border-color rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition pr-10"
                />
                <button
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-primary"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-primary text-white py-2.5 rounded-lg font-medium text-sm hover:bg-primary-dark transition disabled:opacity-60"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}