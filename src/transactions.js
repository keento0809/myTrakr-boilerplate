import { getAccounts } from "./accounts.js";

let transactionCounter = 0;
export const addTransaction = (transaction) => {
  const newTransactions = [];
  const accounts = getAccounts();
  accounts.forEach((account) => {
    if (
      account.id == transaction.accountIdFrom ||
      account.id == transaction.accountIdTo ||
      account.id == transaction.accountId
    ) {
      transactionCounter++;
      let newTransaction = { ...transaction, id: transactionCounter };
      if (account.id == transaction.accountIdFrom) {
        newTransaction.accountId = transaction.accountIdFrom;
        newTransaction.amount = -transaction.amount;
      }
      if (account.id == transaction.accountIdTo) {
        newTransaction.accountId = transaction.accountIdTo;
      }
      // original
      account.transactions.push(newTransaction);
      newTransactions.push(newTransaction);
    }
  });
  return newTransactions;
};

export const getAllTransactions = () => {
  const accounts = getAccounts();
  let allTransactions = [];
  accounts.forEach((account) => {
    allTransactions = [...allTransactions, account.transactions];
  });
  return allTransactions;
};

export default { addTransaction, getAllTransactions };
