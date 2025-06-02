import React, { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { CircularProgress, Box } from '@mui/material'

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading, refreshAuthState } = useAuth()

  // Refresh auth state when component mounts
  useEffect(() => {
    refreshAuthState()
    console.log('ProtectedRoute - Auth State:', { isAuthenticated, loading })
  }, [refreshAuthState, isAuthenticated, loading])

  if (loading) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' minHeight='200px'>
        <CircularProgress />
      </Box>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to='/login' replace />
  }

  return children
}

export default ProtectedRoute
