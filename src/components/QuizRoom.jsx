import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { AuthContext } from "../context/AuthContext";
import socket from "../services/socket";
import api from "../services/api";

const initialQuiz = {
  question: null,
  timeLeft: 0,
  currentQuestion: 0,
  totalQuestions: 0,
  started: false,
};

function QuizRoom() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [roomId, setRoomId] = useState(localStorage.getItem("roomId") || "");
  const [players, setPlayers] = useState([]);
  const [quiz, setQuiz] = useState(initialQuiz);
  const [scores, setScores] = useState({});
  const [answer, setAnswer] = useState("");
  const [answered, setAnswered] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  useEffect(() => {
    if (!roomId || !user) return;

    socket.emit("rejoinRoom", { roomId, username: user.username });

    socket.on("playerUpdate", ({ players }) => setPlayers(players));
    socket.on("scoreUpdate", setScores);
    socket.on("receiveMessage", (msg) => setMessages((prev) => [...prev, msg]));

    socket.on("startQuiz", (data) => {
      setQuiz({ ...data, started: true });
      setAnswer("");
      setAnswered(false);
      setFeedback("");
    });

    socket.on("timerUpdate", ({ timeLeft }) =>
      setQuiz((q) => ({ ...q, timeLeft })),
    );

    socket.on("quizEnd", ({ scores }) => {
      localStorage.removeItem("roomId");
      api.post("/quiz/match", { roomId, players, scores });
      navigate("/results", { state: { scores, players } });
    });

    return () => socket.removeAllListeners();
  }, [roomId, user, navigate, players]);

  const joinRoom = () => {
    if (!roomId) return;
    localStorage.setItem("roomId", roomId);
    socket.emit("joinRoom", { roomId, username: user.username });
  };

  const createRoom = () => {
    const id = uuidv4().slice(0, 8);
    setRoomId(id);
    localStorage.setItem("roomId", id);
    socket.emit("createRoom", { roomId: id, username: user.username });
  };

  const submitAnswer = () => {
    if (!answer || answered) return;

    socket.emit("submitAnswer", {
      roomId,
      answer,
      timeTaken: (15 - quiz.timeLeft) * 1000,
    });

    const correct =
      answer.trim().toLowerCase() ===
      quiz.question.correct_answer.trim().toLowerCase();

    setFeedback(
      correct ? "Correct!" : `Wrong! Correct: ${quiz.question.correct_answer}`,
    );
    setAnswered(true);
    setAnswer("");
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    socket.emit("sendMessage", { roomId, message, username: user.username });
    setMessage("");
  };

  if (!quiz.started) {
    return (
      <div className="container py-5">
        <h2>Quiz Room</h2>

        <input
          className="form-control mb-3"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          placeholder="Enter Room ID"
        />

        <div className="d-flex gap-2 mb-3">
          <button className="btn btn-primary" onClick={joinRoom}>
            Join
          </button>
          <button className="btn btn-success" onClick={createRoom}>
            Create
          </button>
          <button
            className="btn btn-outline-secondary"
            onClick={() => navigator.clipboard.writeText(roomId)}
          >
            Copy ID
          </button>
        </div>

        {!!players.length && (
          <>
            <p>
              <strong>Players:</strong>{" "}
              {players.map((p) => p.username).join(", ")}
            </p>
            <button
              className="btn btn-warning"
              onClick={() => socket.emit("startQuizManually", { roomId })}
            >
              Start Quiz
            </button>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2>Quiz In Progress</h2>

      <p>
        <strong>Players:</strong> {players.map((p) => p.username).join(", ")}
      </p>
      <p>
        <strong>Time Left:</strong> {quiz.timeLeft}s
      </p>
      <p>
        <strong>Scores:</strong>{" "}
        {Object.entries(scores)
          .map(([u, s]) => `${u}: ${s}`)
          .join(", ")}
      </p>

      <p>
        <strong>
          Q{quiz.currentQuestion}/{quiz.totalQuestions}:
        </strong>{" "}
        {quiz.question?.question}
      </p>

      {quiz.question?.options.map((opt, i) => (
        <button
          key={i}
          className={`btn btn-outline-primary w-100 mb-2 ${answer === opt ? "active" : ""}`}
          disabled={answered}
          onClick={() => setAnswer(opt)}
        >
          {opt}
        </button>
      ))}

      <button
        className="btn btn-success w-100"
        disabled={!answer || answered}
        onClick={submitAnswer}
      >
        Submit Answer
      </button>

      {feedback && <div className="alert alert-info mt-3">{feedback}</div>}

      <div className="card mt-4">
        <div className="card-body">
          <h4>💬 Chat</h4>

          <ul className="list-group mb-3">
            {messages.map((m, i) => (
              <li key={i} className="list-group-item">
                <strong>{m.username}</strong>: {m.message}
                <small className="float-end text-muted">
                  {new Date(m.timestamp).toLocaleTimeString()}
                </small>
              </li>
            ))}
          </ul>

          <form onSubmit={sendMessage} className="d-flex gap-2">
            <input
              className="form-control"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
            />
            <button className="btn btn-primary">Send</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default QuizRoom;
