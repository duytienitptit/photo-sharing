const jwt = require('jsonwebtoken')

// Use a secret key from environment variable or fallback to a default (for dev only)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized - No token provided' })
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized - Invalid token' })
    }
    req.user = user
    next()
  })
}

// Function to generate JWT token
const generateToken = user => {
  return jwt.sign(
    {
      id: user._id,
      login_name: user.login_name
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  )
}

module.exports = {
  authenticateToken,
  generateToken,
  JWT_SECRET
}
