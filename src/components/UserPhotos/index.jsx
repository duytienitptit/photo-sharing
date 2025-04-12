import React from "react";
import "./styles.css";
import {useParams} from "react-router-dom";
import models from "../../modelData/models";

/**
 * Define UserPhotos, a React component of Project 4.
 */
function UserPhotos () {
    const params = useParams();
    const photoModel = models.photoOfUserModel(params.userId);

    return (
        <table className="user-photos-table">
        <tbody>
          {photoModel.map((photo) => (
            <tr key={photo._id} className="photo-row">
              <td className="photo-date-time">{photo.date_time}</td>
              <td className="photo-file-name">{photo.file_name}</td>
              <td className="photo-cell-image">
                <img
                  className="photo-image"
                  src={`/images/${photo.file_name}`}
                  alt={photo.file_name}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
}

export default UserPhotos;
