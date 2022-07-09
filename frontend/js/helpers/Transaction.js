// original
class Transaction {
  constructor(amount, account) {
    this.amount = amount;
    this.account = account;
  }
  commit() {
    if (this.value < 0 && this.amount > this.account.balance) return;
    this.account.transactions.push(this.value);
  }
}

class Withdrawal extends Transaction {
  get value() {
    return -this.amount;
  }
}

class Deposit extends Transaction {
  get value() {
    return this.amount;
  }
}

class Transfer extends Transaction {
  constructor(accountIdFrom, accountIdTo) {
    super();
    this.accountIdFrom = accountIdFrom;
    this.accountIdTo = accountIdTo;
    // this.amount = amount;
  }
  get value() {
    return this.amount;
  }
  commitTransfer() {
    $.ajax({
      method: "get",
      url: "http://localhost:3000/accounts",
      dataType: "json",
    }).done((usersData) => {
      let fromUser;
      let toUser;
      $.each(usersData, (i, user) => {
        if (user.id === this.accountIdFrom) {
          fromUser = user;
        }
        if (user.id === this.accountIdTo) {
          toUser = user;
        }
      });
    });
  }
}
