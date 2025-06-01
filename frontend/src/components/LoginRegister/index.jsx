import React, { useState } from 'react'
import { Box, Paper, TextField, Button, Typography, Alert, CircularProgress } from '@mui/material'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

import './styles.css'

function LoginRegister() {
  const [loginName, setLoginName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault()

    if (!loginName.trim()) {
      setError('Please enter a login name')
      return
    }

    setLoading(true)
    setError('')

    const result = await login(loginName.trim())

    if (result.success) {
      // Navigate to user details page
      navigate(`/users/${result.user._id}`)
    } else {
      setError(result.error)
    }

    setLoading(false)
  }

  return (
    <Box className='login-container'>
      <Paper className='login-paper'>
        <Typography variant='h4' component='h1' gutterBottom align='center'>
          📷 Photo Sharing
        </Typography>

        <Typography variant='h6' component='h2' gutterBottom align='center'>
          Please Login
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label='Login Name'
            variant='outlined'
            value={loginName}
            onChange={e => setLoginName(e.target.value)}
            margin='normal'
            disabled={loading}
            autoFocus
          />

          {error && (
            <Alert severity='error' sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          <Button type='submit' fullWidth variant='contained' sx={{ mt: 3, mb: 2 }} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Login'}
          </Button>
        </form>
      </Paper>
    </Box>
  )
}

export default LoginRegister
