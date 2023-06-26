
// import { Chart } from 'chart.js';
import Chart from 'chart.js/auto'
import {LinearScale, PointElement, Tooltip, Legend, TimeScale} from "chart.js"; 
import zoomPlugin from 'chartjs-plugin-zoom';

// import moment from 'moment';
import 'chartjs-adapter-moment';

Chart.register(zoomPlugin, LinearScale, PointElement, Tooltip, Legend, TimeScale); 

export function chartResByOp(timeClass="all") {
    const ctx = document.getElementById("resByOpChart");
    const chartInstance = Chart.getChart(ctx);

    
  
    var resByOp = new Chart(ctx, {
      type: "bar",
      label: "Results",
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
  
