// script.js
import { auth, db } from "./firebase-config.js";
import {
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import {
  ref,
  onValue
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

let tempChart, humChart, pulseChart;
const labels = [], tempData = [], humData = [], pulseData = [];
const maxPoints = 20;

// ⏰ Clock
setInterval(() => {
  document.getElementById("clock").textContent = new Date().toLocaleTimeString();
}, 1000);

// 🔐 Login Function
window.login = function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      document.getElementById("loginSection").style.display = "none";
      document.getElementById("dashboardSection").style.display = "block";
      startCharts();
      readLiveData();
    })
    .catch((err) => {
      alert("Login Failed: " + err.message);
    });
};

// 📊 Chart Setup
function startCharts() {
  const ctx1 = document.getElementById("tempChart").getContext("2d");
  const ctx2 = document.getElementById("humChart").getContext("2d");
  const ctx3 = document.getElementById("pulseChart").getContext("2d");

  tempChart = new Chart(ctx1, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: "Temp (°C)",
        data: tempData,
        borderColor: "orange",
        tension: 0.5,
        fill: false,
        pointRadius: 0
      }]
    },
    options: { responsive: true, animation: false }
  });

  humChart = new Chart(ctx2, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: "Humidity (%)",
        data: humData,
        borderColor: "blue",
        tension: 0.5,
        fill: false,
        pointRadius: 0
      }]
    },
    options: { responsive: true, animation: false }
  });

  pulseChart = new Chart(ctx3, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: "Pulse (BPM)",
        data: pulseData,
        borderColor: "red",
        tension: 0.1, // ECG-like waveform
        fill: false,
        pointRadius: 0
      }]
    },
    options: { responsive: true, animation: false }
  });
}

// 📥 Realtime Firebase Listener
function readLiveData() {
  const sensorRef = ref(db, 'sensorData');

  onValue(sensorRef, (snapshot) => {
    const data = snapshot.val();
    const now = new Date().toLocaleTimeString();

    const temp = Number(data?.temperature) || 0;
    const hum = Number(data?.humidity) || 0;
    const pulse = Number(data?.pulse) || 0;

    // Display values
    document.getElementById("temp").textContent = temp;
    document.getElementById("hum").textContent = hum;
    document.getElementById("pulse").textContent = pulse;

    // Alert handling
    const alertBox = document.getElementById("pulse-alert");
    if (pulse > 0 && pulse < 60) {
      alertBox.textContent = `⚠️ Low pulse detected: ${pulse} BPM`;
      alertBox.style.color = "orange";
    } else if (pulse > 100) {
      alertBox.textContent = `⚠️ High pulse detected: ${pulse} BPM`;
      alertBox.style.color = "red";
    } else {
      alertBox.textContent = "";
    }

    // Skip chart update if hardware is disconnected
    if (temp === 0 && hum === 0 && pulse === 0) return;

    // Update chart
    if (labels.length >= maxPoints) {
      labels.shift(); tempData.shift(); humData.shift(); pulseData.shift();
    }

    labels.push(now);
    tempData.push(temp);
    humData.push(hum);
    pulseData.push(pulse);

    tempChart.update();
    humChart.update();
    pulseChart.update();
  });
}

// 📤 CSV Export
window.exportCSV = function () {
  let csv = "Time,Temperature,Humidity,Pulse\n";
  for (let i = 0; i < labels.length; i++) {
    csv += `${labels[i]},${tempData[i]},${humData[i]},${pulseData[i]}\n`;
  }

  const blob = new Blob([csv], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "iot_health_data.csv";
  link.click();
};
// ✅ Pulse Alert System
const alertBox = document.getElementById("pulse-alert");

if (pulse > 0 && pulse < 60) {
  alertBox.textContent = `⚠️ Low Pulse Detected: ${pulse} BPM`;
  alertBox.style.color = "orange";
  alertBox.classList.add("blink");
} else if (pulse > 100) {
  alertBox.textContent = `⚠️ High Pulse Detected: ${pulse} BPM`;
  alertBox.style.color = "red";
  alertBox.classList.add("blink");
} else {
  alertBox.textContent = "";
  alertBox.classList.remove("blink");
}
