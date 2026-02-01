import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await register(form.username, form.email, form.password);
      ["roomId", "username"].forEach((k) => localStorage.removeItem(k));
      navigate("/");
    } catch {
      setError("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center">
      <form
        onSubmit={handleSubmit}
        className="card p-4 shadow"
        style={{ maxWidth: 400, width: "100%" }}
      >
        <h2 className="text-center mb-4">Register</h2>

        <input
          name="username"
          className="form-control mb-3"
          placeholder="Username"
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          className="form-control mb-3"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          className="form-control mb-3"
          placeholder="Password"
          onChange={handleChange}
          required
        />

        <button className="btn btn-primary w-100" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>

        {error && <div className="alert alert-danger mt-3">{error}</div>}
      </form>
    </div>
  );
}
