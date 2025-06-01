const mongoose = require('mongoose')
const User = require('../db/userModel')
require('dotenv').config()

async function createTestUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })

    console.log('Connected to MongoDB')

    // Create a test user
    const testUser = new User({
      first_name: 'Test',
      last_name: 'User',
      location: 'Test City',
      description: 'This is a test user',
      occupation: 'Tester',
      login_name: 'testuser'
    })

    await testUser.save()
    console.log('Test user created successfully:')
    console.log('Login name: testuser')
    console.log('User ID:', testUser._id)

    process.exit(0)
  } catch (error) {
    console.error('Error creating test user:', error)
    process.exit(1)
  }
}

createTestUser()
