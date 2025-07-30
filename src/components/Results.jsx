import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Results() {
  const [scores, setScores] = useState({});
  const [players, setPlayers] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const stateScores = location.state?.scores || {};
    const statePlayers = location.state?.players || [];
    setScores(stateScores);
    setPlayers(statePlayers);
  }, [location]);

  const goBack = () => navigate("/quiz");

  return (
    <div className="container mt-5">
      <div className="card shadow">
        <div className="card-body">
          <h2 className="card-title text-center mb-4">🏆 Quiz Results</h2>
          {players.length > 0 ? (
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
          <div className="text-center">
            <button className="btn btn-outline-secondary" onClick={goBack}>
              🔁 Back to Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Results;
