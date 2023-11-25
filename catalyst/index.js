
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyAlBL1bmuITXC1c1aYfqJt9ZD88Wvl1jdY",
    authDomain: "uccgabov1.firebaseapp.com",
    projectId: "uccgabov1",
    storageBucket: "uccgabov1.appspot.com",
    messagingSenderId: "79135942355",
    appId: "1:79135942355:web:a9a1a28c4c453592469626",
    measurementId: "G-XNXDDB613J"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);