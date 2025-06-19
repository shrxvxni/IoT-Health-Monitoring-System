const express = require("express");
const cors = require("cors");
const { initializeApp } = require("firebase/app");
const { getDatabase, ref, get } = require("firebase/database");

const app = express();
app.use(cors());

const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "iot-cloud-88c92.firebaseapp.com",
  databaseURL: "https://iot-cloud-88c92-default-rtdb.firebaseio.com",
  projectId: "iot-cloud-88c92",
  storageBucket: "iot-cloud-88c92.appspot.com",
  messagingSenderId: "201006607302",
  appId: "1:201006607302:web:YOUR_ID"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getDatabase(firebaseApp);

app.get("/sensorData", async (req, res) => {
  try {
    const snapshot = await get(ref(db, "/sensorData"));
    if (snapshot.exists()) {
      res.json(snapshot.val());
    } else {
      res.status(404).json({ error: "No data found" });
    }
  } catch (e) {
    console.error("Error fetching data:", e);
    res.status(500).json({ error: "Permission Denied or Config Error" });
  }
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});