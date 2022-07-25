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
      $(".selectTag").append(new Option("select"));
      $("#accountSelect").empty();
      $("#accountSelect").append(new Option("all"));
      users = [];
      $.each(data, (i, user) => {
        users.push(user);
        const newClassUser = new Account(user.username);
        newClassUser.transactions = user.transactions;
        $(".selectTag").append(new Option(newClassUser.username));
        $("#accountSummary").append(`
        <li class="list-group-item">
          <span>Name: </span>
          <span>${newClassUser.username}</span>
          <span>${newClassUser.balance}</span>
        </li>
      `);
      });
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
            <tr scope="row">
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

  // radio button
  $(".radioBtn").on("change", function () {
    $(".radioBtn").prop("checked", false);
    if ($(this).val() === "Deposit" || $(this).val() === "Withdraw") {
      $("#currentAccount").show();
      $("#currentAccountLabel").show();
      $("#fromSelect").hide();
      $("#toSelect").hide();
      $("#fromSelectLabel").hide();
      $("#toSelectLabel").hide();
    } else {
      $("#currentAccount").hide();
      $("#currentAccountLabel").hide();
      $("#fromSelect").show();
      $("#toSelect").show();
      $("#fromSelectLabel").show();
      $("#toSelectLabel").show();
    }
    // test
    $(this).prop("checked", true);
    transactionType = $(this).val();
  });

  $("#newAccount").on("submit", (e) => {
    e.preventDefault();
    if ($("#accountInfo").val() === "") {
      alert("Invalid account name. It must not be empty.");
      return;
    }
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
    const testUser = new Account(inputVal);
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
        $("#successAlert")
          .html(`<strong>${data.username}</strong> is added as a new account! Check out account
        summary.
        <button
          id="closeAlert"
          type="button"
          class="close"
          data-dismiss="alert"
          aria-label="Close"
        >
          <span aria-hidden="true">&times;</span>
        </button>
        `);
        $("#successAlert").addClass("show");
        setTimeout(function () {
          $("#successAlert").removeClass("show");
        }, 2500);
        users.push(data);
        $(".selectTag").append(new Option(data.username));
        $("#accountSummary").append(`
        <li class="list-group-item">
          <span>Name: </span>
          <span>${inputVal}</span>
          <span>0</span>
        </li>
        `);
      });
    $("#accountInfo").val("");
  });

  // $("#currentAccount").on("change", function () {
  //   const currentAccountVal = $("#currentAccount").val();
  // });

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
            for (let i = 0; i < data[key].length; i++) {
              newData.push(data[key][i]);
            }
          }
        }
        data.length > 0 &&
          $.each(newData, (i, transactionData) => {
            $("#transactionTable").append(`
              <tr scope="row">
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
      $.each(selectedUser.transactions, (i, data) => {
        $("#transactionTable").append(`
            <tr scope="row">
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
      $("#amount").val() === ""
    ) {
      alert("Invalid transaction. Please fill out all sections and try again.");
      return;
    }

    let currentUser;
    let currentUserId;
    let fromUserId;
    let toUserId;
    let classCurrUser;
    let classFromUser;
    let fromUser;

    for (let i = 0; i < users.length; i++) {
      if (users[i].username == $("#currentAccount").val()) {
        currentUserId = users[i].id;
        currentUser = users[i];
      }
      if (users[i].username == $("#fromSelect").val()) {
        fromUserId = users[i].id;
      }
      if (users[i].username == $("#toSelect").val()) {
        toUserId = users[i].id;
      }
    }
    // test
    let amountVal = 0;
    if (transactionType === "Deposit") {
      const newT = new Deposit($("#amount").val(), currentUser);
      amountVal = newT.value;
    } else if (transactionType === "Withdraw") {
      const newT = new Withdrawal($("#amount").val(), currentUser);
      amountVal = newT.value;
    } else {
      amountVal = $("#amount").val();
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
      amount: amountVal,
      from: transactionType === "Transfer" ? $("#fromSelect").val() : "",
      to: transactionType === "Transfer" ? $("#toSelect").val() : "",
    };

    const currUser = users.find(
      (user) => user.id === newTransactionObj.accountId
    );

    if (currUser) {
      classCurrUser = new Account(currUser.username);
      classCurrUser.transactions = currUser.transactions;
    }

    if (transactionType === "Transfer") {
      fromUser = users.find(
        (user) => user.id === newTransactionObj.accountIdFrom
      );
      classFromUser = new Account(fromUser.username);
      classFromUser.transactions = fromUser.transactions;
    }

    if (
      (transactionType === "Withdraw" &&
        $("#amount").val() > classCurrUser.balance) ||
      (transactionType === "Transfer" &&
        $("#amount").val() > classFromUser.balance)
    ) {
      alert("Cannot withdraw more than the amount in your account.");
      return;
    }

    $.ajax({
      method: "POST",
      url: "http://localhost:3000/transaction",
      data: JSON.stringify({
        newTransaction: newTransactionObj,
      }),
      dataType: "json",
      contentType: "application/json; charset=utf-8",
    }).done((transactionData) => {
      $.ajax({
        method: "get",
        url: "http://localhost:3000/accounts",
        dataType: "json",
      }).done((data) => {
        users = [];

        $("#accountSummary").empty();
        $.each(data, (i, user) => {
          users.push(user);
          const newClassUser = new Account(user.username);
          newClassUser.transactions = user.transactions;
          $("#accountSummary").append(`
              <li class="list-group-item">
                <span>Name: </span>
                <span>${newClassUser.username}</span>
                <span>${newClassUser.balance}</span>
              </li>
            `);
        });
      });
      $("#successAlert")
        .html(`<strong>Transaction: ${transactionData[0].transactionType}</strong> has successfully done!
      <button
        id="closeAlert"
        type="button"
        class="close"
        data-dismiss="alert"
        aria-label="Close"
      >
        <span aria-hidden="true">&times;</span>
      </button>
      `);
      $("#successAlert").addClass("show");
      setTimeout(function () {
        $("#successAlert").removeClass("show");
      }, 2500);

      const details = transactionData;

      $.each(details, (i, data) => {
        $("#transactionTable").append(`
        <tr scope="row">
        <th>${data.accountId}</th>
        <th>${data.username}</th>
        <th>${data.transactionType}</th>
        <th>${data.category}</th>
        <th>${data.description}</th>
        <th>${data.amount}</th>
        <th>${data.from}</th>
        <th>${data.to}</th>
      </tr>
      })
        `);
      });

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
