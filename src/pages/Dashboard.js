import React, { useState, useEffect } from "react";
import { Navigate, Link, Route, Routes } from "react-router-dom";
import BudgetForm from "../components/BudgetForm";
import BudgetList from "../components/BudgetList";
import Transactions from "../pages/Transactions";
import Profile from "../pages/Profile";
import Chart from "../pages/Chart";
import ReportGenerator from "../components/ReportGenerator";
import axios from "../services/api";
import "./Dashboard.css";

const financialTips = [
  "Saving just 5% per month can make a big difference!",
  "Budgeting isn't about restriction, it's about empowerment.",
  "Every dollar saved today is a dollar earned for tomorrow.",
  "Track your spending like you track your fitness - small steps lead to big results!",
  "Ask yourself: Is this purchase a 'want' or a 'need'?",
  "Automate your savings to make financial success effortless.",
];

const Dashboard = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const username = localStorage.getItem("username");
  const [currentTip, setCurrentTip] = useState("");
  const [dashboardData, setDashboardData] = useState({
    monthlySpending: 0,
    monthlyBudget: 0,
    remainingBudget: 0,
    recentTransactions: [],
    spendingByCategory: [],
    currencySymbol: "$",
  });
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
    setCurrentTip(
      financialTips[Math.floor(Math.random() * financialTips.length)]
    );
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const currentDate = new Date();
      const monthYear = `${currentDate.getFullYear()}-${(
        currentDate.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}`;

      const [transactionsRes, budgetsRes, profileRes] = await Promise.all([
        axios.get(`/transactions?month=${monthYear}`),
        axios.get(`/budgets?month=${monthYear}`),
        axios.get("/profile"),
      ]);

      const transactions =
        transactionsRes.data?.data || transactionsRes.data || [];
      const budgets = budgetsRes.data?.data || budgetsRes.data || [];
      const currency = profileRes.data?.currency || "USD";
      const currencySymbol =
        currency === "EUR" ? "€" : currency === "GBP" ? "£" : "$";

      // Calculate totals
      const totalSpent = transactions
        .filter((tx) => tx.type === "expense")
        .reduce((sum, tx) => sum + tx.amount, 0);

      const totalBudget = budgets.reduce(
        (sum, budget) => sum + budget.amount,
        0
      );

      // Get recent transactions (last 4)
      const recentTransactions = transactions
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 4);

      // Calculate spending by category
      const spendingByCategory = budgets.map((budget) => {
        const categorySpending = transactions
          .filter(
            (tx) => tx.category === budget.category && tx.type === "expense"
          )
          .reduce((sum, tx) => sum + tx.amount, 0);

        return {
          category: budget.category,
          amount: categorySpending,
          percentage:
            budget.amount > 0 ? (categorySpending / budget.amount) * 100 : 0,
        };
      });

      setDashboardData({
        monthlySpending: totalSpent,
        monthlyBudget: totalBudget,
        remainingBudget: totalBudget - totalSpent,
        recentTransactions,
        spendingByCategory,
        currencySymbol,
      });
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [refreshTrigger]);

  const triggerRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  if (!token) {
    return <Navigate to="/login" />;
  }

  const getCategoryColor = (category) => {
    const colors = {
      Food: "#ff922b",
      Utilities: "#339af0",
      Transport: "#fcc419",
      Transportation: "#fcc419",
      Entertainment: "#cc5de8",
      Dining: "#ff6b6b",
      Healthcare: "#f06595",
      Other: "#868e96",
    };
    return colors[category] || "#868e96";
  };

  return (
    <div className="dashboard">
      <button
        className="mobile-menu-toggle"
        onClick={() => setSidebarVisible(!sidebarVisible)}
      >
        <i className={`fas ${sidebarVisible ? "fa-times" : "fa-bars"}`}></i>
      </button>
      <div className={`dashboard-sidebar ${sidebarVisible ? "active" : ""}`}>
        <div className="sidebar-header">
          <Link to="/dashboard" className="header-link">
            <h2>Your Dashboard</h2>
          </Link>
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li>
              <Link to="/dashboard/profile" className="nav-link">
                <i className="fas fa-user"></i> Profile
              </Link>
            </li>
            <li>
              <Link to="/dashboard/transactions" className="nav-link">
                <i className="fas fa-exchange-alt"></i> Transactions
              </Link>
            </li>
            <li>
              <Link to="/dashboard/budget" className="nav-link">
                <i className="fas fa-wallet"></i> Budget
              </Link>
            </li>

            <li>
              <Link to="/dashboard/chart" className="nav-link">
                <i className="fas fa-chart-pie"></i> Visualize
              </Link>
            </li>
            <li>
              <Link to="/dashboard/reportgenerator" className="nav-link">
                <i className="fas fa-wallet"></i> Summary
              </Link>
            </li>
          </ul>
        </nav>
        <div className="sidebar-footer">
          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/login";
            }}
            className="logout-btn"
          >
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        <Routes>
          <Route
            path="transactions"
            element={<Transactions onDataChange={triggerRefresh} />}
          />
          <Route
            path="budget"
            element={
              <div className="budget-page">
                <BudgetForm onAdd={triggerRefresh} />
                <BudgetList onDataChange={triggerRefresh} />
              </div>
            }
          />
          <Route path="profile" element={<Profile />} />
          <Route path="chart" element={<Chart />} />
          <Route path="reportgenerator" element={<ReportGenerator />} />
          <Route
            path="/"
            element={
              <div className="dashboard-overview">
                {loading ? (
                  <div className="loading">Loading dashboard data...</div>
                ) : (
                  <>
                    <h1>Welcome back, {username}!</h1>
                    <div
                      className={`financial-tip ${
                        currentTip ? "slide-in" : ""
                      }`}
                    >
                      <i className="fas fa-lightbulb"></i> {currentTip}
                    </div>

                    <div className="overview-cards">
                      <div className="overview-card">
                        <h3>Monthly Spending</h3>
                        <div className="amount">
                          {dashboardData.currencySymbol}
                          {dashboardData.monthlySpending.toFixed(2)}
                        </div>
                        <div className="progress-container">
                          <div
                            className="progress-bar"
                            style={{
                              width: `${
                                dashboardData.monthlyBudget > 0
                                  ? (dashboardData.monthlySpending /
                                      dashboardData.monthlyBudget) *
                                    100
                                  : 0
                              }%`,
                              backgroundColor:
                                dashboardData.monthlySpending >
                                dashboardData.monthlyBudget
                                  ? "#ff6b6b"
                                  : "#51cf66",
                            }}
                          ></div>
                        </div>
                        <div className="budget-info">
                          <span>
                            Budget: {dashboardData.currencySymbol}
                            {dashboardData.monthlyBudget.toFixed(2)}
                          </span>
                          <span>
                            Remaining: {dashboardData.currencySymbol}
                            {dashboardData.remainingBudget.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      <div className="overview-card">
                        <h3>Spending by Category</h3>
                        <div className="category-chart">
                          {dashboardData.spendingByCategory.map((item) => (
                            <div key={item.category} className="category-item">
                              <div className="category-label">
                                <span>{item.category}</span>
                                <span>{item.percentage.toFixed(1)}%</span>
                              </div>
                              <div className="category-bar-container">
                                <div
                                  className="category-bar"
                                  style={{
                                    width: `${item.percentage}%`,
                                    backgroundColor: getCategoryColor(
                                      item.category
                                    ),
                                  }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="recent-transactions">
                      <h3>Recent Transactions</h3>
                      {dashboardData.recentTransactions.length > 0 ? (
                        <>
                          <div className="transactions-list">
                            {dashboardData.recentTransactions.map(
                              (transaction) => (
                                <div
                                  key={transaction._id}
                                  className="transaction-item"
                                >
                                  <div className="transaction-info">
                                    <span className="transaction-name">
                                      {transaction.title}
                                    </span>
                                    <span className="transaction-date">
                                      {new Date(
                                        transaction.date
                                      ).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <div className="transaction-amount">
                                    {transaction.type === "expense" ? "-" : "+"}
                                    {dashboardData.currencySymbol}
                                    {transaction.amount.toFixed(2)}
                                    <span className="transaction-category">
                                      {transaction.category}
                                    </span>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                          <Link
                            to="/dashboard/transactions"
                            className="view-all-link"
                          >
                            View all transactions →
                          </Link>
                        </>
                      ) : (
                        <p>No recent transactions found</p>
                      )}
                    </div>
                  </>
                )}
              </div>
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;
