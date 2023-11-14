// Add event listener to the district dropdown
document.getElementById("districtDropdown").addEventListener("change", (event) => {
    const selectedDistrict = event.target.value;
    // Update user data with the selected district
    userData.district = selectedDistrict;
    // Update the label of the district dropdown button
    document.getElementById("districtDropdownButtonLabel").textContent = `District: ${selectedDistrict}`;
  });
  
  // Add event listener to the barangay dropdown
  document.getElementById("barangayDropdown").addEventListener("change", (event) => {
    const selectedBarangay = event.target.value;
    // Update user data with the selected barangay
    userData.barangay = selectedBarangay;
    // Update the label of the barangay dropdown button
    document.getElementById("barangayDropdownButtonLabel").textContent = `Barangay: ${selectedBarangay}`;
  });