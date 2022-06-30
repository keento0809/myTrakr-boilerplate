class Account {
  constructor(username) {
    this.username = username;
    this.transactions = [];
  }

  get balance() {
    return this.transactions.reduce((total, transaction) => {
      // original
      // return total + transaction;
      // test
      return total + Number(transaction.amount);
    }, 0);
  }
}
