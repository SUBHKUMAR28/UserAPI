import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Layout from './components/layout/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Users from './pages/Users'
import KYC from './pages/KYC'
import Loans from './pages/Loans'
import EMI from './pages/EMI'
import Wallet from './pages/Wallet'
import Transactions from './pages/Transactions'
import Products from './pages/Products'
import Orders from './pages/Orders'
import Banners from './pages/Banners'
import Offers from './pages/Offers'
import Rewards from './pages/Rewards'
import Notifications from './pages/Notifications'
import Support from './pages/Support'
import Categories from './pages/Categories'

function ProtectedRoute({ children }) {
  // const { user, loading } = useAuth()
  // if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" /></div>
  // if (!user) return <Navigate to="/login" replace />
  return children
}

function AppRoutes() {
  const { user } = useAuth()
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="kyc" element={<KYC />} />
        <Route path="loans" element={<Loans />} />
        <Route path="emi" element={<EMI />} />
        <Route path="wallet" element={<Wallet />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="products" element={<Products />} />
        <Route path="categories" element={<Categories />} />
        <Route path="orders" element={<Orders />} />
        <Route path="banners" element={<Banners />} />
        <Route path="offers" element={<Offers />} />
        <Route path="rewards" element={<Rewards />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="support" element={<Support />} />
      </Route>
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}