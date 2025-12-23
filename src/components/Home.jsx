import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Home() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleStartQuiz = () => {
    if (user) {
      navigate("/quiz");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="container text-center py-5">
      <h1 className="display-4 fw-bold mb-4">Welcome to Coading Quiz App! </h1>
      <p className="lead mb-5 text-muted">
        Challenge your friends in real-time multiplayer quizzes. Create a room,
        share the code, and compete live!
      </p>

      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-lg p-5">
            <h2 className="mb-4">Ready to Play?</h2>
            <button
              onClick={handleStartQuiz}
              className="btn btn-primary btn-lg px-5 py-3 mb-3"
            >
              {user ? "Go to Quiz Room" : "Start Playing"}
            </button>

            {!user && (
              <p className="mt-4 text-muted">
                Don't have an account?{" "}
                <Link to="/register" className="text-decoration-underline">
                  Register here
                </Link>
              </p>
            )}

            <div className="mt-5">
              <h4>Features</h4>
              <ul className="list-unstyled mt-3">
                <li className="mb-2">✅ Real-time multiplayer</li>
                <li className="mb-2">✅ Live chat during quiz</li>
                <li className="mb-2">✅ Instant results & scoring</li>
                <li className="mb-2">✅ Create or join rooms easily</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
