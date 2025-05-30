import API_URL from '../config/api'

const userService = {
  // Get all users
  async getUserList() {
    try {
      const response = await fetch(`${API_URL}/users/list`)
      if (!response.ok) {
        throw new Error('Failed to fetch users')
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching users:', error)
      throw error
    }
  },

  // Get user by ID
  async getUserById(userId) {
    try {
      const response = await fetch(`${API_URL}/users/${userId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch user')
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching user:', error)
      throw error
    }
  },

  // Update user
  async updateUser(userId, userData) {
    try {
      const response = await fetch(`${API_URL}/users/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      })
      if (!response.ok) {
        throw new Error('Failed to update user')
      }
      return await response.json()
    } catch (error) {
      console.error('Error updating user:', error)
      throw error
    }
  }
}

export default userService
