// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

// Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyCSJoXurbQSGyPhMYI4qL7VmuiQ_5sLQAA",
    authDomain: "iot-health-monitoring-sy-ed011.firebaseapp.com",
    databaseURL: "https://iot-health-monitoring-sy-ed011-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "iot-health-monitoring-sy-ed011",
    storageBucket: "iot-health-monitoring-sy-ed011.firebasestorage.app",
    messagingSenderId: "430526451837",
    appId: "1:430526451837:web:f7c4b5ded1d18b2f396114"
  };
  
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

export { db, auth };
