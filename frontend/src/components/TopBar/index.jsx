import React from 'react'
import { AppBar, Toolbar, Typography, Button } from '@mui/material'
import { Link, useLocation } from 'react-router-dom'

import './styles.css'

/**
 * Define TopBar, a React component of Project 4.
 */
function TopBar() {
  const location = useLocation()

  return (
    <AppBar className='topbar-appBar' position='absolute'>
      <Toolbar>
        <Typography variant='h5' color='inherit' sx={{ flexGrow: 1 }}>
          📷 Photo Sharing App
        </Typography>

        <Button
          color='inherit'
          component={Link}
          to='/'
          sx={{
            textDecoration: location.pathname === '/' ? 'underline' : 'none'
          }}
        >
          Home
        </Button>
      </Toolbar>
    </AppBar>
  )
}

export default TopBar
