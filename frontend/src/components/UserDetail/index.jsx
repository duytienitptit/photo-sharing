import React, { useState, useEffect } from 'react'
import {
  Typography,
  Paper,
  Box,
  CircularProgress,
  Alert,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent
} from '@mui/material'
import { useParams, Link, useNavigate } from 'react-router-dom'

import './styles.css'
import userService from '../../services/userService'
import photoService from '../../services/photoService'

/**
 * Define UserDetail, a React component of Project 4.
 */
function UserDetail() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchUserAndPhotos = async () => {
      try {
        setLoading(true)
        // Fetch both user info and photos in parallel
        const [userData, photosData] = await Promise.all([
          userService.getUserById(userId),
          photoService.getPhotosOfUser(userId)
        ])

        setUser(userData)
        // Get only the first 3 photos to display as preview
        setPhotos(photosData.slice(0, 3))
        setError(null)
      } catch (err) {
        setError('Failed to load user details. Please try again later.')
        console.error('Error loading user:', err)
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      fetchUserAndPhotos()
    }
  }, [userId])

  // Handle click on photo to navigate to photo detail page
  const handlePhotoClick = photoId => {
    navigate(`/photo/${photoId}`)
  }

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

      {/* Display user photos */}
      {photos.length > 0 && (
        <Box sx={{ marginTop: 3 }}>
          <Typography variant='h6' gutterBottom>
            Recent Photos
          </Typography>
          <Grid container spacing={2}>
            {photos.map(photo => (
              <Grid item xs={12} sm={4} key={photo._id}>
                <Card
                  elevation={2}
                  onClick={() => handlePhotoClick(photo._id)}
                  sx={{
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'scale(1.03)',
                      boxShadow: 3
                    }
                  }}
                >
                  {photo.file_name && (
                    <CardMedia
                      component='img'
                      height='180'
                      image={`/images/${photo.file_name}`}
                      alt={`Photo by ${user.first} ${user.last_name}`}
                      sx={{ objectFit: 'cover' }}
                    />
                  )}
                  <CardContent sx={{ padding: 1 }}>
                    <Typography variant='caption' color='text.secondary'>
                      {new Date(photo.date_time).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      <Box sx={{ marginTop: 3 }}>
        <Button
          component={Link}
          to={`/photos/${userId}`}
          variant='contained'
          color='primary'
          sx={{ marginRight: 2 }}
        >
          View All Photos
        </Button>

        <Button component={Link} to={`/comments/${userId}`} variant='outlined' color='primary'>
          View All Comments
        </Button>
      </Box>
    </Paper>
  )
}

export default UserDetail
