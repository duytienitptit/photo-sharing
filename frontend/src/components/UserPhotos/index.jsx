import React, { useState, useEffect } from 'react'
import {
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CircularProgress,
  Alert,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material'
import { useParams, Link } from 'react-router-dom'

import './styles.css'
import photoService from '../../services/photoService'
import userService from '../../services/userService'
import API_URL from '../../config/api'

/**
 * Define UserPhotos, a React component of Project 4.
 */
function UserPhotos() {
  const { userId } = useParams()
  const [photos, setPhotos] = useState([])
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch both user info and photos in parallel
        const [userData, photosData] = await Promise.all([
          userService.getUserById(userId),
          photoService.getPhotosOfUser(userId)
        ])

        setUser(userData)
        setPhotos(photosData)
        setError(null)
      } catch (err) {
        setError('Failed to load photos. Please try again later.')
        console.error('Error loading data:', err)
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      fetchData()
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

  if (!photos || photos.length === 0) {
    return (
      <Box padding={3}>
        <Alert severity='info'>
          {user ? `${user.first} ${user.last_name} has no photos yet.` : 'No photos found.'}
        </Alert>
      </Box>
    )
  }

  return (
    <Box padding={2}>
      <Typography variant='h4' gutterBottom>
        Photos of {user?.first} {user?.last_name}
      </Typography>

      <Grid container spacing={3}>
        {photos.map(photo => (
          <Grid item xs={12} md={6} lg={4} key={photo._id}>
            <Card elevation={3}>
              {' '}
              {photo.file_name && (
                <CardMedia
                  component='img'
                  height='300'
                  image={`${API_URL}/images/${photo.file_name}`}
                  alt={`Photo by ${user?.first} ${user?.last_name}`}
                  sx={{ objectFit: 'cover' }}
                />
              )}
              <CardContent>
                <Typography variant='body2' color='text.secondary' gutterBottom>
                  {new Date(photo.date_time).toLocaleString()}
                </Typography>

                {photo.comments && photo.comments.length > 0 && (
                  <Paper variant='outlined' sx={{ padding: 1, marginTop: 1 }}>
                    <Typography variant='subtitle2' gutterBottom>
                      Comments ({photo.comments.length})
                    </Typography>
                    <List dense>
                      {photo.comments.map((comment, index) => (
                        <React.Fragment key={comment._id}>
                          {index > 0 && <Divider />}
                          <ListItem alignItems='flex-start'>
                            <ListItemText
                              primary={
                                <Typography
                                  component={Link}
                                  to={`/users/${comment.user?._id}`}
                                  variant='body2'
                                  sx={{
                                    textDecoration: 'none',
                                    color: 'primary.main',
                                    fontWeight: 'bold'
                                  }}
                                >
                                  {comment.user?.first} {comment.user?.last_name}
                                </Typography>
                              }
                              secondary={
                                <>
                                  <Typography variant='body2' component='span'>
                                    {comment.comment}
                                  </Typography>
                                  <Typography variant='caption' display='block' color='text.secondary'>
                                    {new Date(comment.date_time).toLocaleString()}
                                  </Typography>
                                </>
                              }
                            />
                          </ListItem>
                        </React.Fragment>
                      ))}
                    </List>
                  </Paper>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default UserPhotos
