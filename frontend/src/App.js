import './App.css'

import React from 'react'
import { Grid, Paper } from '@mui/material'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'

import { AuthProvider, useAuth } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import TopBar from './components/TopBar'
import UserDetail from './components/UserDetail'
import UserList from './components/UserList'
import UserPhotos from './components/UserPhotos'
import UserComments from './components/UserComments'
import PhotoDetail from './components/PhotoDetail'
import LoginRegister from './components/LoginRegister'
import PhotoUpload from './components/PhotoUpload'

const AppContent = () => {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return (
      <div className='login-only-container'>
        <Paper className='login-paper'>
          <Routes>
            <Route path='/login' element={<LoginRegister />} />
            <Route path='/login-register' element={<LoginRegister />} />
            <Route path='*' element={<Navigate to='/login' />} />
          </Routes>
        </Paper>
      </div>
    )
  }

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TopBar />
        </Grid>
        <div className='main-topbar-buffer' />
        <Grid item sm={3}>
          <Paper className='main-grid-item'>
            <UserList />
          </Paper>
        </Grid>
        <Grid item sm={9}>
          <Paper className='main-grid-item'>
            <Routes>
              <Route
                path='/users/:userId'
                element={
                  <ProtectedRoute>
                    <UserDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path='/photos/:userId'
                element={
                  <ProtectedRoute>
                    <UserPhotos />
                  </ProtectedRoute>
                }
              />
              <Route
                path='/comments/:userId'
                element={
                  <ProtectedRoute>
                    <UserComments />
                  </ProtectedRoute>
                }
              />
              <Route path='/photo/:photoId' element={<PhotoDetail />} />
              <Route
                path='/users'
                element={
                  <ProtectedRoute>
                    <UserList />
                  </ProtectedRoute>
                }
              />
              <Route
                path='/upload'
                element={
                  <ProtectedRoute>
                    <PhotoUpload />
                  </ProtectedRoute>
                }
              />
              <Route path='/' element={<Navigate to='/users' />} />
              <Route path='/login' element={<Navigate to='/users' />} />
              <Route path='/login-register' element={<Navigate to='/users' />} />
              <Route path='*' element={<Navigate to='/users' />} />
            </Routes>
          </Paper>
        </Grid>
      </Grid>
    </div>
  )
}

const App = props => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  )
}

export default App
