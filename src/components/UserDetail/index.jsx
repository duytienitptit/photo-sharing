import React from "react";
import {Typography} from "@mui/material";

import "./styles.css";
import {useParams} from "react-router-dom";
import models from "../../modelData/models";

/**
 * Define UserDetail, a React component of Project 4.
 */
function UserDetail() {
    const user = useParams();
    const userModel = models.userModel(user.userId);
    return (
        <>
          <Typography variant="body1">
            <table>
                <tr>
                    <td>First Name:</td>
                    <td>{userModel.first_name}</td>
                </tr>
                <tr>
                    <td>Last Name:</td>
                    <td>{userModel.last_name}</td>
                </tr>
                <tr>
                    <td>Location:</td>
                    <td>{userModel.location}</td>
                </tr>
                <tr>
                    <td>Description:</td>
                    <td>{userModel.description}</td>
                </tr>
                <tr>
                    <td>Occupation:</td>
                    <td>{userModel.occupation}</td>
                </tr>
            </table>
          </Typography>
        </>
    );
}

export default UserDetail;
