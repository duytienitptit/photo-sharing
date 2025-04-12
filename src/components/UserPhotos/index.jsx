import React from "react";
import { Typography } from "@mui/material";

import "./styles.css";
import {useParams} from "react-router-dom";
import models from "../../modelData/models";

/**
 * Define UserPhotos, a React component of Project 4.
 */
function UserPhotos () {
    const user = useParams();
    const photoModel = models.photoOfUserModel(user.userId);
    return (
      <Typography variant="body1">
        <table>
            <tr>
                <td>{photoModel.date_time}</td>
                <td>{photoModel.file_name}</td>
                <td><img src={`/images/${photoModel.file_name}`} alt={photoModel.file_name} /></td>
            </tr>
        </table>
      </Typography>
    );
}

export default UserPhotos;
