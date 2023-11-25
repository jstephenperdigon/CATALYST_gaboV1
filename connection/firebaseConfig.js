      import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
      import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-analytics.js";
      // TODO: Add SDKs for Firebase products that you want to use
      // https://firebase.google.com/docs/web/setup#available-libraries

      // Your web app's Firebase configuration
      // For Firebase JS SDK v7.20.0 and later, measurementId is optional
      const firebaseConfig = {
        apiKey: "AIzaSyDx8Rl9bO8iSnqlyr5SZA8F_IS4tBeY7DI",
        authDomain: "catalystgabov1-e4039.firebaseapp.com",
        projectId: "catalystgabov1-e4039",
        storageBucket: "catalystgabov1-e4039.appspot.com",
        messagingSenderId: "752654287389",
        appId: "1:752654287389:web:8b6313e29f2fdaf09b7cf4",
        measurementId: "G-DMEC503TCY"
      };

      // Initialize Firebase
      const app = initializeApp(firebaseConfig);
      const analytics = getAnalytics(app);
      const db = getFirestore(app);
      
      



      
  // ++++++++++++++++++++++++++++++++++++++FIREBASE CONFIG ENDS HERE HERE+++++++++++++++++++++++++++++++++++++++
 