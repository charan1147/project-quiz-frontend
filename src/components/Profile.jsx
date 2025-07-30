import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Profile() {
  const { user, loading } = useContext(AuthContext);

  if (loading)
    return (
      <div className="container d-flex flex-column align-items-center justify-content-center vh-100">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-3"> Loading profile...</p>
      </div>
    );

  if (!user)
    return (
      <div className="container d-flex flex-column align-items-center justify-content-center vh-100">
        <div className="alert alert-warning text-center" role="alert">
           Please log in to view your profile.
        </div>
      </div>
    );

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div
        className="card shadow p-4"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <h2 className="text-center mb-4">👤 Profile</h2>
        <ul className="list-group list-group-flush">
          <li className="list-group-item">
            <strong>Username:</strong> {user.username}
          </li>
          <li className="list-group-item">
            <strong>Email:</strong> {user.email}
          </li>
          <li className="list-group-item">
            <strong>Joined:</strong>{" "}
            {new Date(user.createdAt).toLocaleDateString()}
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Profile;
