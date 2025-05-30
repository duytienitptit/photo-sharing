const express = require('express')
const Photo = require('../db/photoModel')
const User = require('../db/userModel')
const router = express.Router()

// Get all comments by a specific user
router.get('/commentsOfUser/:userId', async (request, response) => {
  try {
    const userId = request.params.userId

    // Find all photos that contain comments from this user
    const photos = await Photo.find({
      'comments.user_id': userId
    }).select('_id file_name date_time user_id comments')

    // Extract all comments from this user with photo info
    const userComments = []

    for (const photo of photos) {
      // Manually fetch photo owner info
      let photoOwner = null
      if (photo.user_id) {
        photoOwner = await User.findById(photo.user_id).select('_id first_name last_name')
      }

      photo.comments.forEach(comment => {
        // Check if this comment belongs to the requested user
        if (comment.user_id && comment.user_id.toString() === userId) {
          userComments.push({
            _id: comment._id,
            comment: comment.comment,
            date_time: comment.date_time,
            photo: {
              _id: photo._id,
              file_name: photo.file_name,
              date_time: photo.date_time,
              owner: photoOwner
                ? {
                    _id: photoOwner._id,
                    first_name: photoOwner.first_name,
                    last_name: photoOwner.last_name
                  }
                : null
            }
          })
        }
      })
    }

    // Sort comments by date (newest first)
    userComments.sort((a, b) => new Date(b.date_time) - new Date(a.date_time))

    response.status(200).json(userComments)
  } catch (error) {
    console.error('Error fetching user comments:', error)
    if (error.name === 'CastError') {
      return response.status(400).json({ error: 'Invalid user ID format' })
    }
    response.status(500).json({ error: 'Internal server error' })
  }
})

// Add comment to a photo
router.post('/commentsOfPhoto/:photoId', async (request, response) => {
  try {
    const photoId = request.params.photoId
    const { comment, user_id } = request.body

    if (!comment || !user_id) {
      return response.status(400).json({ error: 'Comment and user_id are required' })
    }

    const photo = await Photo.findById(photoId)
    if (!photo) {
      return response.status(404).json({ error: 'Photo not found' })
    }

    // Add new comment
    photo.comments.push({
      comment: comment,
      user_id: user_id,
      date_time: new Date()
    })

    await photo.save()

    // Return the updated photo with populated comments
    const updatedPhoto = await Photo.findById(photoId)
      .populate({
        path: 'comments.user_id',
        select: '_id first last_name'
      })
      .select('_id file_name date_time user_id comments')

    response.status(201).json(updatedPhoto)
  } catch (error) {
    console.error('Error adding comment:', error)
    if (error.name === 'CastError') {
      return response.status(400).json({ error: 'Invalid photo ID format' })
    }
    response.status(500).json({ error: 'Internal server error' })
  }
})

module.exports = router
