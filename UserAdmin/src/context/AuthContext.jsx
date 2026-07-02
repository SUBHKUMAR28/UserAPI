import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../api/services'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    if (token && userData) {
      setUser(JSON.parse(userData))
    }
    setLoading(false)
  }, [])

  // const login = async (email, password) => {
  //   const res = await authAPI.login({ email, password })
  //   const { access_token, profile } = res.data.data
  //   localStorage.setItem('token', access_token)
  //   localStorage.setItem('user', JSON.stringify(profile))
  //   setUser(profile)
  //   return profile
  // }
  const login = async (payload) => {
  const res = await authAPI.login(payload)
  const { access_token, profile } = res.data.data
  localStorage.setItem('token', access_token)
  localStorage.setItem('user', JSON.stringify(profile))
  setUser(profile)
  return profile
 }

  const logout = () => {
    localStorage.clear()
    setUser(null)
    window.location.href = '/login'
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
