//common functions that can be used in different cases

export const domainUrl = "https://my-trakr-jp.herokuapp.com/";

$("#categorySelect").on("change", function () {
  $(this).val() === "Add new.."
    ? $(".categorySec").show()
    : $(".categorySec").hide();
});

$("#addCategoryBtn").on("click", function () {
  if ($("#categoryInput").val() === "") {
    alert("Invalid category. input value must not be blank.");
    return;
  }
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
      $("#successAlert")
        .html(`<strong>Category: ${data.name.name}</strong> has successfully done!
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
    });
});

// jQuery regarding css accordionBtnForTransac
$("#accordionBtn").on("click", function () {
  $("#toggleNewAccountForm").toggle();
  $("#accordionBtn").toggleClass("hidden");
  $("#upBtnNewAccount").toggleClass("hidden");
});
$("#upBtnNewAccount").on("click", function () {
  $("#toggleNewAccountForm").toggle();
  $("#accordionBtn").toggleClass("hidden");
  $("#upBtnNewAccount").toggleClass("hidden");
});
$("#accordionBtnForTransac").on("click", function () {
  $("#toggleTransac").toggle();
  $("#accordionBtnForTransac").toggleClass("hidden");
  $("#upBtnTransac").toggleClass("hidden");
});
$("#upBtnTransac").on("click", function () {
  $("#toggleTransac").toggle();
  $("#accordionBtnForTransac").toggleClass("hidden");
  $("#upBtnTransac").toggleClass("hidden");
});
$("#accordionBtnForSummary").on("click", function () {
  $("#toggleSummary").toggle();
  $("#accordionBtnForSummary").toggleClass("hidden");
  $("#upBtnSummary").toggleClass("hidden");
});
$("#upBtnSummary").on("click", function () {
  $("#toggleSummary").toggle();
  $("#accordionBtnForSummary").toggleClass("hidden");
  $("#upBtnSummary").toggleClass("hidden");
});

// close alert manually
$("#closeAlert").on("click", function () {
  $("#successAlert").removeClass("show");
});
