var donutChart;

function updateDonutChart(timePeriod) {
  // Clear previous chart instance if it exists
  if (donutChart) {
    donutChart.destroy();
  }

  var labels;
  var data;

  // Fetch or calculate data dynamically based on the selected time period
  if (timePeriod === "today") {
    // Sample data for today
    labels = ["Recyclable", "Special", "Biodegradable", "Non-Biodegradable"];
    data = [29, 19, 28, 22]; // Sample data percentages
  } else if (timePeriod === "last_week") {
    // Sample data for last week
    labels = ["Recyclable", "Special", "Biodegradable", "Non-Biodegradable"];
    data = [50, 10, 20, 20]; // Sample data percentages
  } else if (timePeriod === "last_month") {
    // Sample data for last month
    labels = ["Recyclable", "Special", "Biodegradable", "Non-Biodegradable"];
    data = [20, 30, 30, 20]; // Sample data percentages
  }

  // Get the canvas element
  var ctx = document.getElementById("donutChart").getContext("2d");

  // Create the donut chart
  donutChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: ["blue", "red", "green", "orange"], // Colors for each section
        },
      ],
    },
  });
}

// Initially load the chart for today
updateDonutChart("today");
