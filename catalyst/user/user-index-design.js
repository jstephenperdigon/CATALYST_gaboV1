// Add event listener to the district dropdown
document
  .getElementById("districtDropdown")
  .addEventListener("change", (event) => {
    const selectedDistrict = event.target.value;
    // Update user data with the selected district
    userData.district = selectedDistrict;
    // Update the label of the district dropdown button
    document.getElementById(
      "districtDropdownButtonLabel"
    ).textContent = `District: ${selectedDistrict}`;
  });

// Add event listener to the barangay dropdown
document
  .getElementById("barangayDropdown")
  .addEventListener("change", (event) => {
    const selectedBarangay = event.target.value;
    // Update user data with the selected barangay
    userData.barangay = selectedBarangay;
    // Update the label of the barangay dropdown button
    document.getElementById(
      "barangayDropdownButtonLabel"
    ).textContent = `Barangay: ${selectedBarangay}`;
  });

// Bottom Nav
document.addEventListener("DOMContentLoaded", function () {
  const contentSections = document.querySelectorAll(".content");
  const navItems = document.querySelectorAll(".icon");

  // Hide all content sections initially
  contentSections.forEach((section) => {
    section.style.display = "none";
  });

  // Show the default content section (Home) and mark it as selected
  document.getElementById("home").style.display = "block";

  navItems.forEach((item) => {
    item.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href").substring(1);

      // Hide all content sections
      contentSections.forEach((section) => {
        section.style.display = "none";
      });

      // Display the selected content section
      document.getElementById(targetId).style.display = "block";

      // Deselect all navigation items
      navItems.forEach((navItem) => {
        navItem.classList.remove("active");
      });

      // Select the clicked navigation item
      this.classList.add("active");
    });
  });
});
