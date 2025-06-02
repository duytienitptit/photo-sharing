import axios from 'axios'
import API_URL from '../config/api'
import authService from './authService'

// Ensure the base URL is set
axios.defaults.baseURL = API_URL

const photoService = {
  // Get photo by ID
  async getPhotoById(photoId) {
    try {
      console.log(`Fetching photo with ID: ${photoId}`)

      // Ensure token is included in the request if user is authenticated
      const token = authService.getToken()
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {}

      const response = await axios.get(`/photos/${photoId}`, config)
      console.log('Photo data received:', response.data)
      return response.data
    } catch (error) {
      console.error('Error fetching photo:', error)
      throw error
    }
  },

  // Get all photos of a specific user
  async getPhotosOfUser(userId) {
    try {
      // Ensure token is included in the request if user is authenticated
      const token = authService.getToken()
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {}

      const response = await axios.get(`/photos/photosOfUser/${userId}`, config)
      return response.data
    } catch (error) {
      console.error('Error fetching photos:', error)
      throw error
    }
  },

  // Get all photos
  async getAllPhotos() {
    try {
      // Ensure token is included in the request if user is authenticated
      const token = authService.getToken()
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {}

      const response = await axios.get('/photos', config)
      return response.data
    } catch (error) {
      console.error('Error fetching all photos:', error)
      throw error
    }
  },

  // Create new photo
  async createPhoto(photoData) {
    try {
      // Ensure token is included in the request
      const token = authService.getToken()

      if (!token) {
        throw new Error('Authentication required to create a photo')
      }

      const config = { headers: { Authorization: `Bearer ${token}` } }
      const response = await axios.post('/photos', photoData, config)
      return response.data
    } catch (error) {
      console.error('Error creating photo:', error)
      throw error
    }
  },

  // Upload a photo
  async uploadPhoto(userId, file) {
    try {
      // Ensure token is included in the request
      const token = authService.getToken()

      if (!token) {
        throw new Error('Authentication required to upload a photo')
      }

      const formData = new FormData()
      formData.append('photo', file)
      formData.append('user_id', userId)

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      }

      const response = await axios.post('/photos/upload', formData, config)
      return response.data
    } catch (error) {
      console.error('Error uploading photo:', error)
      throw error
    }
  }
}

export default photoService
