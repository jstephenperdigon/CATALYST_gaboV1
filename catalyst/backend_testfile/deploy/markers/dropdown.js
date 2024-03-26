document.addEventListener("DOMContentLoaded", () => {
    const districtDropdown = document.getElementById("district");
    const barangayDropdown = document.getElementById("barangay");
    const selectButton = document.getElementById("selectButton");
    const cancelButton = document.getElementById("cancelButton");

    // Initially disable the Select and Cancel buttons
    selectButton.disabled = true;
    cancelButton.disabled = true;

    // Event listener for District dropdown change
    districtDropdown.addEventListener("change", () => {
        const selectedDistrict = districtDropdown.value;
        // Clear existing options
        barangayDropdown.innerHTML = '<option value="" selected disabled>Select Barangay</option>';

        // Populate barangay options based on selected district
        switch (selectedDistrict) {
            case "1":
                populateBarangay([1, 4, 7, 176]);
                break;
            case "2":
                populateBarangay([2, 5, 8]);
                break;
            case "3":
                populateBarangay([3, 6, 9]);
                break;
            default:
                // District not selected
                barangayDropdown.disabled = true;
                break;
        }
        // Enable/disable Select button based on District and Barangay selection
        validateSelection();
    });

    // Event listener for Barangay dropdown change
    barangayDropdown.addEventListener("change", () => {
        validateSelection();
    });

    // Event listener for Select button click
    selectButton.addEventListener("click", () => {
        selectButton.disabled = true;
        cancelButton.disabled = false;
    });

    // Event listener for Cancel button click
    cancelButton.addEventListener("click", () => {
        cancelButton.disabled = true;
        selectButton.disabled = false;
        // Reset dropdowns to initial state
        districtDropdown.value = "";
        barangayDropdown.innerHTML = '<option value="" selected disabled>Select Barangay</option>';
        barangayDropdown.disabled = true;
        // Disable Select button if both dropdowns are empty
        selectButton.disabled = true;
    });

    // Function to validate dropdown selection and enable/disable Select button
    function validateSelection() {
        if (districtDropdown.value !== "" && barangayDropdown.value !== "") {
            selectButton.disabled = false;
        } else {
            selectButton.disabled = true;
        }
    }

    // Function to populate Barangay dropdown
    function populateBarangay(barangayArray) {
        barangayArray.forEach(barangay => {
            const option = document.createElement("option");
            option.value = barangay;
            option.textContent = barangay;
            barangayDropdown.appendChild(option);
        });
        // Enable the Barangay dropdown after populating options
        barangayDropdown.disabled = false;
    }
});