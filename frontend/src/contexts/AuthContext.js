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

  // Function to check and refresh auth state from localStorage
  const refreshAuthState = () => {
    console.log('Refreshing auth state...')
    const currentUser = authService.getCurrentUser()
    const token = authService.getToken()

    console.log('Current auth state:', { currentUser, token })

    if (currentUser && token) {
      setUser(currentUser)
      setIsAuthenticated(true)
    } else {
      setUser(null)
      setIsAuthenticated(false)
    }
  }

  useEffect(() => {
    // Check if user is already logged in on app start
    refreshAuthState()
    setLoading(false)

    // Add event listener for storage changes to handle login/logout in other tabs
    window.addEventListener('storage', event => {
      if (event.key === 'token' || event.key === 'user') {
        refreshAuthState()
      }
    })

    return () => {
      window.removeEventListener('storage', () => {})
    }
  }, [])
  const login = async (loginName, password) => {
    const result = await authService.login(loginName, password)

    if (result.success) {
      setUser(result.user)
      setIsAuthenticated(true)
    }

    return result
  }

  const register = async userData => {
    return await authService.register(userData)
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
    logout,
    register,
    refreshAuthState
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContext
