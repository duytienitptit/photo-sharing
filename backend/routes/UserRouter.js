const express = require('express')
const User = require('../db/userModel')
const router = express.Router()

// Get all users
router.get('/list', async (request, response) => {
  try {
    // Retrieve all users and select only necessary fields
    const users = await User.find({}).select('_id first last_name location description occupation')
    response.status(200).json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    response.status(500).json({ error: 'Internal server error' })
  }
})

// Update user by ID
router.post('/:id', async (request, response) => {
  try {
    const userId = request.params.id
    const updateData = request.body

    // Validate that user exists
    const user = await User.findById(userId)
    if (!user) {
      return response.status(404).json({ error: 'User not found' })
    }

    // Update only allowed fields
    const allowedFields = ['first', 'last_name', 'location', 'description', 'occupation']
    const updates = {}

    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        updates[field] = updateData[field]
      }
    })

    // Update user
    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true
    }).select('_id first last_name location description occupation')

    response.status(200).json(updatedUser)
  } catch (error) {
    console.error('Error updating user:', error)
    if (error.name === 'CastError') {
      return response.status(400).json({ error: 'Invalid user ID format' })
    }
    response.status(500).json({ error: 'Internal server error' })
  }
})

// Get user by ID
router.get('/:id', async (request, response) => {
  try {
    const userId = request.params.id

    // Find user by ID
    const user = await User.findById(userId).select('_id first last_name location description occupation')

    if (!user) {
      return response.status(404).json({ error: 'User not found' })
    }

    response.status(200).json(user)
  } catch (error) {
    console.error('Error fetching user:', error)
    if (error.name === 'CastError') {
      return response.status(400).json({ error: 'Invalid user ID format' })
    }
    response.status(500).json({ error: 'Internal server error' })
  }
})

module.exports = router
