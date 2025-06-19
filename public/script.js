const tempData = [];
const humData = [];
const pulseData = [];
const labels = [];

function setupChart(ctx, label, data, borderColor) {
  return new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [{
        label: label,
        data: data,
        borderColor: borderColor,
        tension: 0.3,
        fill: false
      }]
    },
    options: {
      animation: false,
      responsive: true,
      scales: {
        x: { display: false }
      }
    }
  });
}

const tempChart = setupChart(document.getElementById("tempChart"), "Temp", tempData, "#ff4c4c");
const humChart = setupChart(document.getElementById("humChart"), "Humidity", humData, "#4cd3ff");
const pulseChart = setupChart(document.getElementById("pulseChart"), "Pulse", pulseData, "#8fff4c");

function updateCharts() {
  fetch("http://localhost:3000/sensorData")
    .then(res => res.json())
    .then(data => {
      const now = new Date().toLocaleTimeString();

      labels.push(now);
      tempData.push(data.temperature);
      humData.push(data.humidity);
      pulseData.push(data.pulse);

      if (labels.length > 20) {
        labels.shift();
        tempData.shift();
        humData.shift();
        pulseData.shift();
      }

      tempChart.update();
      humChart.update();
      pulseChart.update();
    });
}
setInterval(updateCharts, 1000);