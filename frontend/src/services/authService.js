import axios from 'axios'
import API_URL from '../config/api'

// Configure axios defaults
axios.defaults.baseURL = API_URL
axios.defaults.headers.common['Content-Type'] = 'application/json'

// Request interceptor to add token to all requests
axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle token expiration
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Token expired or invalid, clear storage and redirect to login
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

class AuthService {
  async login(loginName) {
    try {
      const response = await axios.post('users/admin/login', {
        login_name: loginName
      })

      const { user, token } = response.data

      // Store token and user data
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))

      return { success: true, user, token }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Login failed'
      return { success: false, error: errorMessage }
    }
  }

  async logout() {
    try {
      await axios.post('users/admin/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Always clear local storage regardless of API response
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  }

  getCurrentUser() {
    try {
      const userStr = localStorage.getItem('user')
      return userStr ? JSON.parse(userStr) : null
    } catch (error) {
      console.error('Error parsing user data:', error)
      localStorage.removeItem('user')
      return null
    }
  }

  getToken() {
    return localStorage.getItem('token')
  }

  isAuthenticated() {
    return !!this.getToken()
  }
}

const authService = new AuthService()
export default authService
