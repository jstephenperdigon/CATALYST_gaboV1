var lineChart;

function updateLineChart(timePeriod) {
  // Based on the selected time period, fetch data from the server or calculate it locally
  // Here, I'll just use sample data for demonstration purposes

  var labels;
  var recyclableData;
  var specialData;
  var biodegradableData;
  var nonBiodegradableData;

  if (timePeriod === "today") {
    // Sample data for today
    labels = [
      "08:00",
      "10:00",
      "12:00",
      "14:00",
      "15:00",
      "16:00",
      "17:00",
      "18:00",
    ];
    recyclableData = [10, 20, 30, 100, 50, 60, 70, 80];
    specialData = [5, 10, 15, 20, 25, 30, 35, 40];
    biodegradableData = [15, 25, 35, 45, 55, 65, 75, 85];
    nonBiodegradableData = [8, 15, 22, 30, 37, 44, 51, 58];
  } else if (timePeriod === "last_week") {
    // Sample data for last week
    labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    recyclableData = [50, 60, 70, 80, 90, 100, 110];
    specialData = [30, 40, 50, 60, 70, 80, 90];
    biodegradableData = [40, 50, 60, 70, 80, 90, 100];
    nonBiodegradableData = [25, 35, 45, 55, 65, 75, 85];
  } else if (timePeriod === "last_month") {
    // Sample data for last month
    labels = ["Week 1", "Week 2", "Week 3", "Week 4"];
    recyclableData = [100, 200, 140, 160];
    specialData = [60, 80, 150, 120];
    biodegradableData = [200, 100, 120, 140];
    nonBiodegradableData = [50, 70, 180, 110];
  }

  // Update the chart with the fetched data
  var data = {
    labels: labels,
    datasets: [
      {
        label: "Recyclable",
        data: recyclableData,
        borderColor: "blue",
        fill: false,
      },
      {
        label: "Special",
        data: specialData,
        borderColor: "red",
        fill: false,
      },
      {
        label: "Biodegradable",
        data: biodegradableData,
        borderColor: "green",
        fill: false,
      },
      {
        label: "Non-Biodegradable",
        data: nonBiodegradableData,
        borderColor: "orange",
        fill: false,
      },
    ],
  };

  if (lineChart) {
    lineChart.destroy(); // Destroy previous chart instance if exists
  }

  // Get the canvas element
  var ctx = document.getElementById("lineChart").getContext("2d");

  // Create the line chart
  lineChart = new Chart(ctx, {
    type: "line",
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

// Initially load the chart for today
updateLineChart("today");
