import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Profile() {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <p className="text-center">Loading...</p>;
  if (!user) return <p className="text-center">Please login</p>;

  return (
    <div className="container vh-100 d-flex justify-content-center align-items-center">
      <div className="card p-4 shadow" style={{ maxWidth: 400 }}>
        <h3 className="text-center">👤 Profile</h3>
        <p>
          <b>Username:</b> {user.username}
        </p>
        <p>
          <b>Email:</b> {user.email}
        </p>
        <p>
          <b>Joined:</b> {new Date(user.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
