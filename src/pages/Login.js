import React, { useState } from "react";
import axios from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css"; // Shared auth styles

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const res = await axios.post("/auth/login", formData);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res.data.user.name);
      navigate("/dashboard");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.msg ||
        "Login failed. Please check your credentials.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <Link to="/" className="home-link">
        <i className="fas fa-home"></i>
      </Link>
      <div className="auth-card">
        <h2>Welcome Back</h2>
        <p className="auth-subtitle">Sign in to your account</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <input
              name="email"
              type="email"
              placeholder="Email"
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              name="password"
              type="password"
              placeholder="Password"
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
