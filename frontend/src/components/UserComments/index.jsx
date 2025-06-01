import React, { useState, useEffect } from 'react'
import {
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActionArea,
  CircularProgress,
  Alert,
  Box,
  Chip
} from '@mui/material'
import { useParams, Link, useNavigate } from 'react-router-dom'

import './styles.css'
import commentService from '../../services/commentService'
import userService from '../../services/userService'

/**
 * UserComments component - displays all comments made by a specific user
 */
function UserComments() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const [comments, setComments] = useState([])
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch both user info and comments in parallel
        const [userData, commentsData] = await Promise.all([
          userService.getUserById(userId),
          commentService.getCommentsOfUser(userId)
        ])

        setUser(userData)
        setComments(commentsData)
        setError(null)
      } catch (err) {
        setError('Failed to load comments. Please try again later.')
        console.error('Error loading data:', err)
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      fetchData()
    }
  }, [userId])

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

  if (!comments || comments.length === 0) {
    return (
      <Box padding={3}>
        <Alert severity='info'>
          {user ? `${user.first} ${user.last_name} has not made any comments yet.` : 'No comments found.'}
        </Alert>
      </Box>
    )
  }

  return (
    <Box padding={2}>
      <Typography variant='h4' gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        💬 Comments by {user?.first} {user?.last_name}
      </Typography>

      <Typography variant='body2' color='text.secondary' gutterBottom>
        Total comments: {comments.length}
      </Typography>

      <Grid container spacing={3} sx={{ marginTop: 1 }}>
        {comments.map(comment => (
          <Grid item xs={12} sm={6} md={4} key={comment._id}>
            <Card elevation={3}>
              <CardActionArea onClick={() => handlePhotoClick(comment.photo._id)}>
                {comment.photo.file_name && (
                  <CardMedia
                    component='img'
                    height='200'
                    image={`/images/${comment.photo.file_name}`}
                    alt='Photo containing comment'
                    sx={{ objectFit: 'cover' }}
                  />
                )}

                <CardContent>
                  <Typography variant='body1' gutterBottom>
                    "{comment.comment}"
                  </Typography>

                  <Typography variant='caption' color='text.secondary' display='block'>
                    {new Date(comment.date_time).toLocaleString()}
                  </Typography>

                  {comment.photo.owner && (
                    <Box sx={{ marginTop: 1 }}>
                      <Chip
                        label={`Photo by ${comment.photo.owner.first_name} ${comment.photo.owner.last_name}`}
                        size='small'
                        component={Link}
                        to={`/users/${comment.photo.owner._id}`}
                        clickable
                        onClick={e => e.stopPropagation()}
                        sx={{ textDecoration: 'none' }}
                      />
                    </Box>
                  )}
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default UserComments
