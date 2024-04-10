$(document).ready(function () {
  // Handle click events on navigation links
  $(".nav-link").click(function (e) {
    e.preventDefault();
    var targetId = $(this).data("target");

    // Hide all content divs
    $("#reports, #summary").removeClass("active-content").addClass("hidden");

    // Show the selected content
    $("#" + targetId)
      .removeClass("hidden")
      .addClass("active-content");
  });
});
$(document).ready(function () {
  // Handle click events on collectors card
  $("#collectors-card").click(function (e) {
    e.preventDefault();
    // Remove "active" class from all nav links
    $(".nav_link").removeClass("active");
    // Add "active" class to collectors link
    $("#collectors-link").addClass("active");
  });
});
