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
  async login(loginName, password) {
    try {
      const response = await axios.post('users/admin/login', {
        login_name: loginName,
        password: password
      })

      const { user, token } = response.data

      // Store token and user data
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))

      // Set token in axios default headers
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

      console.log('Login successful:', { user, token: token.substring(0, 10) + '...' })
      return { success: true, user, token }
    } catch (error) {
      console.error('Login error:', error)
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
      // Remove token from axios headers
      delete axios.defaults.headers.common['Authorization']
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
    const token = this.getToken()
    console.log('Checking authentication:', !!token)
    return !!token
  }
  async register(userData) {
    try {
      const response = await axios.post('users/user', userData)
      return { success: true, data: response.data }
    } catch (error) {
      console.error('Registration error:', error)
      const errorMessage = error.response?.data?.error || 'Registration failed'
      return { success: false, error: errorMessage }
    }
  }
}

const authService = new AuthService()
export default authService
