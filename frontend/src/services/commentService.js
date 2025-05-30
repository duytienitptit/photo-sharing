import API_URL from '../config/api'

const commentService = {
  // Get all comments by a specific user
  async getCommentsOfUser(userId) {
    try {
      const response = await fetch(`${API_URL}/comments/commentsOfUser/${userId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch user comments')
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching user comments:', error)
      throw error
    }
  },

  // Add comment to a photo
  async addCommentToPhoto(photoId, comment, userId) {
    try {
      const response = await fetch(`${API_URL}/comments/commentsOfPhoto/${photoId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          comment: comment,
          user_id: userId
        })
      })
      if (!response.ok) {
        throw new Error('Failed to add comment')
      }
      return await response.json()
    } catch (error) {
      console.error('Error adding comment:', error)
      throw error
    }
  }
}

export default commentService
