import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Results() {
  const [scores, setScores] = useState({});
  const [players, setPlayers] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setScores(location.state?.scores || {});
    setPlayers(location.state?.players || []);
  }, [location]);

  return (
    <div className="container mt-4">
      <h2 className="mb-3">🏆 Quiz Results</h2>
      <ul className="list-group mb-3">
        {Object.entries(scores).map(([username, score]) => (
          <li key={username} className="list-group-item">
            {username}: {score} points
          </li>
        ))}
      </ul>
      <button className="btn btn-primary" onClick={() => navigate("/quiz")}>
        🔁 Back to Quiz
      </button>
    </div>
  );
}

export default Results;
