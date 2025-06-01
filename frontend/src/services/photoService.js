import axios from 'axios'

const photoService = {
  // Get photo by ID
  async getPhotoById(photoId) {
    try {
      const response = await axios.get(`/photos/${photoId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching photo:', error)
      throw error
    }
  },

  // Get all photos of a specific user
  async getPhotosOfUser(userId) {
    try {
      const response = await axios.get(`/photos/photosOfUser/${userId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching photos:', error)
      throw error
    }
  },

  // Get all photos
  async getAllPhotos() {
    try {
      const response = await axios.get('/photos')
      return response.data
    } catch (error) {
      console.error('Error fetching all photos:', error)
      throw error
    }
  },

  // Create new photo
  async createPhoto(photoData) {
    try {
      const response = await axios.post('/photos', photoData)
      return response.data
    } catch (error) {
      console.error('Error creating photo:', error)
      throw error
    }
  }
}

export default photoService
