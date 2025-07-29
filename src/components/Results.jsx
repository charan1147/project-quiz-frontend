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
    <div className="container">
      <h2>🏆 Quiz Results</h2>
      <ul>
        {Object.entries(scores).map(([username, score]) => (
          <li key={username}>
            {username}: {score} points
          </li>
        ))}
      </ul>
      <button onClick={goBack}>🔁 Back to Quiz</button>
    </div>
  );
}

export default Results;
