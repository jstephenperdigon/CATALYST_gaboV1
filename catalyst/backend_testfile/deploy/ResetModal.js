// Close the modal
function closeModal() {
    resetModalState();
    document.getElementById("myModal").style.display = "none";
}

// Function to reset modal state
function resetModalState() {
    // Hide elements
    document.querySelector('.border-line').classList.add('hidden');
    document.getElementById('districtBarangayContainer').classList.add('hidden');
    document.getElementById('dateTimeContainer').classList.add('hidden');
    document.getElementById('confirmButton').classList.add('hidden');
    document.getElementById('cancelButton').classList.add('hidden');
    document.getElementById('collectorContainer').classList.add('hidden');

    // Enable next button and selectBarangayTxtField
    document.getElementById('nextButton').disabled = true;
    document.getElementById('selectBarangayTxtField').disabled = false;
    document.getElementById('selectBarangayTxtField').value = '';

    // Clear date, time, and collector dropdown values
    document.getElementById('scheduleDate').value = '';
    document.getElementById('scheduleTime').value = '';
    document.getElementById('collector').value = '';

    // Disable confirm button
    document.getElementById('confirmButton').disabled = true;
}