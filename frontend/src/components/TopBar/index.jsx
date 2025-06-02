import React, { useEffect } from 'react'
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

import './styles.css'

/**
 * Define TopBar, a React component of Project 4.
 */
function TopBar() {
  const navigate = useNavigate()
  const { isAuthenticated, user, logout, refreshAuthState } = useAuth()

  // Refresh auth state when component mounts
  useEffect(() => {
    refreshAuthState()
  }, [refreshAuthState])

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const handleAddPhoto = () => {
    navigate('/upload')
  }

  return (
    <AppBar className='topbar-appBar' position='absolute'>
      <Toolbar>
        <Typography variant='h5' color='inherit' sx={{ flexGrow: 1 }}>
          📷 Photo Sharing App
        </Typography>

        {isAuthenticated ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant='body1' color='inherit'>
              Hi {user?.first_name}
            </Typography>
            <Button color='inherit' onClick={handleAddPhoto} variant='outlined'>
              Add Photo
            </Button>
            <Button color='inherit' onClick={handleLogout} variant='outlined'>
              Logout
            </Button>
          </Box>
        ) : (
          <Typography variant='body1' color='inherit'>
            Please Login
          </Typography>
        )}
      </Toolbar>
    </AppBar>
  )
}

export default TopBar
