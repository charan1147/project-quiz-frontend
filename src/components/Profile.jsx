import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Profile() {
  const { user, loading } = useContext(AuthContext);

  if (loading)
    return <div className="container mt-4"> Loading profile...</div>;
  if (!user)
    return (
      <div className="container mt-4">
         Please log in to view your profile.
      </div>
    );

  return (
    <div className="container mt-4">
      <h2 className="mb-3">👤 Profile</h2>
      <p>
        <strong>Username:</strong> {user.username}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <p>
        <strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
}

export default Profile;
