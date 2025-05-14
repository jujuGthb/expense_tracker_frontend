import React, { useState, useEffect } from "react";
import TransactionForm from "../components/TransactionForm";
import TransactionList from "../components/TransactionList";
import axios from "../services/api";
import "./Transactions.css";

const Transactions = ({ onDataChange }) => {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currencySymbol, setCurrencySymbol] = useState("$");

  const handleAddTransaction = async (newTransaction) => {
    try {
      const response = await axios.post("/transactions", newTransaction);
      setTransactions((prev) => [response.data, ...prev]);
      if (onDataChange) onDataChange(); // Notify parent of data change
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [transactionsRes, budgetsRes] = await Promise.all([
        axios.get("/transactions"),
        axios.get("/budgets"),
      ]);

      setTransactions(transactionsRes.data?.data || transactionsRes.data || []);
      setBudgets(budgetsRes.data?.data || budgetsRes.data || []);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch data:", err);
      setError("Failed to load transactions");
      setTransactions([]);
      setBudgets([]);
    } finally {
      setIsLoading(false);
    }
  };
  // Fetch currency from profile
  useEffect(() => {
    const fetchCurrency = async () => {
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
    fetchCurrency();
  }, []);

  const handleDeleteTransaction = async (transactionId) => {
    try {
      setDeletingId(transactionId);
      setIsDeleting(true);

      await axios.delete(`/transactions/${transactionId}`);

      setTransactions((prev) => prev.filter((tx) => tx._id !== transactionId));
      setError(null);
    } catch (err) {
      console.error("Failed to delete transaction:", err);
      setError("Failed to delete transaction. Please try again.");
    } finally {
      setIsDeleting(false);
      setDeletingId(null);
    }
  };

  // Function to handle edit
  const handleEdit = (tx) => {
    setEditingTransaction(tx);
    setIsEditing(true);
  };

  // Function to handle update
  const handleUpdate = async (updatedData) => {
    try {
      const res = await axios.put(
        `/transactions/${editingTransaction._id}`,
        updatedData
      );

      setTransactions(
        transactions.map((tx) =>
          tx._id === editingTransaction._id ? res.data : tx
        )
      );

      setEditingTransaction(null);
      setIsEditing(false);
      if (onDataChange) onDataChange();
    } catch (err) {
      console.error("Update error:", err);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const filteredTransactions = Array.isArray(transactions)
    ? transactions.filter((tx) => filter === "all" || tx.type === filter)
    : [];

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortBy === "newest") return new Date(b.date) - new Date(a.date);
    if (sortBy === "oldest") return new Date(a.date) - new Date(b.date);
    return b.amount - a.amount;
  });

  if (isLoading) return <div className="loading">Loading transactions...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="transactions-container">
      <h2 className="page-title">Transactions</h2>

      <div className="transaction-controls">
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="amount">By Amount</option>
        </select>
      </div>

      <div className="transaction-form-container">
        <TransactionForm
          onAdd={handleAddTransaction}
          onUpdate={handleUpdate}
          editingTransaction={editingTransaction}
          isEditing={isEditing}
          onCancel={() => {
            setEditingTransaction(null);
            setIsEditing(false);
          }}
        />
      </div>

      <div className="transaction-list-container">
        <TransactionList
          transactions={sortedTransactions}
          budgets={budgets}
          onEdit={handleEdit}
          onDelete={handleDeleteTransaction}
          isDeleting={isDeleting}
          deletingId={deletingId}
          currency={currencySymbol}
        />
      </div>
    </div>
  );
};

export default Transactions;
