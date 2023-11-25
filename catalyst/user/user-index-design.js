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
        navItem.classList.remove("active-btn");
      });

      // Select the clicked navigation item
      this.classList.add("active-btn");
    });
  });
});

// Function for input fields if other is selected
function toggleOtherIssueFields() {
  var issueType = document.getElementById("issueType").value;
  var otherIssueFields = document.getElementById("otherIssueFields");
  var reportDescription = document.getElementById("reportDescription");

  if (issueType === "other") {
    otherIssueFields.style.display = "block";
    reportDescription.style.display = "none"; // Hide reportDescription when otherIssueFields is displayed
  } else {
    otherIssueFields.style.display = "none";
    reportDescription.style.display = issueType !== "" ? "block" : "none"; // Show/hide reportDescription based on the selected issueType
  }
}

// Get the select element and reportDescription input field
const issueTypeSelect = document.getElementById("issueType");

// Event listener to handle changes in the selected option
issueTypeSelect.addEventListener("change", function () {
  // Set the display of reportDescription based on whether any option is selected
  toggleOtherIssueFields();
});

// Validation function when submitting the form
function submitForm() {
  var selectedIssue = document.getElementById("issueType").value;
  var otherIssueDescription = document.getElementById(
    "otherIssueDescription"
  ).value;

  var swalConfig = {
    icon: "warning",
    title: "Oops...",
    width: "80%", // Adjust the width as needed
  };

  if (selectedIssue === "") {
    swalConfig.text = "Please select an issue before submitting.";
  } else if (selectedIssue === "other" && !otherIssueDescription.trim()) {
    swalConfig.text = "Please describe the 'Other' issue before submitting.";
  } else {
    swalConfig.icon = "success";
    swalConfig.title = "Success!";
    swalConfig.text = "Thank you for reporting the issue.";
    // You can add additional logic here to handle the form submission
  }

  Swal.fire(swalConfig);
}

$(document).ready(function () {
  $('[data-toggle="popover"]').popover({
    container: "body",
    html: true,
    content: function () {
      // Add the content you want to show in the popover
      return "<div>Notification Content</div>";
    },
  });
});
