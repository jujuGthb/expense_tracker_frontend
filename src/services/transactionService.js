// import api from "./api";

// export const createTransactionWithWarningCheck = async (transactionData) => {
//   try {
//     // First create the transaction
//     const transactionResponse = await api.post(
//       "/transactions",
//       transactionData
//     );

//     // If it's an expense, check for budget warnings
//     if (transactionData.type === "expense") {
//       try {
//         const warningResponse = await api.get("/budgets/warning", {
//           params: {
//             category: transactionData.category,
//             amount: transactionData.amount,
//           },
//         });

//         // Return both transaction data and warning
//         return {
//           ...transactionResponse.data,
//           warning: warningResponse.data.warning,
//         };
//       } catch (warningError) {
//         // If warning check fails, still return the transaction
//         console.error("Budget warning check failed:", warningError);
//         return transactionResponse.data;
//       }
//     }

//     return transactionResponse.data;
//   } catch (error) {
//     throw error;
//   }
// };

// // Regular transaction functions
// export const getTransactions = () => api.get("/transactions");
// export const updateTransaction = (id, data) =>
//   api.put(`/transactions/${id}`, data);
// export const deleteTransaction = (id) => api.delete(`/transactions/${id}`);
