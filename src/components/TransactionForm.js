import api from "../services/api";
import AlertToast from "./AlertToast";
import React, { useEffect, useState, useRef } from "react";
import "./TransactionForm.css";
import { server } from "../remote/server";
import { AlertDialog } from "../utils/commonAppFunctions";
import AudioRecorder from "./AudioRecorder";

const TransactionForm = ({
  onAdd,
  onUpdate,
  editingTransaction,
  isEditing,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    type: "expense",
    category: "Uncategorized",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    severity: "info",
  });

  // Initialize form if editing
  useEffect(() => {
    if (isEditing && editingTransaction) {
      setFormData({
        title: editingTransaction.title,
        amount: editingTransaction.amount.toString(),
        type: editingTransaction.type,
        category: editingTransaction.category,
      });
    }
  }, [editingTransaction, isEditing]);

  const handleChange = (e) => {
    console.log("title");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({
      title: "",
      amount: "",
      type: "expense",
      category: "Uncategorized",
    });
  };

  const handleCloseAlert = () => {
    setAlert({ ...alert, show: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    //setAlert({ ...alert, show: false });
    setIsSubmitting(true);

    // Validation
    if (!formData.title.trim()) {
      setError("Title is required");
      setIsSubmitting(false);
      return;
    }

    if (!formData.amount || isNaN(formData.amount)) {
      setError("Please enter a valid amount");
      setIsSubmitting(false);
      return;
    }

    const transactionData = {
      title: formData.title,
      amount: parseFloat(formData.amount),
      type: formData.type,
      category: formData.category,
    };

    try {
      if (isEditing) {
        await onUpdate(transactionData);
      } else {
        const response = await api.post("/transactions", transactionData);

        //Check for budget warning in the response
        // console.log(response.data);
        // if (response.data) {
        //   const { transaction, warning } = response.data;
        //   const { message, level, forecastedSpending } = warning;

        //   setAlert({
        //     show: true,
        //     message: message + " " || `Budget alert: ${level.toUpperCase()}`,
        //     severity: level === "critical" ? "error" : "warning",
        //   });
        // }

        // Only show alert if warning exists (amount ≥90%)
        if (response.data?.warning) {
          const { message, level } = response.data.warning;
          setAlert({
            show: true,
            message: message + " " || `Budget alert: ${level.toUpperCase()}`,
            severity: level === "critical" ? "error" : "warning",
          });
        }

        await onAdd(response.data);
        resetForm();
      }
    } catch (err) {
      console.error("Transaction error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to process transaction. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="transaction-form-container">
      <form>
        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label>Title*</label>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Groceries, Salary, etc."
            required
          />

          <AudioRecorder
            handleChange={handleChange}
            name="title"
            setIsSubmitting={setIsSubmitting}
            isSubmitting={isSubmitting}
          />
        </div>

        <div className="form-group">
          <label>Amount*</label>
          <input
            name="amount"
            type="number"
            value={formData.amount}
            onChange={handleChange}
            placeholder="0.00"
            step="0.01"
            min="0"
            required
          />
          <AudioRecorder
            handleChange={handleChange}
            name="amount"
            setIsSubmitting={setIsSubmitting}
            isSubmitting={isSubmitting}
          />
        </div>

        <div className="form-group">
          <label>Type*</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
          <AudioRecorder
            handleChange={handleChange}
            name="type"
            setIsSubmitting={setIsSubmitting}
            isSubmitting={isSubmitting}
          />
        </div>

        <div className="form-group">
          <label>Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="Uncategorized">Select Category</option>
            <option value="Food">Food</option>
            <option value="Transport">Transport</option>
            <option value="Housing">Housing</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Utilities">Utilities</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Other">Other</option>
          </select>
          <AudioRecorder
            handleChange={handleChange}
            name="category"
            setIsSubmitting={setIsSubmitting}
            isSubmitting={isSubmitting}
          />
        </div>

        <div className="form-actions">
          <button
            type="submit"
            disabled={isSubmitting}
            className={isSubmitting ? "submitting" : ""}
            onClick={handleSubmit}
          >
            {isSubmitting ? (
              <span className="spinner"></span>
            ) : isEditing ? (
              "Update Transaction"
            ) : (
              "Add Transaction"
            )}
          </button>

          {isEditing && (
            <button type="button" onClick={onCancel} className="cancel-btn">
              Cancel
            </button>
          )}
        </div>
      </form>

      <AlertDialog
        open={alert.show}
        message={alert.message}
        severity={alert.severity}
        onClose={handleCloseAlert}
      />
    </div>
  );
};

export default TransactionForm;
