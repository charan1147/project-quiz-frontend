import React, { useState, useEffect, useContext } from "react";
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
  const [quiz, setQuiz] = useState({
    question: null,
    timeLeft: 0,
    currentQuestion: 0,
    totalQuestions: 0,
    started: false,
  });
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
    if (!roomId) return;

    socket.on("connect", () => {
      socket.emit("rejoinRoom", { roomId, username: user.username });
    });

    socket.on("playerUpdate", (data) => setPlayers(data.players));
    socket.on("scoreUpdate", setScores);
    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    socket.on("startQuiz", (data) => {
      setQuiz({
        question: data.question,
        timeLeft: data.timeLeft,
        currentQuestion: data.currentQuestion,
        totalQuestions: data.totalQuestions,
        started: true,
      });
      setAnswer("");
      setAnswered(false);
      setFeedback("");
    });
    socket.on("timerUpdate", (data) =>
      setQuiz((prev) => ({ ...prev, timeLeft: data.timeLeft }))
    );
    socket.on("quizEnd", (data) => {
      localStorage.removeItem("roomId");
      api.post("/quiz/match", { roomId, players, scores: data.scores });
      navigate("/results", { state: { scores: data.scores, players } });
    });

    return () => {
      socket.off("connect");
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
    if (!answer || answered) return;
    const timeTaken = (15 - quiz.timeLeft) * 1000;
    socket.emit("submitAnswer", { roomId, answer, timeTaken });

    const isCorrect =
      answer.trim().toLowerCase() ===
      quiz.question.correct_answer.trim().toLowerCase();
    setFeedback(
      isCorrect
        ? " Correct!"
        : ` Wrong! Correct: ${quiz.question.correct_answer}`
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
      <div className="container">
        <h2>Quiz Room</h2>
        <input
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          placeholder="Enter Room ID"
        />
        <button onClick={handleJoin}>Join Room</button>
        <button onClick={handleCreateRoom}>Create Room</button>
        <button onClick={() => navigator.clipboard.writeText(roomId)}>
          Copy Room ID
        </button>
        {players.length > 0 && (
          <>
            <p>
              <strong>Players:</strong>{" "}
              {players.map((p) => p.username).join(", ")}
            </p>
            <button onClick={handleStartQuiz}>Start Quiz</button>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="container">
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
      {quiz.question?.options.map((ans, i) => (
        <button
          key={i}
          onClick={() => setAnswer(ans)}
          disabled={answered}
          style={{
            backgroundColor: answer === ans ? "#add8e6" : "",
            marginBottom: "5px",
            display: "block",
            width: "100%",
          }}
        >
          {ans}
        </button>
      ))}
      <button onClick={handleAnswerSubmit} disabled={!answer || answered}>
        Submit Answer
      </button>
      {feedback && <p>{feedback}</p>}
      <div>
        <h3>Chat</h3>
        <ul>
          {messages.map((msg, i) => (
            <li key={i}>
              <strong>{msg.username}</strong>: {msg.message}{" "}
              <small>{new Date(msg.timestamp).toLocaleTimeString()}</small>
            </li>
          ))}
        </ul>
        <form onSubmit={sendMessage}>
          <input value={message} onChange={(e) => setMessage(e.target.value)} />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
}

export default QuizRoom;
