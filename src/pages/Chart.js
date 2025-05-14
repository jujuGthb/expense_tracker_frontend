import React, { useState, useEffect } from "react";
import { Pie, Bar } from "react-chartjs-2";
import axios from "../services/api";
import { Chart as ChartJS, registerables } from "chart.js";
import "./Chart.css";

ChartJS.register(...registerables);

const Chart = () => {
  const [transactionData, setTransactionData] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [timeRange, setTimeRange] = useState("month");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [transactionsRes, budgetsRes] = await Promise.all([
          axios.get(`/transactions?range=${timeRange}`),
          axios.get("/budgets"),
        ]);

        setTransactionData(
          transactionsRes.data?.data || transactionsRes.data || []
        );
        setBudgets(budgetsRes.data?.data || budgetsRes.data || []);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Failed to load chart data");
        setTransactionData([]);
        setBudgets([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [timeRange]);

  const incomeData = transactionData.filter((t) => t.type === "income");
  const expenseData = transactionData.filter((t) => t.type === "expense");

  const pieData = {
    labels: ["Income", "Expenses"],
    datasets: [
      {
        data: [
          incomeData.reduce((sum, t) => sum + (t.amount || 0), 0),
          expenseData.reduce((sum, t) => sum + (t.amount || 0), 0),
        ],
        backgroundColor: ["#4CAF50", "#F44336"],
        hoverBackgroundColor: ["#66BB6A", "#EF5350"],
      },
    ],
  };

  const barData = {
    labels: budgets.map((b) => b.category),
    datasets: [
      {
        label: "Budgeted",
        data: budgets.map((b) => b.amount),
        backgroundColor: "#4CAF50",
      },
      {
        label: "Actual Spending",
        data: budgets.map((b) => {
          const categoryExpenses = expenseData.filter(
            (t) => t.category === b.category
          );
          return categoryExpenses.reduce((sum, t) => sum + (t.amount || 0), 0);
        }),
        backgroundColor: "#F44336",
      },
    ],
  };

  if (loading)
    return <div className="chart-loading">Loading chart data...</div>;
  if (error) return <div className="chart-error">{error}</div>;

  return (
    <div className="chart-container">
      <h2>Financial Overview</h2>
      <div className="chart-controls">
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
        >
          <option value="week">Last Week</option>
          <option value="month">Last Month</option>
          <option value="year">Last Year</option>
        </select>
      </div>

      <div className="chart-row">
        <div className="chart-card">
          <h3>Income vs Expenses</h3>
          <Pie data={pieData} />
        </div>
        <div className="chart-card">
          <h3>Budget vs Actual</h3>
          <Bar
            data={barData}
            options={{
              indexAxis: "x",
              scales: {
                x: {
                  stacked: true,
                },
                y: {
                  stacked: true,
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Chart;
