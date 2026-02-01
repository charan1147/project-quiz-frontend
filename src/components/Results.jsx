import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Results() {
  const [scores, setScores] = useState({});
  const navigate = useNavigate();
  const { state } = useLocation();
  const players = state?.players || [];

  useEffect(() => {
    setScores(state?.scores || {});
  }, [state]);

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow p-4" style={{ maxWidth: 400, width: "100%" }}>
        <h2 className="text-center mb-4">Quiz Results</h2>

        {players.length ? (
          <ul className="list-group mb-4">
            {Object.entries(scores).map(([username, score]) => (
              <li
                key={username}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <strong>{username}</strong>
                <span className="badge bg-primary rounded-pill">
                  {score} pts
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted text-center">No results to display.</p>
        )}

        <button
          className="btn btn-outline-secondary w-100"
          onClick={() => navigate("/quiz")}
        >
          Back to Quiz
        </button>
      </div>
    </div>
  );
}
