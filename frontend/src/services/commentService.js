import axios from 'axios'

const commentService = {
  // Get all comments by a specific user
  async getCommentsOfUser(userId) {
    try {
      const response = await axios.get(`/comments/commentsOfUser/${userId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching user comments:', error)
      throw error
    }
  },

  // Add comment to a photo
  async addCommentToPhoto(photoId, comment, userId) {
    try {
      const response = await axios.post(`/comments/commentsOfPhoto/${photoId}`, {
        comment: comment,
        user_id: userId
      })
      return response.data
    } catch (error) {
      console.error('Error adding comment:', error)
      throw error
    }
  }
}

export default commentService
