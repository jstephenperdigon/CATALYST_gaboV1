// Check if accountId exists in session storage
document.addEventListener("DOMContentLoaded", function () {
  const accountId = sessionStorage.getItem("uid");
  if (!accountId) {
    // If accountId doesn't exist, redirect to index.html
    window.location.href = "monitor-indexSI.html";
  }
});

// Logout functionality (similar to login.js)
document.addEventListener("DOMContentLoaded", function () {
  // Check if logout link exists
  const logoutLink = document.getElementById("logout");
  if (logoutLink) {
    // Add click event listener to logout link
    logoutLink.addEventListener("click", function (event) {
      event.preventDefault(); // Prevent default link behavior

      // Remove accountId from session storage
      sessionStorage.removeItem("uid");

      // Redirect to index page
      window.location.href = "monitor-indexSI.html";
    });
  }
});
