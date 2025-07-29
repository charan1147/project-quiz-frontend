import React, { useState, useEffect, useContext, useRef, useMemo } from "react";
import { AuthContext } from "../context/AuthContext";
import socket from "../services/socket";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

function QuizRoom() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState(localStorage.getItem("roomId") || "");
  const [players, setPlayers] = useState([]);
  const [question, setQuestion] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [scores, setScores] = useState({});
  const [answer, setAnswer] = useState("");
  const [answered, setAnswered] = useState(false);
  const [answerFeedback, setAnswerFeedback] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const inputRef = useRef(null);
  const chatEndRef = useRef(null);
  const shuffledAnswers = useMemo(() => question?.options || [], [question]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!user) return navigate("/login");
    if (!roomId) return;

    const handleConnect = () => {
      socket.emit("rejoinRoom", { roomId, username: user.username });
    };

    if (socket.connected) handleConnect();
    else socket.once("connect", handleConnect);

    socket.on("playerUpdate", (data) => setPlayers(data.players));
    socket.on("scoreUpdate", setScores);
    socket.on("receiveMessage", (msg) =>
      setMessages((prev) => (Array.isArray(msg) ? msg : [...prev, msg]))
    );
    socket.on("startQuiz", (data) => {
      setQuizStarted(true);
      setQuestion(data.question);
      setTimeLeft(data.timeLeft);
      setCurrentQuestion(data.currentQuestion);
      setTotalQuestions(data.totalQuestions);
      setAnswer("");
      setAnswered(false);
      setAnswerFeedback("");
    });
    socket.on("timerUpdate", (data) => setTimeLeft(data.timeLeft));
    socket.on("quizEnd", (data) => {
      localStorage.removeItem("roomId");
      api.post("/quiz/match", { roomId, players, scores: data.scores });
      navigate("/results", { state: { scores: data.scores, players } });
    });

    return () => {
      socket.off("playerUpdate");
      socket.off("scoreUpdate");
      socket.off("receiveMessage");
      socket.off("startQuiz");
      socket.off("timerUpdate");
      socket.off("quizEnd");
    };
  }, [roomId, user, navigate]);

  const handleJoin = () => {
    if (!roomId || !user?.username) return;
    localStorage.setItem("roomId", roomId);
    socket.emit("joinRoom", { roomId, username: user.username });
  };

  const handleCreateRoom = () => {
    const newId = uuidv4().slice(0, 8);
    setRoomId(newId);
    localStorage.setItem("roomId", newId);
    socket.emit("createRoom", { roomId: newId, username: user.username });
  };

  const handleStartQuiz = () => {
    socket.emit("startQuizManually", { roomId });
  };

  const handleAnswerSubmit = () => {
    const timeTaken = (15 - timeLeft) * 1000;
    socket.emit("submitAnswer", { roomId, answer, timeTaken });
    const correct = question.correct_answer.trim().toLowerCase();
    const selected = answer.trim().toLowerCase();
    setCorrectAnswer(question.correct_answer);
    setAnswered(true);
    setAnswerFeedback(
      selected === correct
        ? " Correct!"
        : ` Wrong! Correct: ${question.correct_answer}`
    );
    setAnswer("");
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    socket.emit("sendMessage", { roomId, message, username: user.username });
    setMessage("");
    inputRef.current?.focus();
  };

  if (!quizStarted) {
    return (
      <div className="container mt-4">
        <h2 className="mb-3">Quiz Room</h2>
        <input
          className="form-control mb-2"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          placeholder="Enter Room ID"
        />
        <div className="d-flex gap-2 mb-3">
          <button className="btn btn-primary" onClick={handleJoin}>
            Join Room
          </button>
          <button className="btn btn-success" onClick={handleCreateRoom}>
            Create Room
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => navigator.clipboard.writeText(roomId)}
          >
            Copy Room ID
          </button>
        </div>
        {players.length > 0 && (
          <>
            <p>
              <strong>Players:</strong>{" "}
              {players.map((p) => p.username).join(", ")}
            </p>
            <button className="btn btn-primary" onClick={handleStartQuiz}>
              Start Quiz
            </button>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Quiz In Progress</h2>
      <p>
        <strong>Players:</strong> {players.map((p) => p.username).join(", ")}
      </p>
      <p>
        <strong>Time Left:</strong> {timeLeft}s
      </p>
      <p>
        <strong>Scores:</strong>{" "}
        {Object.entries(scores)
          .map(([u, s]) => `${u}: ${s}`)
          .join(", ")}
      </p>
      <p>
        <strong>
          Q{currentQuestion}/{totalQuestions}:
        </strong>{" "}
        {question?.question}
      </p>
      {shuffledAnswers.map((ans, i) => (
        <button
          key={i}
          className={`btn btn-outline-primary w-100 mb-2 ${
            answer === ans ? "active" : ""
          }`}
          onClick={() => setAnswer(ans)}
          disabled={answered}
        >
          {ans}
        </button>
      ))}
      <button
        className="btn btn-primary mt-2"
        onClick={handleAnswerSubmit}
        disabled={!answer || answered}
      >
        Submit Answer
      </button>
      {answerFeedback && <p className="mt-2">{answerFeedback}</p>}
      <div className="mt-4">
        <h3>Chat</h3>
        <ul
          className="list-group mb-3"
          style={{ maxHeight: "200px", overflowY: "auto" }}
        >
          {messages.map((msg, i) => (
            <li key={i} className="list-group-item">
              <strong>{msg.username}</strong>: {msg.message}{" "}
              <small>{new Date(msg.timestamp).toLocaleTimeString()}</small>
            </li>
          ))}
          <div ref={chatEndRef} />
        </ul>
        <form onSubmit={sendMessage} className="d-flex gap-2">
          <input
            ref={inputRef}
            className="form-control"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button className="btn btn-primary" type="submit">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default QuizRoom;
