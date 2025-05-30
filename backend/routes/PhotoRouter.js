const express = require('express')
const Photo = require('../db/photoModel')
const router = express.Router()

router.post('/', async (request, response) => {})

router.get('/', async (request, response) => {})

// Get photo by ID
router.get('/:id', async (request, response) => {
  try {
    const photoId = request.params.id

    const photo = await Photo.findById(photoId)
      .populate({
        path: 'comments.user_id',
        select: '_id first last_name'
      })
      .populate({
        path: 'user_id',
        select: '_id first last_name'
      })
      .select('_id file_name date_time user_id comments')

    if (!photo) {
      return response.status(404).json({ error: 'Photo not found' })
    }

    // Transform the data to include full user info in comments
    const photoObj = photo.toObject()

    // Transform comments to include user info
    if (photoObj.comments && photoObj.comments.length > 0) {
      photoObj.comments = photoObj.comments.map(comment => ({
        _id: comment._id,
        comment: comment.comment,
        date_time: comment.date_time,
        user: comment.user_id
          ? {
              _id: comment.user_id._id,
              first: comment.user_id.first,
              last_name: comment.user_id.last_name
            }
          : null
      }))
    }

    response.status(200).json(photoObj)
  } catch (error) {
    console.error('Error fetching photo:', error)
    if (error.name === 'CastError') {
      return response.status(400).json({ error: 'Invalid photo ID format' })
    }
    response.status(500).json({ error: 'Internal server error' })
  }
})

// Get all photos of a specific user
router.get('/photosOfUser/:id', async (request, response) => {
  try {
    const userId = request.params.id

    // Find all photos belonging to the user
    // Populate user information for each comment
    const photos = await Photo.find({ user_id: userId })
      .populate({
        path: 'comments.user_id',
        select: '_id first last_name'
      })
      .select('_id file_name date_time user_id comments')
      .sort({ date_time: -1 }) // Sort by newest first

    // Transform the data to include full user info in comments
    const photosWithComments = photos.map(photo => {
      const photoObj = photo.toObject()

      // Transform comments to include user info
      if (photoObj.comments && photoObj.comments.length > 0) {
        photoObj.comments = photoObj.comments.map(comment => ({
          _id: comment._id,
          comment: comment.comment,
          date_time: comment.date_time,
          user: comment.user_id
            ? {
                _id: comment.user_id._id,
                first: comment.user_id.first,
                last_name: comment.user_id.last_name
              }
            : null
        }))
      }

      return photoObj
    })

    response.status(200).json(photosWithComments)
  } catch (error) {
    console.error('Error fetching photos of user:', error)
    if (error.name === 'CastError') {
      return response.status(400).json({ error: 'Invalid user ID format' })
    }
    response.status(500).json({ error: 'Internal server error' })
  }
})

module.exports = router
