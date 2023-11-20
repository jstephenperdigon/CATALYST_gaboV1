import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyDAsGSaps-o0KwXTF-5q3Z99knmyXPmSfU",
    authDomain: "smartgarbagebin-8c3ec.firebaseapp.com",
    databaseURL: "https://smartgarbagebin-8c3ec-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "smartgarbagebin-8c3ec",
    storageBucket: "smartgarbagebin-8c3ec.appspot.com",
    messagingSenderId: "1062286948871",
    appId: "1:1062286948871:web:d62f6f620e010f8f22c8a2",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

document.getElementById("sendReportBtn").addEventListener("click", sendReport);
document.getElementById("searchButton").addEventListener("click", searchReports);

// Function to get the current date and time
function getCurrentDateTime() {
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return { date, time };
}

// Function to send a report
function sendReport() {
    const name = document.getElementById("name").value;
    const controlNumber = document.getElementById("controlNumber").value;
    const district = document.getElementById("district").value;
    const comment = document.getElementById("comment").value;

    const { date, time } = getCurrentDateTime();

    const reportsRef = ref(db, "Reports");
    push(reportsRef, {
        name: name,
        controlNumber: controlNumber,
        district: district,
        comment: comment,
        date: date,
        time: time,
    });

    document.getElementById("name").value = "";
    document.getElementById("controlNumber").value = "";
    document.getElementById("district").value = "";
    document.getElementById("comment").value = "";
}

// Function to display reports
function displayReports(reports) {
    const reportList = document.getElementById("reportList");
    reportList.innerHTML = ""; // Clear the existing list

    reports.forEach((report) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `<strong>Name:</strong> ${report.name}, 
                              <strong>Control Number:</strong> ${report.controlNumber}, 
                              <strong>District:</strong> ${report.district}, 
                              <strong>Comment:</strong> ${report.comment}, 
                              <strong>Date:</strong> ${report.date}, 
                              <strong>Time:</strong> ${report.time}`;
        reportList.appendChild(listItem);
    });
}

// Function to search reports
function searchReports() {
    const sortCriteria = document.getElementById("sortCriteria").value;
    const searchInput = document.getElementById("searchInput").value.toLowerCase();

    const reportsRef = ref(db, "Reports");
    onValue(reportsRef, (snapshot) => {
        const reports = [];
        snapshot.forEach((childSnapshot) => {
            const report = childSnapshot.val();
            reports.push(report);
        });

        let filteredReports;
        if (sortCriteria === "date" || sortCriteria === "time") {
            filteredReports = reports.sort((a, b) => a[sortCriteria].localeCompare(b[sortCriteria]));
        } else {
            filteredReports = reports.sort((a, b) => a[sortCriteria].localeCompare(b[sortCriteria]));
        }

        const result = filteredReports.filter((report) => {
            return (
                (sortCriteria === "name" && report.name.toLowerCase().includes(searchInput)) ||
                (sortCriteria === "controlNumber" && report.controlNumber.toLowerCase().includes(searchInput)) ||
                (sortCriteria === "district" && report.district.toLowerCase().includes(searchInput)) ||
                (sortCriteria === "date" && report.date.toLowerCase().includes(searchInput)) ||
                (sortCriteria === "time" && report.time.toLowerCase().includes(searchInput))
            );
        });

        displayReports(result);
    });
}



// Display all reports immediately when the page loads
searchReports();
