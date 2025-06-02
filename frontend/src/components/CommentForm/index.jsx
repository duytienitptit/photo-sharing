import React, { useState, useEffect } from 'react'
import { Paper, Typography, TextField, Button, Box, CircularProgress, Alert, Snackbar } from '@mui/material'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import commentService from '../../services/commentService'
import './styles.css'

/**
 * CommentForm component - provides an interface for users to add comments to photos
 */
const CommentForm = ({ photoId, onCommentAdded }) => {
  const { isAuthenticated, user } = useAuth()
  const [comment, setComment] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  // Debug auth state
  useEffect(() => {
    console.log('Auth state in CommentForm:', { isAuthenticated, user })
    console.log('LocalStorage token:', localStorage.getItem('token'))
    console.log('LocalStorage user:', localStorage.getItem('user'))
  }, [isAuthenticated, user])

  const handleCommentSubmit = async e => {
    e.preventDefault()

    if (!comment.trim()) {
      setError('Comment cannot be empty')
      return
    }

    if (!isAuthenticated) {
      setError('You must be logged in to comment')
      return
    }

    try {
      setSubmitting(true)
      setError('')

      const updatedPhoto = await commentService.addCommentToPhoto(photoId, comment.trim())

      // Call the callback function to update parent component
      if (onCommentAdded && typeof onCommentAdded === 'function') {
        onCommentAdded(updatedPhoto)
      }

      // Reset form
      setComment('')
      setSuccess(true)
    } catch (err) {
      console.error('Error adding comment:', err)
      if (err.response?.status === 400) {
        setError('Comment cannot be empty')
      } else if (err.response?.status === 401) {
        setError('You must be logged in to comment')
      } else {
        setError('Failed to add comment. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      {isAuthenticated ? (
        <Paper variant='outlined' className='comment-form-container' sx={{ padding: 2 }}>
          <Typography variant='h6' gutterBottom>
            Add a Comment
          </Typography>
          {error && (
            <Alert severity='error' className='comment-alert' sx={{ marginBottom: 2 }}>
              {error}
            </Alert>
          )}
          <Box component='form' onSubmit={handleCommentSubmit} className='comment-form'>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder='Write your comment...'
              value={comment}
              onChange={e => setComment(e.target.value)}
              className='comment-input'
            />
            <Button
              type='submit'
              variant='contained'
              color='primary'
              disabled={submitting || !comment.trim()}
              className='comment-submit-button'
              sx={{ marginTop: 2 }}
            >
              {submitting ? <CircularProgress size={20} /> : 'Post Comment'}
            </Button>
          </Box>
        </Paper>
      ) : (
        <Paper variant='outlined' className='login-prompt' sx={{ padding: 2, textAlign: 'center' }}>
          <Typography color='text.secondary'>
            Please{' '}
            <Link to='/login-register' style={{ fontWeight: 'bold' }}>
              log in
            </Link>{' '}
            to add a comment.
          </Typography>
        </Paper>
      )}

      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => setSuccess(false)}
        message='Comment added successfully!'
      />
    </>
  )
}

export default CommentForm
