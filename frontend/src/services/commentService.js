import axios from 'axios'
import API_URL from '../config/api'
import authService from './authService'

// Ensure the base URL is set
axios.defaults.baseURL = API_URL

const commentService = {
  // Get all comments by a specific user
  async getCommentsOfUser(userId) {
    try {
      // Ensure token is included in the request
      const token = authService.getToken()
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {}

      const response = await axios.get(`/comments/commentsOfUser/${userId}`, config)
      return response.data
    } catch (error) {
      console.error('Error fetching user comments:', error)
      throw error
    }
  },
  // Add comment to a photo
  async addCommentToPhoto(photoId, comment) {
    try {
      console.log('commentService.addCommentToPhoto called with:', { photoId, comment })

      // Ensure token is included in the request
      const token = authService.getToken()
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {}

      const response = await axios.post(
        `/comments/commentsOfPhoto/${photoId}`,
        {
          comment: comment
        },
        config
      )

      console.log('commentService response:', response.data)
      return response.data
    } catch (error) {
      console.error('Error adding comment:', error)
      throw error
    }
  }
}

export default commentService
