import React, { createContext, useContext, useState, useEffect } from 'react'
import authService from '../services/authService'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in on app start
    const currentUser = authService.getCurrentUser()
    const token = authService.getToken()

    if (currentUser && token) {
      setUser(currentUser)
      setIsAuthenticated(true)
    }

    setLoading(false)
  }, [])

  const login = async loginName => {
    const result = await authService.login(loginName)

    if (result.success) {
      setUser(result.user)
      setIsAuthenticated(true)
    }

    return result
  }

  const logout = async () => {
    await authService.logout()
    setUser(null)
    setIsAuthenticated(false)
  }

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContext
