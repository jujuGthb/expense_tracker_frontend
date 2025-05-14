import React, { useState } from "react";
import axios from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css"; // Shared auth styles

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
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
      await axios.post("/auth/register", formData);
      navigate("/login"); // Redirect to login after successful registration
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Registration failed. Please try again.";
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

      <div className="auth-wrapper">
        <div className="auth-hero">
          <h2>Start Your Financial Journey</h2>
          <div className="auth-features">
            <div className="feature-item">
              <i className="fas fa-chart-line"></i>
              <p>Track your spending habits</p>
            </div>
            <div className="feature-item">
              <i className="fas fa-bullseye"></i>
              <p>Set and achieve financial goals</p>
            </div>
            <div className="feature-item">
              <i className="fas fa-lock"></i>
              <p>Secure and private</p>
            </div>
          </div>
          <div className="auth-animation">
            <div className="coin-animation"></div>
          </div>
        </div>

        <div className="auth-card">
          <h2>Create Account</h2>
          <p className="auth-subtitle">Get started with your new account</p>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <input
                name="name"
                placeholder="Full Name"
                onChange={handleChange}
                required
              />
            </div>
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
                minLength="6"
              />
            </div>
            <button type="submit" disabled={isLoading}>
              {isLoading ? "Registering..." : "Register"}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Register;
