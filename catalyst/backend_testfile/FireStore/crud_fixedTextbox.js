// Import Firestore functions and configuration
import { db, getDocs, addDoc, collection, doc, updateDoc, deleteDoc } from "./connection/firebaseConfig.js";

// Define the Firestore collection
const accountCollection = collection(db, "Account");

// Function to fetch and display all user accounts
async function displayUserAccounts() {
  const querySnapshot = await getDocs(accountCollection);
  const userList = document.getElementById("userList");
  userList.innerHTML = '';

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const userId = doc.id;

    const listItem = document.createElement("li");
    listItem.textContent = `Username: ${data.username}, Password: ${data.password}`;
    
    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.addEventListener("click", () => {
        populateEditForm(userId, data.username, data.password);
    });

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => {
        deleteUserAccount(userId);
    });

    listItem.appendChild(editButton);
    listItem.appendChild(deleteButton);
    userList.appendChild(listItem);
  });
}

// Function to populate the edit form with user data for a specific user ID
function populateEditForm(userId, username, password) {
  document.getElementById("editUserId").value = userId;
  document.getElementById("username").value = username;
  document.getElementById("password").value = password;
}

// Function to handle editing a user's username and password
document.getElementById("addEditUserForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const userId = document.getElementById("editUserId").value;
  const newUsername = document.getElementById("username").value;
  const newPassword = document.getElementById("password").value;

  if (!userId) {
    // Add a new user
    addNewUser(newUsername, newPassword);
  } else {
    // Edit an existing user
    editUser(userId, newUsername, newPassword);
  }
});

// Function to handle adding a new user account
function addNewUser(username, password) {
  addDoc(accountCollection, {
    username: username,
    password: password
  })
  .then(function (docRef) {
    console.log("User account added successfully.");
    document.getElementById("addEditUserForm").reset();
    displayUserAccounts();
  })
  .catch(function (error) {
    console.error("Error adding user account: ", error);
  });
}

// Function to handle editing a user's username and password
function editUser(userId, newUsername, newPassword) {
  const docRef = doc(accountCollection, userId);
  updateDoc(docRef, {
    username: newUsername,
    password: newPassword
  })
  .then(function () {
    console.log("User account updated successfully.");
    document.getElementById("addEditUserForm").reset();
    displayUserAccounts();
  })
  .catch(function (error) {
    console.error("Error updating user account: ", error);
  });
}

// Function to handle deleting a user account
function deleteUserAccount(userId) {
  const docRef = doc(accountCollection, userId);
  deleteDoc(docRef)
  .then(function () {
    console.log("User account deleted successfully.");
    document.getElementById("deleteUserForm").reset();
    displayUserAccounts();
  })
  .catch(function (error) {
    console.error("Error deleting user account: ", error);
  });
}

// Call the function to display user accounts on page load
displayUserAccounts();
