import React, { useState, useEffect } from 'react'
import { Typography, Paper, Box, CircularProgress, Alert, Button } from '@mui/material'
import { useParams, Link } from 'react-router-dom'

import './styles.css'
import userService from '../../services/userService'

/**
 * Define UserDetail, a React component of Project 4.
 */
function UserDetail() {
  const { userId } = useParams()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true)
        const userData = await userService.getUserById(userId)
        setUser(userData)
        setError(null)
      } catch (err) {
        setError('Failed to load user details. Please try again later.')
        console.error('Error loading user:', err)
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      fetchUser()
    }
  }, [userId])

  if (loading) {
    return (
      <Box display='flex' justifyContent='center' padding={3}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box padding={3}>
        <Alert severity='error'>{error}</Alert>
      </Box>
    )
  }

  if (!user) {
    return (
      <Box padding={3}>
        <Alert severity='warning'>User not found</Alert>
      </Box>
    )
  }

  return (
    <Paper elevation={3} sx={{ padding: 3, margin: 2 }}>
      <Typography variant='h4' gutterBottom>
        {user.first} {user.last_name}
      </Typography>

      <Box sx={{ marginTop: 2 }}>
        <Typography variant='body1' paragraph>
          <strong>Location:</strong> {user.location || 'Not specified'}
        </Typography>

        <Typography variant='body1' paragraph>
          <strong>Occupation:</strong> {user.occupation || 'Not specified'}
        </Typography>

        <Typography variant='body1' paragraph>
          <strong>Description:</strong> {user.description || 'No description available'}
        </Typography>
      </Box>

      <Box sx={{ marginTop: 3 }}>
        <Button
          component={Link}
          to={`/photos/${userId}`}
          variant='contained'
          color='primary'
          sx={{ marginRight: 2 }}
        >
          View Photos
        </Button>

        <Button component={Link} to={`/comments/${userId}`} variant='outlined' color='primary'>
          View All Comments
        </Button>
      </Box>
    </Paper>
  )
}

export default UserDetail
