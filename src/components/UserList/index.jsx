import React from "react"
import {
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material"

import "./styles.css" // Import file CSS mới
import models from "../../modelData/models"
import { Link } from "react-router-dom"

/**
 * Define UserList, a React component of Project 4.
 */
function UserList() {
  const users = models.userListModel()

  return (
    <div className="user-list-container">
      <Typography variant="body1" className="user-list-intro">
        This is the user list, which takes up 3/12 of the window. You might
        choose to use <a href="https://mui.com/components/lists/">Lists</a> and{" "}
        <a href="https://mui.com/components/dividers/">Dividers</a> to display
        your users like so:
      </Typography>
      <List component="nav" className="user-list-nav">
        {users.map((item) => (
          <div key={item._id}>
            <ListItem className="user-list-item" sx={{ display: "flex", flexDirection: "column" }}>
            <ListItemText
  primary={`${item.first_name} ${item.last_name}`}
  className="user-name"
/>
              <div className="user-links-container">
                <Link to={`/users/${item._id}`} className="user-link">
                  User Detail
                </Link>
                <Link to={`/photos/${item._id}`} className="user-link">
                  User Photos
                </Link>
              </div>
            </ListItem>
            <Divider className="user-divider" />
          </div>
        ))}
      </List>
      <Typography variant="body1" className="user-list-footer">
        The model comes in from models.userListModel()
      </Typography>
    </div>
  )
}

export default UserList
