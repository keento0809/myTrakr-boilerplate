$(() => {
  //Start coding here!
  let users = [];
  let transactionType = "";

  $(document).ready(() => {
    $.ajax({
      method: "get",
      url: "http://localhost:3000/accounts",
      dataType: "json",
    }).done((data) => {
      // test
      $(".selectTag").append(new Option("select"));
      $("#accountSelect").empty();
      $("#accountSelect").append(new Option("all"));
      users = [];
      $.each(data, (i, user) => {
        let currentBalance = 0;
        for (let i = 0; i < user.transactions.length; i++) {
          currentBalance += Number(user.transactions[i].amount);
        }
        user.currentBalance = currentBalance;
        users.push(user);
        $(".selectTag").append(new Option(user.username));
        $("#accountSummary").append(`
        <div>
          <span>${user.username}</span>
          <span>${
            // original
            // user.transactions.length === 0 ? 0 : user.transactions[0].amount
            user.transactions.length === 0 ? 0 : currentBalance
          }</span>
        </div>
      `);
      });
      console.log(users);
    });

    $.ajax({
      method: "get",
      url: "http://localhost:3000/categories",
      dataType: "json",
    }).done((data) => {
      $("#categorySelect").append(new Option("select"));
      $.each(data, (i, category) => {
        $("#categorySelect").append(new Option(category.name.name));
      });
      $("#categorySelect").append(new Option("Add new.."));
    });
    $(".categorySec").hide();

    $.ajax({
      method: "get",
      url: "http://localhost:3000/transactions",
      dataType: "json",
    }).done((data) => {
      const newData = [];
      if (data.length > 0) {
        for (const key in data) {
          for (let i = 0; i < data[key].length; i++) {
            newData.push(data[key][i]);
          }
        }
      }
      data.length > 0 &&
        $.each(newData, (i, transactionData) => {
          $("#transactionTable").append(`
            <tr>
            <th>${transactionData.accountId}</th>
            <th>${transactionData.username}</th>
            <th>${transactionData.transactionType}</th>
            <th>${transactionData.category}</th>
            <th>${transactionData.description}</th>
            <th>${transactionData.amount}</th>
            <th>${transactionData.from}</th>
            <th>${transactionData.to}</th>
          </tr>
            `);
        });
    });
  });

  $(".radioBtn").on("change", function () {
    // test
    $(".radioBtn").prop("checked", false);
    console.log($(this).val());
    if ($(this).val() === "Deposit" || $(this).val() === "Withdraw") {
      $("#currentAccount").show();
      $("#fromSelect").hide();
      $("#toSelect").hide();
    } else {
      $("#currentAccount").hide();
      $("#fromSelect").show();
      $("#toSelect").show();
    }
    // test
    $(this).prop("checked", true);
    transactionType = $(this).val();
  });

  $("#categorySelect").on("change", function () {
    $(this).val() === "Add new.."
      ? $(".categorySec").show()
      : $(".categorySec").hide();
  });

  $("#addCategoryBtn").on("click", function () {
    const categoryInputVal = $("#categoryInput").val();
    categoryInputVal.length > 0 &&
      $.ajax({
        method: "POST",
        url: "http://localhost:3000/categories",
        data: JSON.stringify({ newCategory: { name: categoryInputVal } }),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
      }).done((data) => {
        $("#categorySelect").children("option:last-child").remove();
        $("#categorySelect").append(new Option(categoryInputVal));
        $("#categorySelect").append(new Option("Add new.."));
        $("#categoryInput").val("");
        $(".categorySec").hide();
        $("#categorySelect").val("select");
      });
  });

  $("#newAccount").on("submit", (e) => {
    e.preventDefault();
    const inputVal = $("#accountInfo").val();
    let isExisting = false;
    users.forEach((user) => {
      if (user.username == inputVal) {
        isExisting = true;
        alert("This user has already exist. Please change username.");
        $("#accountInfo").val("");
        return;
      }
    });
    // test
    const testUser = new Account(inputVal);
    console.log(testUser.balance);
    $("#accountInfo").val().length > 0 &&
      !isExisting &&
      $.ajax({
        method: "POST",
        url: "http://localhost:3000/accounts",
        data: JSON.stringify({
          newAccount: testUser,
        }),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
      }).done((data) => {
        // original
        // create new instance of Account
        // const newUser = new Account(data.username);
        // original
        // $(".selectTag").append(new Option(inputVal));
        // original
        // users.push(newUser);
        // test
        console.log(data);
        users.push(data);
        console.log(users);
        $(".selectTag").append(new Option(data.username));
        $("#accountSummary").append(`
        <div>
          <span>${inputVal}</span>
          <span>0</span>
        </div>
        `);
      });
    $("#accountInfo").val("");
  });

  $("#currentAccount").on("change", function () {
    const currentAccountVal = $("#currentAccount").val();
    console.log(currentAccountVal);
  });

  $("#accountSelect").on("change", function () {
    const defaultHTML = `
        <tr>
          <th>Id</th>
          <th>Username</th>
          <th>Transaction Type</th>
          <th>Category</th>
          <th>Description</th>
          <th>Amount</th>
          <th>From</th>
          <th>To</th>
        </tr>
    `;

    $("#transactionTable").html(defaultHTML);
    if ($("#accountSelect").val() === "all") {
      $.ajax({
        method: "get",
        url: "http://localhost:3000/transactions",
        dataType: "json",
      }).done((data) => {
        const newData = [];
        if (data.length > 0) {
          for (const key in data) {
            console.log(data[key]);
            for (let i = 0; i < data[key].length; i++) {
              newData.push(data[key][i]);
            }
          }
        }
        data.length > 0 &&
          $.each(newData, (i, transactionData) => {
            $("#transactionTable").append(`
              <tr>
              <th>${transactionData.accountId}</th>
              <th>${transactionData.username}</th>
              <th>${transactionData.transactionType}</th>
              <th>${transactionData.category}</th>
              <th>${transactionData.description}</th>
              <th>${transactionData.amount}</th>
              <th>${transactionData.from}</th>
              <th>${transactionData.to}</th>
            </tr>
              `);
          });
      });
    } else {
      const selectedUser = users.find(
        (user) => user.username === $("#accountSelect").val()
      );
      // original
      $.each(selectedUser.transactions, (i, data) => {
        $("#transactionTable").append(`
            <tr>
            <th>${data.accountId}</th>
            <th>${data.username}</th>
            <th>${data.transactionType}</th>
            <th>${data.category}</th>
            <th>${data.description}</th>
            <th>${data.amount}</th>
            <th>${data.from}</th>
            <th>${data.to}</th>
          </tr>
            `);
      });
    }
  });

  $("#transactionForm").on("submit", function (e) {
    e.preventDefault();

    if (
      (transactionType !== "Transfer" && $("#currentAccount").val() === "") ||
      (transactionType !== "Transfer" &&
        $("#currentAccount").val() === "select") ||
      $("#categorySelect").val() === "" ||
      $("#categorySelect").val() === "select" ||
      $("#categorySelect").val() === "" ||
      $("#amount").val() <= 0 ||
      $("#amount").val() === "" // ||
      // (transactionType === "Transfer" && $("#fromSelect").val() === "select") ||
      // $("#toSelect").val() === "select" ||
      // $("#fromSelect").val() === $("#toSelect").val()
    ) {
      alert("Invalid transaction");
      return;
    }

    let currentUserId;
    let fromUserId;
    let toUserId;

    for (let i = 0; i < users.length; i++) {
      console.log(users[i]);
      if (users[i].username == $("#currentAccount").val()) {
        currentUserId = users[i].id;
      }
      if (users[i].username == $("#fromSelect").val()) {
        fromUserId = users[i].id;
      }
      if (users[i].username == $("#toSelect").val()) {
        toUserId = users[i].id;
      }
    }

    const newTransactionObj = {
      accountId: transactionType !== "Transfer" ? currentUserId : "", // account ID for Deposits or Withdraws
      accountIdFrom: transactionType === "Transfer" ? fromUserId : null, // sender ID if type = 'Transfer', otherwise null
      accountIdTo: transactionType === "Transfer" ? toUserId : null, // receiver ID if type = 'Transfer', otherwise null
      id: transactionType !== "Transfer" ? currentUserId : "",
      username:
        transactionType === "Transfer" ? "" : $("#currentAccount").val(),
      transactionType: transactionType,
      category: $("#categorySelect").val(),
      description: $("#description").val(),
      amount:
        transactionType === "Withdraw"
          ? -$("#amount").val()
          : $("#amount").val(),
      from: transactionType === "Transfer" ? $("#fromSelect").val() : "",
      to: transactionType === "Transfer" ? $("#toSelect").val() : "",
    };

    const currUser = users.find(
      (user) => user.id === newTransactionObj.accountId
    );
    let fromUser;
    if (transactionType === "Transfer") {
      fromUser = users.find(
        (user) => user.id === newTransactionObj.accountIdFrom
      );
    }

    if (
      (transactionType === "Withdraw" &&
        $("#amount").val() > currUser.currentBalance) ||
      (transactionType === "Transfer" &&
        $("#amount").val() > fromUser.currentBalance)
    ) {
      alert("Cannot withdraw more than the amount in your account.");
      return;
    }

    const transactionUser =
      newTransactionObj.transactionType === "Deposit" ||
      newTransactionObj.transactionType === "Withdraw"
        ? users.find((user) => user.id === newTransactionObj.accountId)
        : "";

    switch (newTransactionObj.transactionType) {
      case "Deposit": {
        // const newTrans = new Deposit(newTransactionObj.amount, transactionUser);
        // newTrans.commit();
        break;
      }
      case "Withdraw": {
        console.log("withdrawing~~~~");
        // const newTrans = new Withdrawal(
        //   newTransactionObj.amount,
        //   transactionUser
        // );
        // newTrans.commit();
        break;
      }
      case "Transfer": {
        console.log("Boo");
        // const newT = new Transfer(
        //   newTransactionObj.accountIdFrom,
        //   newTransactionObj.accountIdTo
        //   // newTransactionObj.amount
        // );
        // newT.commitTransfer();
        break;
      }
    }
    console.log(newTransactionObj);

    $.ajax({
      method: "POST",
      url: "http://localhost:3000/transaction",
      data: JSON.stringify({
        newTransaction: newTransactionObj,
      }),
      dataType: "json",
      contentType: "application/json; charset=utf-8",
    }).done((data) => {
      // test
      $.ajax({
        method: "get",
        url: "http://localhost:3000/accounts",
        dataType: "json",
      }).done((data) => {
        users = [];
        $("#accountSummary").empty();
        $.each(data, (i, user) => {
          let currentBalance = 0;
          for (let i = 0; i < user.transactions.length; i++) {
            currentBalance += Number(user.transactions[i].amount);
          }
          user.currentBalance = currentBalance;
          users.push(user);
          $("#accountSummary").append(`
          <div>
            <span>${user.username}</span>
            <span>${
              // original
              // user.transactions.length === 0 ? 0 : user.transactions[0].amount
              user.transactions.length === 0 ? 0 : currentBalance
            }</span>
          </div>
        `);
        });
        console.log(users);
      });
      // if (
      //   $("#categorySelect").val() !== "select" &&
      //   $("#categorySelect").val() !== "select" &&
      //   $("#fromSelect").val() !== "select" &&
      //   $("#toSelect").val() !== "select"
      // ) {
      // transactionUser.transactions.push({
      //   accountId: data[0].accountId,
      //   accountIdFrom: data[0].accountIdFrom,
      //   accountIdTo: data[0].accountIdTo,
      //   username: data[0].username,
      //   transactionType: data[0].transactionType,
      //   category: data[0].category,
      //   description: data[0].description,
      //   amount: data[0].amount,
      //   from: data[0].from,
      //   to: data[0].to,
      // });
      // console.log(data, data[0].amount);
      // data[0].amount = -data[0].amount;
      // console.log(data[0].amount);
      $("#transactionTable").append(`
        <tr>
        <th>${data[0].accountId}</th>
        <th>${data[0].username}</th>
        <th>${data[0].transactionType}</th>
        <th>${data[0].category}</th>
        <th>${data[0].description}</th>
        <th>${data[0].amount}</th>
        <th>${data[0].from}</th>
        <th>${data[0].to}</th>
      </tr>
        `);
      if (data[0].transactionType === "Transfer") {
        $("#transactionTable").append(`
        <tr>
        <th>${data[1].accountId}</th>
        <th>${data[1].username}</th>
        <th>${data[1].transactionType}</th>
        <th>${data[1].category}</th>
        <th>${data[1].description}</th>
        <th>${data[1].amount}</th>
        <th>${data[1].from}</th>
        <th>${data[1].to}</th>
      </tr>
        `);
      }
      $("#currentAccount").val("select");
      $("#categorySelect").val("select");
      $("#categorySelect").val("select");
      $("#fromSelect").val("select");
      $("#toSelect").val("select");
      $("#description").val("");
      $("#amount").val("");
      $(".radioBtn").prop("checked", false);
    });
  });
});
