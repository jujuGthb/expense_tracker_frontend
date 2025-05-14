import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import budgetAnimation from "../assets/budget.json";
import Lottie from "lottie-react";

const Home = () => (
  <div className="home-container">
    <div className="home-content">
      <Lottie animationData={budgetAnimation} className="home-animation" />

      <h1 className="home-title">
        Welcome to <span>BudgetBuddy</span>
      </h1>
      <p className="home-subtitle">Your smart way to manage money.</p>

      <Link to="/register">
        <button className="home-button">Get Started</button>
      </Link>
    </div>
  </div>
);

export default Home;
