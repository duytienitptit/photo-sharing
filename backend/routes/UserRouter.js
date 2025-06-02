const express = require('express')
const User = require('../db/userModel')
const { authenticateToken, generateToken } = require('../middleware/auth')
const router = express.Router()

// Registration endpoint - NO authentication required
router.post('/user', async (request, response) => {
  try {
    const { login_name, password, first_name, last_name, location, description, occupation } = request.body

    // Validate required fields
    if (!login_name) {
      return response.status(400).json({ error: 'Login name is required' })
    }
    if (!password) {
      return response.status(400).json({ error: 'Password is required' })
    }
    if (!first_name) {
      return response.status(400).json({ error: 'First name is required' })
    }
    if (!last_name) {
      return response.status(400).json({ error: 'Last name is required' })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ login_name })
    if (existingUser) {
      return response.status(400).json({ error: 'User with this login name already exists' })
    }

    // Create new user
    const newUser = new User({
      login_name,
      password,
      first_name,
      last_name,
      location,
      description,
      occupation
    })

    // Save user
    await newUser.save()

    // Return success without sensitive information
    response.status(201).json({
      user: {
        _id: newUser._id,
        login_name: newUser.login_name,
        first_name: newUser.first_name,
        last_name: newUser.last_name
      }
    })
  } catch (error) {
    console.error('Error during registration:', error)
    response.status(500).json({ error: 'Internal server error' })
  }
})

// Login endpoint - NO authentication required
router.post('/admin/login', async (request, response) => {
  try {
    const { login_name, password } = request.body

    if (!login_name || !password) {
      return response.status(400).json({ error: 'Login name and password are required' })
    }

    // Find user by login_name
    const user = await User.findOne({ login_name })

    if (!user) {
      return response.status(400).json({ error: 'Invalid login credentials' })
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      return response.status(400).json({ error: 'Invalid login credentials' })
    }

    // Generate JWT token
    const token = generateToken(user)

    // Return user info with token
    response.status(200).json({
      user: {
        _id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        location: user.location,
        description: user.description,
        occupation: user.occupation,
        login_name: user.login_name
      },
      token
    })
  } catch (error) {
    console.error('Error during login:', error)
    response.status(500).json({ error: 'Internal server error' })
  }
})

// Logout endpoint - authentication required
router.post('/admin/logout', authenticateToken, async (request, response) => {
  try {
    // With JWT, logout is typically handled client-side by removing the token
    // But we can acknowledge the logout here
    response.status(200).json({ message: 'Logged out successfully' })
  } catch (error) {
    console.error('Error during logout:', error)
    response.status(500).json({ error: 'Internal server error' })
  }
})

// Get all users - authentication required
router.get('/list', authenticateToken, async (request, response) => {
  try {
    // Retrieve all users and select only necessary fields
    const users = await User.find({}).select('_id first_name last_name location description occupation')
    response.status(200).json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    response.status(500).json({ error: 'Internal server error' })
  }
})

// Update user by ID - authentication required
router.post('/:id', authenticateToken, async (request, response) => {
  try {
    const userId = request.params.id
    const updateData = request.body

    // Validate that user exists
    const user = await User.findById(userId)
    if (!user) {
      return response.status(404).json({ error: 'User not found' })
    }

    // Update only allowed fields
    const allowedFields = ['first_name', 'last_name', 'location', 'description', 'occupation']
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
    }).select('_id first_name last_name location description occupation')

    response.status(200).json(updatedUser)
  } catch (error) {
    console.error('Error updating user:', error)
    if (error.name === 'CastError') {
      return response.status(400).json({ error: 'Invalid user ID format' })
    }
    response.status(500).json({ error: 'Internal server error' })
  }
})

// Get user by ID - authentication required
router.get('/:id', authenticateToken, async (request, response) => {
  try {
    const userId = request.params.id

    // Find user by ID
    const user = await User.findById(userId).select(
      '_id first_name last_name location description occupation'
    )

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
