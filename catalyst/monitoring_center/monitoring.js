document.addEventListener("DOMContentLoaded", function (event) {
  const showNavbar = (toggleId, navId, bodyId, headerId) => {
    const toggle = document.getElementById(toggleId),
      nav = document.getElementById(navId),
      bodypd = document.getElementById(bodyId),
      headerpd = document.getElementById(headerId);

    // Validate that all variables exist
    if (toggle && nav && bodypd && headerpd) {
      toggle.addEventListener("click", () => {
        // show navbar
        nav.classList.toggle("show");

        // add padding to header
        headerpd.classList.toggle("body-pd");
      });
    }
  };

  showNavbar("header-toggle", "nav-bar", "body-pd", "header");

  //Function for Account Counter

  /*===== LINK ACTIVE =====*/
  const linkColor = document.querySelectorAll(".nav_link");

  function colorLink() {
    if (linkColor) {
      linkColor.forEach((l) => l.classList.remove("active1"));
      this.classList.add("active1");
    }
  }
  linkColor.forEach((l) => l.addEventListener("click", colorLink));

  // Your code to run since DOM is loaded and ready
});

// JavaScript to handle navigation and content visibility
document.addEventListener("DOMContentLoaded", function () {
  // Set initial content visibility
  document.getElementById("welcome-content").style.display = "block";
  document.getElementById("map-content").style.display = "none";
  document.getElementById("reports-content").style.display = "none";
  document.getElementById("collector-content").style.display = "none";
  // Handle clicks on navigation links
  document
    .getElementById("welcome-link")
    .addEventListener("click", function () {
      showContent("welcome");
    });

  // Handle clicks on navigation links
  document.getElementById("map-link").addEventListener("click", function () {
    showContent("map");
  });

  document
    .getElementById("collectors-link")
    .addEventListener("click", function () {
      showContent("collector");
    });

  document
    .getElementById("reports-link")
    .addEventListener("click", function () {
      showContent("reports");
    });

  document
    .getElementById("collectors-card")
    .addEventListener("click", function () {
      showContent("collector");
    });

  // Function to show/hide content based on the selected link
  function showContent(contentId) {
    // Hide all content
    document.getElementById("welcome-content").style.display = "none";
    document.getElementById("map-content").style.display = "none";
    document.getElementById("reports-content").style.display = "none";

    document.getElementById("collector-content").style.display = "none";
    // Show the selected content
    document.getElementById(contentId + "-content").style.display = "block";
  }
});


    function toggleAdditionalGCNs() {
        var additionalGCNs = document.getElementById("additionalGCNs");
        if (additionalGCNs.style.display === "none") {
          additionalGCNs.style.display = "block";
        } else {
          additionalGCNs.style.display = "none";
        }
      }
