import React from "react";
import "./styles.css"; // Import file CSS mới
import {useParams} from "react-router-dom";
import models from "../../modelData/models";

/**
 * Define UserDetail, a React component of Project 4.
 */
function UserDetail() {
    const params = useParams();
    const userModel = models.userModel(params.userId);

    return (
        <div className="user-detail-container">
            <div className="user-detail-header">
                <h2 className="user-detail-name">{userModel.first_name} {userModel.last_name}</h2>
                <p className="user-detail-occupation">{userModel.occupation}</p>
            </div>

            <table className="user-detail-table">
                <tbody>
                    <tr>
                        <td className="user-detail-label">First Name:</td>
                        <td className="user-detail-value">{userModel.first_name}</td>
                    </tr>
                    <tr>
                        <td className="user-detail-label">Last Name:</td>
                        <td className="user-detail-value">{userModel.last_name}</td>
                    </tr>
                    <tr>
                        <td className="user-detail-label">Location:</td>
                        <td className="user-detail-value">{userModel.location}</td>
                    </tr>
                    <tr>
                        <td className="user-detail-label">Description:</td>
                        <td className="user-detail-value">{userModel.description}</td>
                    </tr>
                    <tr>
                        <td className="user-detail-label">Occupation:</td>
                        <td className="user-detail-value">{userModel.occupation}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default UserDetail;
