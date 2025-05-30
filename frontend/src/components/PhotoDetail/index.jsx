import React, { useState, useEffect } from 'react'
import {
  Typography,
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
  Divider,
  TextField,
  Button
} from '@mui/material'
import { useParams, Link } from 'react-router-dom'

import './styles.css'
import photoService from '../../services/photoService'

/**
 * PhotoDetail component - displays a single photo with its comments
 */
function PhotoDetail() {
  const { photoId } = useParams()
  const [photo, setPhoto] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPhoto = async () => {
      try {
        setLoading(true)
        const photoData = await photoService.getPhotoById(photoId)
        setPhoto(photoData)
        setError(null)
      } catch (err) {
        setError('Failed to load photo. Please try again later.')
        console.error('Error loading photo:', err)
      } finally {
        setLoading(false)
      }
    }

    if (photoId) {
      fetchPhoto()
    }
  }, [photoId])

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

  if (!photo) {
    return (
      <Box padding={3}>
        <Alert severity='warning'>Photo not found</Alert>
      </Box>
    )
  }

  return (
    <Box padding={2}>
      <Card elevation={3}>
        {photo.file_name && (
          <CardMedia
            component='img'
            image={`/images/${photo.file_name}`}
            alt='Photo'
            sx={{ maxHeight: 600, objectFit: 'contain' }}
          />
        )}

        <CardContent>
          <Typography variant='body1' color='text.secondary' gutterBottom>
            Uploaded on {new Date(photo.date_time).toLocaleString()}
          </Typography>

          {photo.user_id && (
            <Typography variant='body2' gutterBottom>
              By{' '}
              <Link to={`/users/${photo.user_id._id}`}>
                {photo.user_id.first} {photo.user_id.last_name}
              </Link>
            </Typography>
          )}

          {photo.comments && photo.comments.length > 0 && (
            <Paper variant='outlined' sx={{ padding: 2, marginTop: 2 }}>
              <Typography variant='h6' gutterBottom>
                Comments ({photo.comments.length})
              </Typography>
              <List>
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
                            <Typography variant='body1' component='span'>
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
    </Box>
  )
}

export default PhotoDetail
