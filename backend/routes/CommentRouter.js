const express = require('express')
const Photo = require('../db/photoModel')
const User = require('../db/userModel')
const Comment = require('../db/commentModel')
const { authenticateToken } = require('../middleware/auth')
const router = express.Router()

// Get all comments by a specific user
router.get('/commentsOfUser/:userId', async (request, response) => {
  try {
    const userId = request.params.userId

    // Find all comments from this user
    const comments = await Comment.find({ user_id: userId })
      .sort({ date_time: -1 }) // Sort by date (newest first)
      .lean()

    // Create an array to store the processed comments
    const userComments = []

    // Process each comment to include photo info
    for (const comment of comments) {
      // Get photo information
      const photo = await Photo.findById(comment.photo_id).lean()

      if (!photo) {
        continue // Skip if photo not found
      }

      // Get photo owner information
      let photoOwner = null
      if (photo.user_id) {
        photoOwner = await User.findById(photo.user_id).select('_id first_name last_name').lean()
      }

      // Add processed comment to results
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
router.post('/commentsOfPhoto/:photoId', authenticateToken, async (request, response) => {
  try {
    const photoId = request.params.photoId
    const { comment } = request.body

    // Validate comment content
    if (!comment || comment.trim() === '') {
      return response.status(400).json({ error: 'Comment cannot be empty' })
    }

    // Get user_id from authenticated user
    const user_id = request.user.id

    // Check if the photo exists
    const photo = await Photo.findById(photoId)
    if (!photo) {
      return response.status(404).json({ error: 'Photo not found' })
    }

    // Create new comment
    const newComment = new Comment({
      comment: comment.trim(),
      user_id: user_id,
      photo_id: photoId,
      date_time: new Date()
    })

    // Save the comment
    await newComment.save()

    // Get all comments for this photo with user info
    const comments = await Comment.find({ photo_id: photoId })
      .populate('user_id', '_id first_name last_name')
      .sort({ date_time: 1 }) // Sort by date (oldest first)
      .lean()

    // Return the photo with its comments
    const photoWithComments = {
      _id: photo._id,
      file_name: photo.file_name,
      date_time: photo.date_time,
      user_id: photo.user_id,
      comments: comments
    }

    response.status(201).json(photoWithComments)
  } catch (error) {
    console.error('Error adding comment:', error)
    if (error.name === 'CastError') {
      return response.status(400).json({ error: 'Invalid photo ID format' })
    }
    response.status(500).json({ error: 'Internal server error' })
  }
})

// Get all comments for a specific photo
router.get('/commentsOfPhoto/:photoId', async (request, response) => {
  try {
    const photoId = request.params.photoId

    // Check if the photo exists
    const photo = await Photo.findById(photoId)
    if (!photo) {
      return response.status(404).json({ error: 'Photo not found' })
    }

    // Get all comments for this photo with user info
    const comments = await Comment.find({ photo_id: photoId })
      .populate('user_id', '_id first_name last_name')
      .sort({ date_time: 1 }) // Sort by date (oldest first)
      .lean()

    response.status(200).json(comments)
  } catch (error) {
    console.error('Error fetching photo comments:', error)
    if (error.name === 'CastError') {
      return response.status(400).json({ error: 'Invalid photo ID format' })
    }
    response.status(500).json({ error: 'Internal server error' })
  }
})

module.exports = router
