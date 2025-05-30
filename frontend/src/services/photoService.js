import API_URL from '../config/api'

const photoService = {
  // Get photo by ID
  async getPhotoById(photoId) {
    try {
      const response = await fetch(`${API_URL}/photos/${photoId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch photo')
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching photo:', error)
      throw error
    }
  },

  // Get all photos of a specific user
  async getPhotosOfUser(userId) {
    try {
      const response = await fetch(`${API_URL}/photos/photosOfUser/${userId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch photos')
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching photos:', error)
      throw error
    }
  },

  // Get all photos
  async getAllPhotos() {
    try {
      const response = await fetch(`${API_URL}/photos`)
      if (!response.ok) {
        throw new Error('Failed to fetch all photos')
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching all photos:', error)
      throw error
    }
  },

  // Create new photo
  async createPhoto(photoData) {
    try {
      const response = await fetch(`${API_URL}/photos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(photoData)
      })
      if (!response.ok) {
        throw new Error('Failed to create photo')
      }
      return await response.json()
    } catch (error) {
      console.error('Error creating photo:', error)
      throw error
    }
  }
}

export default photoService
