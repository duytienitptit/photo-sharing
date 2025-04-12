import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";
import {  useMatch } from "react-router-dom";
import models from "../../modelData/models";
import "./styles.css";

/**
 * Define TopBar, a React component of Project 4.
 */
function TopBar () {
  const [userName, setUserName] = useState('');
  const [pageType, setPageType] = useState('');

  const userDetailMatch = useMatch('/users/:userId');
  const userPhotosMatch = useMatch('/photos/:userId');

  const userId = userDetailMatch?.params.userId || userPhotosMatch?.params.userId;

  useEffect(() => {
    if (userDetailMatch) {
      setPageType('details');
    } else if (userPhotosMatch) {
      setPageType('photos');
    } else {
      setPageType('');
    }

    if (userId) {
      const userModel = models.userModel(userId);
      setUserName(userModel.first_name + ' ' + userModel.last_name);
    } else {
      setUserName('');
    }
  }, [userId, userDetailMatch, userPhotosMatch]);
  console.log(userName);

    return (
      <AppBar className="topbar-appBar" position="fixed">
      <Toolbar className="topbar-toolbar">
        {(pageType === 'details' || pageType === 'photos') && (
          <div className="topbar-user-section">
            <Typography variant="h5" className="topbar-title">
              {pageType === 'details' ? `${userName} Details` : `${userName}'s Photos`}
            </Typography>
          </div>
        )}
      </Toolbar>
    </AppBar>
    );
}

export default TopBar;
