import axios from 'axios'

const userService = {
  // Get all users
  async getUserList() {
    try {
      const response = await axios.get('/users/list')
      return response.data
    } catch (error) {
      console.error('Error fetching users:', error)
      throw error
    }
  },

  // Get user by ID
  async getUserById(userId) {
    try {
      const response = await axios.get(`/users/${userId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching user:', error)
      throw error
    }
  },

  // Update user
  async updateUser(userId, userData) {
    try {
      const response = await axios.post(`/users/${userId}`, userData)
      return response.data
    } catch (error) {
      console.error('Error updating user:', error)
      throw error
    }
  }
}

export default userService
