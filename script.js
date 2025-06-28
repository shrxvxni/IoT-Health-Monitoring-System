import { db } from "./firebase-config.js";
import { ref, onValue } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";

// GLOBAL VARIABLES
let tempChart, humChart, pulseChart;
let tempData = [], humData = [], pulseData = [], labels = [];

// LOGIN FUNCTION (Basic Placeholder)
window.login = function () {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (email && password) {
    document.getElementById("loginSection").style.display = "none";
    document.getElementById("dashboardSection").style.display = "block";
    updateClock();
    startCharts();
  } else {
    alert("Enter valid credentials");
  }
};

// CLOCK DISPLAY
function updateClock() {
  setInterval(() => {
    const now = new Date();
    document.getElementById("clock").textContent = "🕒 " + now.toLocaleTimeString();
  }, 1000);
}

// CREATE CHART
function createChart(id, label, color, tension = 0.4) {
  return new Chart(document.getElementById(id), {
    type: "line",
    data: {
      labels: [],
      datasets: [{
        label: label,
        data: [],
        borderColor: color,
        backgroundColor: color + "33",
        fill: true,
        tension: tension,
      }]
    },
    options: {
      animation: false,
      responsive: true,
      scales: {
        y: { beginAtZero: false }
      }
    }
  });
}

// UPDATE CHART
function updateChart(chart, value, label, dataArray) {
  chart.data.labels.push(label);
  chart.data.datasets[0].data.push(value);
  dataArray.push(value);

  if (chart.data.labels.length > 30) {
    chart.data.labels.shift();
    chart.data.datasets[0].data.shift();
    dataArray.shift();
  }

  chart.update();
}

// START READING FROM FIREBASE
function startCharts() {
  tempChart = createChart("tempChart", "Temperature (°C)", "#00f2fe");
  humChart = createChart("humChart", "Humidity (%)", "#4facfe");
  pulseChart = createChart("pulseChart", "Pulse", "#43e97b", 0);

  const sensorRef = ref(db, "sensorData");

  onValue(sensorRef, (snapshot) => {
    const data = snapshot.val();
    const now = new Date().toLocaleTimeString();

    const temp = parseFloat(data.temperature);
    const hum = parseFloat(data.humidity);
    const pulse = parseInt(data.pulse);

    document.getElementById("temp").textContent = temp.toFixed(1);
    document.getElementById("hum").textContent = hum.toFixed(1);
    document.getElementById("pulse").textContent = pulse;

    updateChart(tempChart, temp, now, tempData);
    updateChart(humChart, hum, now, humData);
    updateChart(pulseChart, pulse / 200, now, pulseData);  // scale to waveform height
    labels.push(now);
    if (labels.length > 30) labels.shift();
  });
}

// CSV EXPORT
window.exportCSV = function () {
  let csv = "Time,Temperature,Humidity,Pulse\n";
  for (let i = 0; i < labels.length; i++) {
    csv += `${labels[i]},${tempData[i]?.toFixed(2)},${humData[i]?.toFixed(2)},${pulseData[i]}\n`;
  }

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "health_data.csv";
  link.click();
};
