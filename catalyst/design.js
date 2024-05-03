// Function to highlight the active link
function highlightActiveLink() {
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".nav-link");

  sections.forEach((section, index) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;

    if (
      window.scrollY >= sectionTop - sectionHeight / 2 &&
      window.scrollY < sectionTop + sectionHeight / 2
    ) {
      // Add 'active' class to the corresponding nav link
      navLinks.forEach((link) => {
        link.classList.remove("active");
      });
      navLinks[index].classList.add("active");
    }
  });
}

// Event listener for scroll
window.addEventListener("scroll", highlightActiveLink);

// Initial highlighting on page load
document.addEventListener("DOMContentLoaded", highlightActiveLink);
AOS.init();

// Add event listener to show modal when "Download APK" button is clicked
document.addEventListener("DOMContentLoaded", function () {
  // Select the "Download APK" button
  var downloadButton = document.querySelector(".download-apk-button");

  // Add event listener to the button
  downloadButton.addEventListener("click", function () {
    // Show the modal when the button is clicked
    var downloadModal = new bootstrap.Modal(
      document.getElementById("downloadModal")
    );
    downloadModal.show();
  });
});
