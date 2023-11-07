// Import Firebase Firestore functions
import { db, getDocs, addDoc, collection, doc, updateDoc, deleteDoc } from "./connection/firebaseConfig.js";

// Get references to form elements
const addUserForm = document.getElementById("addUserForm");
const editUserForm = document.getElementById("editUserForm");
const deleteUserForm = document.getElementById("deleteUserForm");

const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

const editUserIdInput = document.getElementById("editUserId");
const editUsernameInput = document.getElementById("editUsername");
const editPasswordInput = document.getElementById("editPassword");

const addUserFormTitle = document.getElementById("addUserFormTitle");

// Define a variable to keep track of whether you're in "Add" or "Edit" mode
let isEditMode = false;

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

// Function to populate the form for editing
function populateEditForm(userId, username, password) {
  isEditMode = true;
  editUserIdInput.value = userId;
  editUsernameInput.value = username;
  editPasswordInput.value = password;
  addUserFormTitle.textContent = "Edit User Account";
  editUserForm.style.display = "block";
}

// Function to reset the form and toggle back to "Add" mode
function resetFormAndToggleAddMode() {
  isEditMode = false;
  addUserForm.reset();
  editUserForm.style.display = "none";
  addUserFormTitle.textContent = "Add User Account";
}

// Function to handle form submission (both Add and Edit)
addUserForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const username = usernameInput.value;
  const password = passwordInput.value;

  if (isEditMode) {
    // If in Edit mode, update the user's data
    const userId = editUserIdInput.value;
    const newUsername = editUsernameInput.value;
    const newPassword = editPasswordInput.value;

    const docRef = doc(db, "Account", userId);
    updateDoc(docRef, {
      username: newUsername,
      password: newPassword
    })
      .then(function () {
        console.log("User account updated successfully.");
        resetFormAndToggleAddMode();
        displayUserAccounts();
      })
      .catch(function (error) {
        console.error("Error updating user account: ", error);
      });
  } else {
    // If in Add mode, add a new user account to Firestore
    addDoc(accountCollection, {
      username: username,
      password: password
    })
      .then(function (docRef) {
        console.log("User account added successfully.");
        resetFormAndToggleAddMode();
        displayUserAccounts();
      })
      .catch(function (error) {
        console.error("Error adding user account: ", error);
      });
  }
});

// Function to handle "Save Changes" in Edit mode
document.getElementById("editUserForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const userId = editUserIdInput.value;
  const newUsername = editUsernameInput.value;
  const newPassword = editPasswordInput.value;

  // Update the user's username and password in Firestore
  const docRef = doc(db, "Account", userId);
  updateDoc(docRef, {
    username: newUsername,
    password: newPassword
  })
    .then(function () {
      console.log("User account updated successfully.");
      resetFormAndToggleAddMode();
      displayUserAccounts();
    })
    .catch(function (error) {
      console.error("Error updating user account: ", error);
    });
});

// Function to handle deleting a user account
function deleteUserAccount(userId) {
  const docRef = doc(db, "Account", userId);
  deleteDoc(docRef)
    .then(function () {
      console.log("User account deleted successfully.");
      deleteUserForm.reset();
      displayUserAccounts();
    })
    .catch(function (error) {
      console.error("Error deleting user account: ", error);
    });
}

// Call the function to display user accounts on page load
displayUserAccounts();
