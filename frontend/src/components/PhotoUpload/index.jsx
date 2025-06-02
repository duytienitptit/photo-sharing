import React, { useState } from 'react'
import { Button, Typography, Box, Paper, CircularProgress, Alert } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import photoService from '../../services/photoService'
import './styles.css'

function PhotoUpload() {
  const [file, setFile] = useState(null)
  const [fileName, setFileName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const navigate = useNavigate()
  const { user } = useAuth()

  const handleFileChange = e => {
    const selectedFile = e.target.files[0]
    setFile(selectedFile)
    setFileName(selectedFile?.name || '')
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!file) {
      setError('Please select a file to upload')
      return
    }
    try {
      setLoading(true)
      setError('')
      // Upload the photo using the photoService
      await photoService.uploadPhoto(user._id, file)

      setSuccess('Photo uploaded successfully!')
      // Navigate to the user's photos page after a short delay
      setTimeout(() => {
        navigate(`/photos/${user._id}`)
      }, 1500)
    } catch (err) {
      setError(err.message || 'Failed to upload photo')
      console.error('Upload error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box className='photo-upload-container'>
      <Typography variant='h4' gutterBottom>
        Upload New Photo
      </Typography>
      <Paper elevation={3} className='upload-form-container'>
        {error && (
          <Alert severity='error' sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity='success' sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <Box className='file-input-container'>
            <input
              type='file'
              id='photo-upload'
              accept='image/*'
              onChange={handleFileChange}
              className='file-input'
            />
            <label htmlFor='photo-upload' className='file-input-label'>
              <Button variant='contained' component='span'>
                Select Photo
              </Button>
            </label>
            {fileName && (
              <Typography variant='body1' className='file-name'>
                {fileName}
              </Typography>
            )}
          </Box>
          <Box className='button-container'>
            <Button
              type='submit'
              variant='contained'
              color='primary'
              disabled={!file || loading}
              sx={{ mt: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Upload Photo'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  )
}

export default PhotoUpload
