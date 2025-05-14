import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import axios from "../services/api";
import BudgetForm from "./BudgetForm";
import "./BudgetList.css";

const BudgetList = ({ newBudget }) => {
  const [budgets, setBudgets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(
    format(new Date(), "yyyy-MM")
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingBudget, setEditingBudget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [currencySymbol, setCurrencySymbol] = useState("$");

  // Fetch both budgets and transactions
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [budgetsRes, transactionsRes] = await Promise.all([
          axios.get(`/budgets?month=${selectedMonth}`),
          axios.get(`/transactions?month=${selectedMonth}&type=expense`),
        ]);

        setBudgets(budgetsRes.data?.data || budgetsRes.data || []);
        setTransactions(
          transactionsRes.data?.data || transactionsRes.data || []
        );
        setError(null);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Failed to load budget data");
        setBudgets([]);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedMonth, newBudget, editingBudget]);

  // Calculate spending per category
  const getSpentAmount = (category) => {
    return transactions
      .filter((t) => t.category === category)
      .reduce((sum, t) => sum + (t.amount || 0), 0);
  };

  // Handle edit
  const handleEdit = (budget) => {
    setEditingBudget(budget);
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this budget?")) {
      try {
        setIsDeleting(true);
        setDeletingId(id);
        await axios.delete(`/budgets/${id}`);
        setBudgets(budgets.filter((budget) => budget._id !== id));
      } catch (err) {
        console.error("Failed to delete budget:", err);
        setError("Failed to delete budget");
      } finally {
        setIsDeleting(false);
        setDeletingId(null);
      }
    }
  };

  // Handle update
  const handleUpdate = async (updatedBudget) => {
    try {
      const res = await axios.put(
        `/budgets/${editingBudget._id}`,
        updatedBudget
      );
      setBudgets(
        budgets.map((b) => (b._id === editingBudget._id ? res.data : b))
      );
      setEditingBudget(null);
    } catch (err) {
      console.error("Failed to update budget:", err);
      setError("Failed to update budget");
    }
  };

  // Fetch profile to get currency
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("/profile");
        const currency = res.data?.currency || "USD";
        setCurrencySymbol(
          currency === "EUR" ? "€" : currency === "GBP" ? "£" : "$"
        );
      } catch (err) {
        console.error("Failed to fetch currency:", err);
      }
    };
    fetchProfile();
  }, []);

  // Calculate totals
  const totalSpent = transactions.reduce((sum, t) => sum + (t.amount || 0), 0);
  const totalBudget = budgets.reduce(
    (sum, b) => sum + (Number(b.amount) || 0),
    0
  );

  if (loading) return <div className="loading">Loading budgets...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="budget-list-container">
      <div className="budget-header">
        <h3>Your Budgets</h3>
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        />
      </div>

      <div className="budget-summary">
        <div className="summary-item">
          <span>Total Budget:</span>
          <span className="total-amount">
            {currencySymbol}
            {totalBudget.toFixed(2)}
          </span>
        </div>
        <div className="summary-item">
          <span>Total Spent:</span>
          <span className="total-spent">
            {currencySymbol}
            {totalSpent.toFixed(2)}
          </span>
        </div>
        <div className="summary-item">
          <span>Remaining:</span>
          <span className="total-remaining">
            {currencySymbol}
            {(totalBudget - totalSpent).toFixed(2)}
          </span>
        </div>
      </div>

      <div className="budget-items">
        {budgets.length > 0 ? (
          budgets.map((budget) => {
            const spent = getSpentAmount(budget.category);
            const remaining = budget.amount - spent;
            const percentage = Math.min((spent / budget.amount) * 100, 100);

            return (
              <div key={budget._id} className="budget-item">
                <div className="budget-category">{budget.category}</div>
                <div className="budget-amount-row">
                  <span>
                    Budgeted: {currencySymbol}
                    {budget.amount.toFixed(2)}
                  </span>
                  <span>
                    Spent: {currencySymbol}
                    {spent.toFixed(2)}
                  </span>
                  <span className={remaining < 0 ? "over-budget" : ""}>
                    Remaining: {currencySymbol}
                    {remaining.toFixed(2)}
                  </span>
                </div>

                <div className="progress-container">
                  <div
                    className={`progress-bar ${
                      percentage > 90 ? "warning" : ""
                    } ${percentage >= 100 ? "over-limit" : ""}`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>

                <div className="budget-description">
                  {budget.description || "No description"}
                </div>

                <div className="budget-actions">
                  <button
                    className="budget-action edit"
                    onClick={() => handleEdit(budget)}
                    disabled={isDeleting}
                  >
                    Edit
                  </button>
                  <button
                    className="budget-action delete"
                    onClick={() => handleDelete(budget._id)}
                    disabled={isDeleting}
                  >
                    {isDeleting && deletingId === budget._id
                      ? "Deleting..."
                      : "Delete"}
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <p className="no-budgets">No budgets found for this month.</p>
        )}
      </div>

      {/* Edit Budget Modal */}
      {editingBudget && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Edit Budget</h3>
            <BudgetForm
              initialData={editingBudget}
              onSubmit={handleUpdate}
              onCancel={() => setEditingBudget(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetList;
