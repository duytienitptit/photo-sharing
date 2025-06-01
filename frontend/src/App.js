import './App.css'

import React from 'react'
import { Grid, Paper } from '@mui/material'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import TopBar from './components/TopBar'
import UserDetail from './components/UserDetail'
import UserList from './components/UserList'
import UserPhotos from './components/UserPhotos'
import UserComments from './components/UserComments'
import PhotoDetail from './components/PhotoDetail'
import LoginRegister from './components/LoginRegister'

const App = props => {
  return (
    <AuthProvider>
      <Router>
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
                  <Route path='/login' element={<LoginRegister />} />
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
                  <Route
                    path='/photo/:photoId'
                    element={
                      <ProtectedRoute>
                        <PhotoDetail />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path='/users'
                    element={
                      <ProtectedRoute>
                        <UserList />
                      </ProtectedRoute>
                    }
                  />
                  <Route path='/' element={<LoginRegister />} />
                </Routes>
              </Paper>
            </Grid>
          </Grid>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
