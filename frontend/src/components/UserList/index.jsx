import React, { useState, useEffect } from 'react'
import { Divider, List, ListItem, ListItemText, Typography, CircularProgress, Alert } from '@mui/material'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

import './styles.css'
import userService from '../../services/userService'

/**
 * Define UserList, a React component of Project 4.
 */
function UserList() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false)
      return
    }

    const fetchUsers = async () => {
      try {
        setLoading(true)
        const userData = await userService.getUserList()
        setUsers(userData)
        setError(null)
      } catch (err) {
        setError('Failed to load users. Please try again later.')
        console.error('Error loading users:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [isAuthenticated])

  if (!isAuthenticated) {
    return null // Don't show user list when not authenticated
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 20 }}>
        <CircularProgress />
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ padding: 20 }}>
        <Alert severity='error'>{error}</Alert>
      </div>
    )
  }

  return (
    <div>
      <Typography variant='h5' sx={{ padding: 2 }}>
        Users
      </Typography>
      <List component='nav'>
        {users.map(user => (
          <React.Fragment key={user._id}>
            <ListItem component={Link} to={`/users/${user._id}`} button>
              <ListItemText primary={` ${user.last_name}`} secondary={user.occupation} />
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </div>
  )
}

export default UserList
