$(() => {
  //Start coding here!
  const users = [];
  const categories = [];

  $(document).ready(() => {
    $.ajax({
      method: "get",
      url: "http://localhost:3000/accounts",
      dataType: "json",
    }).done((data) => {
      $(".selectTag").append(new Option("select"));
      $.each(data, (i, user) => {
        users.push(user);
        $(".selectTag").append(new Option(user.username));
        $("#accountSummary").append(`
        <span>${user.username}</span>
        <span>${0}</span>
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
  });

  $(".radioBtn").on("change", function () {
    console.log($(this).val());
    if ($(this).val() === "Deposit" || $(this).val() === "Withdraw") {
      $("#accountSelect").show();
      $("#fromSelect").hide();
      $("#toSelect").hide();
    } else {
      $("#accountSelect").hide();
      $("#fromSelect").show();
      $("#toSelect").show();
    }
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
    $("#accountInfo").val().length > 0 &&
      !isExisting &&
      $.ajax({
        method: "POST",
        url: "http://localhost:3000/accounts",
        data: JSON.stringify({ newAccount: { username: inputVal } }),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
      }).done((data) => {
        console.log(data);
        $(".selectTag").append(new Option(inputVal));
        $("#accountSummary").append(`
        <div>
          <span>${inputVal}</span>
          <span>0</span>
        </div>
        `);
      });
    $("#accountInfo").val("");
  });
});
