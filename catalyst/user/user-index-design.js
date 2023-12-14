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

document.addEventListener("DOMContentLoaded", function () {
  const districtDropdown = document.getElementById("districtDropdown");
  const barangayDropdown = document.getElementById("barangayDropdown");

  // Define the mapping of districts to barangays
  const districtToBarangays = {
    District1: [
      "Brgy1",
      "Brgy2",
      "Brgy3",
      "Brgy4",
      "Brgy77",
      "Brgy78",
      "Brgy79",
      "Brgy80",
      "Brgy81",
      "Brgy82",
      "Brgy83",
      "Brgy84",
      "Brgy85",
      "Brgy132",
      "Brgy133",
      "Brgy134",
      "Brgy135",
      "Brgy136",
      "Brgy137",
      "Brgy138",
      "Brgy139",
      "Brgy140",
      "Brgy141",
      "Brgy142",
      "Brgy143",
      "Brgy144",
      "Brgy145",
      "Brgy146",
      "Brgy147",
      "Brgy148",
      "Brgy149",
      "Brgy150",
      "Brgy151",
      "Brgy152",
      "Brgy153",
      "Brgy154",
      "Brgy155",
      "Brgy156",
      "Brgy157",
      "Brgy158",
      "Brgy159",
      "Brgy160",
      "Brgy161",
      "Brgy162",
      "Brgy163",
      "Brgy164",
      "Brgy165",
      "Brgy166",
      "Brgy167",
      "Brgy168",
      "Brgy169",
      "Brgy170",
      "Brgy171",
      "Brgy172",
      "Brgy173",
      "Brgy174",
      "Brgy175",
      "Brgy176",
      "Brgy177",
    ],
    District2: [
      "Brgy5",
      "Brgy6",
      "Brgy7",
      "Brgy8",
      "Brgy9",
      "Brgy10",
      "Brgy11",
      "Brgy12",
      "Brgy13",
      "Brgy14",
      "Brgy15",
      "Brgy16",
      "Brgy17",
      "Brgy18",
      "Brgy19",
      "Brgy20",
      "Brgy21",
      "Brgy22",
      "Brgy23",
      "Brgy24",
      "Brgy25",
      "Brgy26",
      "Brgy27",
      "Brgy28",
      "Brgy29",
      "Brgy30",
      "Brgy31",
      "Brgy32",
      "Brgy33",
      "Brgy34",
      "Brgy35",
      "Brgy36",
      "Brgy37",
      "Brgy38",
      "Brgy39",
      "Brgy40",
      "Brgy41",
      "Brgy42",
      "Brgy43",
      "Brgy44",
      "Brgy45",
      "Brgy46",
      "Brgy47",
      "Brgy48",
      "Brgy49",
      "Brgy50",
      "Brgy51",
      "Brgy52",
      "Brgy53",
      "Brgy54",
      "Brgy55",
      "Brgy56",
      "Brgy57",
      "Brgy58",
      "Brgy59",
      "Brgy60",
      "Brgy61",
      "Brgy62",
      "Brgy63",
      "Brgy64",
      "Brgy65",
      "Brgy66",
      "Brgy67",
      "Brgy68",
      "Brgy69",
      "Brgy70",
      "Brgy71",
      "Brgy72",
      "Brgy73",
      "Brgy74",
      "Brgy75",
      "Brgy76",
      "Brgy86",
      "Brgy87",
      "Brgy88",
      "Brgy89",
      "Brgy90",
      "Brgy91",
      "Brgy92",
      "Brgy93",
      "Brgy94",
      "Brgy95",
      "Brgy96",
      "Brgy97",
      "Brgy98",
      "Brgy99",
      "Brgy100",
      "Brgy101",
      "Brgy102",
      "Brgy103",
      "Brgy104",
      "Brgy105",
      "Brgy106",
      "Brgy107",
      "Brgy108",
      "Brgy109",
      "Brgy110",
      "Brgy111",
      "Brgy112",
      "Brgy113",
      "Brgy114",
      "Brgy115",
      "Brgy116",
      "Brgy117",
      "Brgy118",
      "Brgy119",
      "Brgy120",
      "Brgy121",
      "Brgy123",
      "Brgy124",
      "Brgy125",
      "Brgy126",
      "Brgy127",
      "Brgy128",
      "Brgy129",
      "Brgy130",
      "Brgy131",
      "Brgy131",
    ],
    District3: [
      "Brgy178",
      "Brgy179",
      "Brgy180",
      "Brgy181",
      "Brgy182",
      "Brgy183",
      "Brgy184",
      "Brgy185",
      "Brgy186",
      "Brgy187",
      "Brgy188",
    ],
  };

  // Function to update the Barangay dropdown based on the selected District
  function updateBarangayDropdown() {
    const selectedDistrict = districtDropdown.value;
    const barangays = districtToBarangays[selectedDistrict] || [];

    // Clear existing options
    barangayDropdown.innerHTML =
      "<option selected disabled>Select Barangay</option>";

    // Add new options
    barangays.forEach((barangay) => {
      const option = document.createElement("option");
      option.value = barangay;
      option.text = `${barangay}`;
      barangayDropdown.appendChild(option);
    });
  }

  // Attach an event listener to the District dropdown
  districtDropdown.addEventListener("change", updateBarangayDropdown);
});
