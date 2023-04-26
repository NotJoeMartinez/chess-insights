
// import { Chart } from 'chart.js';
import Chart from 'chart.js/auto'
import {LinearScale, PointElement, Tooltip, Legend, TimeScale} from "chart.js"; 
import zoomPlugin from 'chartjs-plugin-zoom';

// import moment from 'moment';
import 'chartjs-adapter-moment';

Chart.register(zoomPlugin, LinearScale, PointElement, Tooltip, Legend, TimeScale); 

export function graphOpenings(timeClass="all") {
    const ctx = document.getElementById("openings");
    const chartInstance = Chart.getChart(ctx);

    let allData = getOpeningsData(timeClass);
    
    let labels = allData.map(entry => entry.title);
    let values = allData.map(entry => entry.value);

    if (chartInstance) {
      chartInstance.data.datasets[0].data = values;
      chartInstance.data.labels = labels;
      updateTooltipData(chartInstance, allData); 
      chartInstance.update();
      return;
    }

  
    var openingChart = new Chart(ctx, {
      type: "bar",
      label: "openings",
      data: {
      labels: labels,
      datasets: [
        {
        label: "times used",
        data: values,
        borderWidth: 1
      }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        tooltip: {
          callbacks: {
            title: function (context) {
              return context[0].label;
            },
            label: function (context) {
              const winCount = allData[context.dataIndex].winCount;
              const lossCount = allData[context.dataIndex].lossCount;
              const drawCount = allData[context.dataIndex].drawCount;
              return [
                `Wins: ${winCount}`,
                `Losses: ${lossCount}`,
                `Draws: ${drawCount}`
              ];
            },
          },
        },
      },
      onClick: function (event, elements) {
        if (elements.length) {
          const dataIndex = elements[0].index;
          const url = allData[dataIndex].url;
          window.open(url, "_blank");
        }
      },
      scales: {
        y: {
          beginAtZero: true
        },
        x: {
          ticks: {
              display: false
         }
      }
      }
    }
    });
    return openingChart;
}
  
function getOpeningsData(timeClass) {
  if (window.localStorage.getItem("openings") != null) {
    let localOpenings = window.localStorage.getItem("openings");
    let openings = JSON.parse(localOpenings);
    return openings[timeClass];
} else {
    let inlineDiv = document.getElementById("openingsInlineStorage");
    let inlineOpenings = JSON.parse(inlineDiv.textContent);
    return inlineOpenings[timeClass];
}

} 
  

function updateTooltipData(chartInstance, allData) {
  chartInstance.options.plugins.tooltip.callbacks.label = function (context) {
    const winCount = allData[context.dataIndex].winCount;
    const lossCount = allData[context.dataIndex].lossCount;
    const drawCount = allData[context.dataIndex].drawCount;
    return [
      `Wins: ${winCount}`,
      `Losses: ${lossCount}`,
      `Draws: ${drawCount}`
    ];
  };
}