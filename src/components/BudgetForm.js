import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import axios from "../services/api";
import "./BudgetForm.css";

const BudgetForm = ({ initialData, onSubmit, onCancel, onAdd }) => {
  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    month: format(new Date(), "yyyy-MM"),
    description: "",
  });
  const [categories, setCategories] = useState([
    "Food",
    "Transport",
    "Housing",
    "Entertainment",
    "Utilities",
    "Healthcare",
    "Other",
  ]);
  const [currencySymbol, setCurrencySymbol] = useState("$");
  const [error, setError] = useState(null);

  // Initialize form with initialData if in edit mode
  useEffect(() => {
    if (initialData) {
      setFormData({
        amount: initialData.amount.toString(),
        category: initialData.category,
        month: format(new Date(initialData.month), "yyyy-MM"),
        description: initialData.description || "",
      });
    }
  }, [initialData]);

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
  const resetForm = () => {
    setFormData({
      amount: "",
      category: "",
      month: format(new Date(), "yyyy-MM"),
      description: "",
    });
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const budgetData = {
        amount: parseFloat(formData.amount),
        category: formData.category,
        month: formData.month,
        description: formData.description,
      };

      if (initialData) {
        await onSubmit(budgetData);
      } else {
        // Create mode - call onAdd with new budget
        const res = await axios.post("/budgets", budgetData);
        // onAdd(res.data);
        // setFormData({
        //   amount: "",
        //   category: "",
        //   month: format(new Date(), "yyyy-MM"),
        //   description: "",
        // });
        onAdd(res.data.data || res.data); // Handle both response formats
        resetForm();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save budget");
      console.error("Error saving budget:", err);
    }
  };

  return (
    <div className="budget-form-container">
      <h3>Create New Budget</h3>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Amount ({currencySymbol})</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
          />
        </div>

        <div className="form-group">
          <label>Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Month</label>
          <input
            type="month"
            name="month"
            value={formData.month}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Description (Optional)</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn">
            {initialData ? "Update Budget" : "Create Budget"}
          </button>
          {initialData && (
            <button type="button" className="cancel-btn" onClick={onCancel}>
              Cancel
            </button>
          )}
        </div>

        {/* <button type="submit" className="submit-btn">
          Create Budget
        </button> */}
      </form>
    </div>
  );
};

export default BudgetForm;
