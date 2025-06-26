import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const tempData = [];
const humidityData = [];
const pulseData = [];
const labels = [];

const maxPoints = 30;

const tempCtx = document.getElementById("tempChart").getContext("2d");
const humidityCtx = document.getElementById("humidityChart").getContext("2d");
const pulseCtx = document.getElementById("pulseChart").getContext("2d");

const chartOptions = {
  responsive: true,
  animation: false,
  scales: {
    x: { display: false },
    y: { beginAtZero: true }
  }
};

const tempChart = new Chart(tempCtx, {
  type: "line",
  data: {
    labels: labels,
    datasets: [{
      label: "Temperature",
      data: tempData,
      borderColor: "red",
      tension: 0.3,
    }]
  },
  options: chartOptions
});

const humidityChart = new Chart(humidityCtx, {
  type: "line",
  data: {
    labels: labels,
    datasets: [{
      label: "Humidity",
      data: humidityData,
      borderColor: "blue",
      tension: 0.3,
    }]
  },
  options: chartOptions
});

const pulseChart = new Chart(pulseCtx, {
  type: "line",
  data: {
    labels: labels,
    datasets: [{
      label: "Pulse",
      data: pulseData,
      borderColor: "green",
      tension: 0.4,
    }]
  },
  options: chartOptions
});

function updateChart(chart, dataArray, newValue) {
  const time = new Date().toLocaleTimeString();
  labels.push(time);
  dataArray.push(newValue);

  if (dataArray.length > maxPoints) {
    labels.shift();
    dataArray.shift();
  }

  chart.update();
}

const sensorRef = ref(db, "sensorData");
onValue(sensorRef, (snapshot) => {
  const data = snapshot.val();
  if (data) {
    updateChart(tempChart, tempData, data.temperature);
    updateChart(humidityChart, humidityData, data.humidity);
    updateChart(pulseChart, pulseData, data.pulse);
  }
});
