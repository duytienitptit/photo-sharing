import React, { useState } from 'react'
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Divider
} from '@mui/material'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

import './styles.css'

function LoginRegister() {
  const [activeTab, setActiveTab] = useState(0)

  // Login states
  const [loginName, setLoginName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Registration states
  const [regLoginName, setRegLoginName] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regPassword2, setRegPassword2] = useState('')
  const [regFirstName, setRegFirstName] = useState('')
  const [regLastName, setRegLastName] = useState('')
  const [regLocation, setRegLocation] = useState('')
  const [regDescription, setRegDescription] = useState('')
  const [regOccupation, setRegOccupation] = useState('')
  const [regError, setRegError] = useState('')
  const [regLoading, setRegLoading] = useState(false)
  const [regSuccess, setRegSuccess] = useState(false)

  const { login, register } = useAuth()
  const navigate = useNavigate()

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
    // Clear success message when switching tabs
    setRegSuccess(false)
  }

  const handleLoginSubmit = async e => {
    e.preventDefault()

    if (!loginName.trim()) {
      setError('Please enter a login name')
      return
    }

    if (!password) {
      setError('Please enter a password')
      return
    }

    setLoading(true)
    setError('')

    const result = await login(loginName.trim(), password)

    if (result.success) {
      // Navigate to user details page
      navigate(`/users/${result.user._id}`)
    } else {
      setError(result.error)
    }

    setLoading(false)
  }

  const handleRegisterSubmit = async e => {
    e.preventDefault()

    // Validate required fields
    if (!regLoginName.trim()) {
      setRegError('Login name is required')
      return
    }

    if (!regPassword) {
      setRegError('Password is required')
      return
    }

    if (regPassword !== regPassword2) {
      setRegError('Passwords do not match')
      return
    }

    setRegLoading(true)
    setRegError('')
    setRegSuccess(false)

    const userData = {
      login_name: regLoginName.trim(),
      password: regPassword,
      first_name: regFirstName.trim(),
      last_name: regLastName.trim(),
      location: regLocation.trim(),
      description: regDescription.trim(),
      occupation: regOccupation.trim()
    }

    const result = await register(userData)

    if (result.success) {
      setRegSuccess(true)
      // Clear form
      setRegLoginName('')
      setRegPassword('')
      setRegPassword2('')
      setRegFirstName('')
      setRegLastName('')
      setRegLocation('')
      setRegDescription('')
      setRegOccupation('')
    } else {
      setRegError(result.error)
    }

    setRegLoading(false)
  }

  return (
    <Box className='login-container'>
      <Paper className='login-paper'>
        <Typography variant='h4' component='h1' gutterBottom align='center'>
          📷 Photo Sharing
        </Typography>

        <Tabs value={activeTab} onChange={handleTabChange} centered sx={{ mb: 2 }}>
          <Tab label='Login' />
          <Tab label='Register' />
        </Tabs>

        {activeTab === 0 ? (
          <form onSubmit={handleLoginSubmit}>
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

            <TextField
              fullWidth
              label='Password'
              type='password'
              variant='outlined'
              value={password}
              onChange={e => setPassword(e.target.value)}
              margin='normal'
              disabled={loading}
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
        ) : (
          <form onSubmit={handleRegisterSubmit}>
            <TextField
              fullWidth
              label='Login Name*'
              variant='outlined'
              value={regLoginName}
              onChange={e => setRegLoginName(e.target.value)}
              margin='normal'
              disabled={regLoading}
              required
              autoFocus
            />

            <TextField
              fullWidth
              label='Password*'
              type='password'
              variant='outlined'
              value={regPassword}
              onChange={e => setRegPassword(e.target.value)}
              margin='normal'
              disabled={regLoading}
              required
            />

            <TextField
              fullWidth
              label='Confirm Password*'
              type='password'
              variant='outlined'
              value={regPassword2}
              onChange={e => setRegPassword2(e.target.value)}
              margin='normal'
              disabled={regLoading}
              required
            />

            <Divider sx={{ my: 2 }} />

            <TextField
              fullWidth
              label='First Name'
              variant='outlined'
              value={regFirstName}
              onChange={e => setRegFirstName(e.target.value)}
              margin='normal'
              disabled={regLoading}
            />

            <TextField
              fullWidth
              label='Last Name'
              variant='outlined'
              value={regLastName}
              onChange={e => setRegLastName(e.target.value)}
              margin='normal'
              disabled={regLoading}
            />

            <TextField
              fullWidth
              label='Location'
              variant='outlined'
              value={regLocation}
              onChange={e => setRegLocation(e.target.value)}
              margin='normal'
              disabled={regLoading}
            />

            <TextField
              fullWidth
              label='Occupation'
              variant='outlined'
              value={regOccupation}
              onChange={e => setRegOccupation(e.target.value)}
              margin='normal'
              disabled={regLoading}
            />

            <TextField
              fullWidth
              label='Description'
              variant='outlined'
              value={regDescription}
              onChange={e => setRegDescription(e.target.value)}
              multiline
              rows={3}
              margin='normal'
              disabled={regLoading}
            />

            {regError && (
              <Alert severity='error' sx={{ mt: 2 }}>
                {regError}
              </Alert>
            )}

            {regSuccess && (
              <Alert severity='success' sx={{ mt: 2 }}>
                Registration successful! You can now login.
              </Alert>
            )}

            <Button type='submit' fullWidth variant='contained' sx={{ mt: 3, mb: 2 }} disabled={regLoading}>
              {regLoading ? <CircularProgress size={24} /> : 'Register Me'}
            </Button>
          </form>
        )}
      </Paper>
    </Box>
  )
}

export default LoginRegister
