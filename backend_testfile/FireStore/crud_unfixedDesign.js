// Import/s here
import { db, getDocs, addDoc, collection, doc, updateDoc, deleteDoc } from "./connection/firebaseConfig.js"; // Import Firestore functions from firebaseConfig.js

// CONFIGURATION FOR Database
    const accountCollection = collection(db, "Account");


  // ++++++++++++++++++++++++++++++++++++++FUNCTIONS STARTS HERE+++++++++++++++++++++++++++++++++++++++
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
  document.getElementById("editUsername").value = username;
  document.getElementById("editPassword").value = password;
}

// Function to handle editing a user's username and password
document.getElementById("editUserForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const userId = document.getElementById("editUserId").value;
  const newUsername = document.getElementById("editUsername").value;
  const newPassword = document.getElementById("editPassword").value;

  // Update the user's username and password in Firestore
  const docRef = doc(db, "Account", userId);
  updateDoc(docRef, {
      username: newUsername,
      password: newPassword
  })
  .then(function () {
      console.log("User account updated successfully.");
      document.getElementById("editUserForm").reset();

      // Display all user accounts
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
      document.getElementById("deleteUserForm").reset();

      // Display all user accounts
      displayUserAccounts();
  })
  .catch(function (error) {
      console.error("Error deleting user account: ", error);
  });
}

// Function to add a new user account to Firestore
document.getElementById("addUserForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  // Add the username and password to Firestore
  addDoc(accountCollection, {
      username: username,
      password: password
  })
  .then(function (docRef) {
      console.log("User account added successfully.");
      document.getElementById("addUserForm").reset();

      // Display all user accounts
      displayUserAccounts();
  })
  .catch(function (error) {
      console.error("Error adding user account: ", error);
  });
});

// Call the function to display user accounts on page load
displayUserAccounts();


