import React from "react";
import PropTypes from "prop-types";
import "./TransactionList.css";

const TransactionList = ({
  transactions,
  budgets,
  onEdit,
  onDelete,
  isDeleting,
  deletingId,
  currency = "$",
}) => {
  const getBudgetStatus = (category) => {
    const budget = budgets?.find((b) => b.category === category);
    if (!budget) return null;

    const spent = transactions
      .filter((t) => t.category === category && t.type === "expense")
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    const percentage = Math.min((spent / budget.amount) * 100, 100);

    return {
      text: `${currency}${spent.toFixed(
        2
      )} / ${currency}${budget.amount.toFixed(2)}`,
      isOver: percentage >= 100,
    };
  };

  return (
    <div className="transaction-list">
      <h3>Your Transactions</h3>
      {transactions.length === 0 ? (
        <p>No transactions found</p>
      ) : (
        <ul>
          {transactions.map((tx) => {
            const budgetStatus =
              tx.type === "expense" ? getBudgetStatus(tx.category) : null;

            return (
              <li key={tx._id} className={tx.type}>
                <div className="transaction-main">
                  <span className="transaction-title">{tx.category}</span>
                  <span className="transaction-amount">
                    {currency}
                    {tx.amount} ({tx.type})
                  </span>
                  <div className="transaction-actions">
                    <button
                      className="edit-button"
                      onClick={() => onEdit(tx)}
                      disabled={isDeleting}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => onDelete(tx._id)}
                      disabled={isDeleting}
                      aria-label={`Delete ${tx.title}`}
                    >
                      {isDeleting && deletingId === tx._id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </div>
                </div>
                {budgetStatus && (
                  <div
                    className={`budget-status ${
                      budgetStatus.isOver ? "over" : ""
                    }`}
                  >
                    Budget: {budgetStatus.text}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

TransactionList.propTypes = {
  transactions: PropTypes.array.isRequired,
  budgets: PropTypes.array.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  currency: PropTypes.string.isRequired,
};

export default TransactionList;
