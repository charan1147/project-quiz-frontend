import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";
import QuizRoom from "./components/QuizRoom";
import Results from "./components/Results";
import Home from "./components/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";

function App() {
  const { user, logout, loading } = useContext(AuthContext);

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  const AuthLinks = () => (
    <>
      <li className="nav-item">
        <Link className="nav-link" to="/profile">
          Profile
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/quiz">
          Join Quiz
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/results">
          Results
        </Link>
      </li>
      <li className="nav-item">
        <button className="btn btn-outline-light ms-2" onClick={logout}>
          Logout
        </button>
      </li>
    </>
  );

  const GuestLinks = () => (
    <>
      <li className="nav-item">
        <Link className="nav-link" to="/login">
          Login
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/register">
          Register
        </Link>
      </li>
    </>
  );

  return (
    <Router>
      <div className="App">
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">
              Quiz App
            </Link>
            <div className="collapse navbar-collapse">
              <ul className="navbar-nav ms-auto">
                {user ? <AuthLinks /> : <GuestLinks />}
              </ul>
            </div>
          </div>
        </nav>

        <div className="container mt-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/quiz"
              element={
                <ProtectedRoute>
                  <QuizRoom />
                </ProtectedRoute>
              }
            />
            <Route
              path="/results"
              element={
                <ProtectedRoute>
                  <Results />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
