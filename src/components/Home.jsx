import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Home = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const goToQuiz = () => navigate(user ? "/quiz" : "/login");

  return (
    <div className="container text-center py-5">
      <h1 className="display-4 fw-bold mb-4">Welcome to Coding Quiz App!</h1>

      <p className="lead mb-5 text-muted">
        Challenge your friends in real-time multiplayer quizzes. Create a room,
        share the code, and compete live!
      </p>

      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-lg p-5">
            <h2 className="mb-4">Ready to Play?</h2>

            <button
              onClick={goToQuiz}
              className="btn btn-primary btn-lg px-5 py-3 mb-3"
            >
              {user ? "Go to Quiz Room" : "Start Playing"}
            </button>

            {!user && (
              <p className="mt-4 text-muted">
                Don’t have an account?{" "}
                <Link to="/register" className="text-decoration-underline">
                  Register here
                </Link>
              </p>
            )}

            <div className="mt-5">
              <h4>Features</h4>
              <ul className="list-unstyled mt-3">
                {[
                  "Real-time multiplayer",
                  "Live chat during quiz",
                  "Instant results & scoring",
                  "Create or join rooms easily",
                ].map((feature) => (
                  <li key={feature} className="mb-2">
                    ✅ {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
