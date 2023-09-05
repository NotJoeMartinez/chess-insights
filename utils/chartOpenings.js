


import Chart from 'chart.js/auto'
import 'chartjs-adapter-moment';
import { LinearScale, PointElement, Tooltip, Legend, TimeScale } from "chart.js"; 
Chart.register( LinearScale, PointElement, Tooltip, Legend, TimeScale); 

import { getArchivedGames } from '~/utils/archiveUtils.js';
import { 
  filterOpeningsData,
  getOpeningsData,
  processOpeningsData
} from '~/utils/openingsUtils.js';

export function makeOpeningsChart(filters="") {

  let gameArchive = getArchivedGames(); 
  let openingsData = {} 

  let filteredArchive = filterOpeningsData(gameArchive, filters) 
  let unsortedOpenings = getOpeningsData(filteredArchive)
  openingsData = processOpeningsData(unsortedOpenings, 50)

  const labels = openingsData.labels 
  const counts = openingsData.counts
  const wins = openingsData.wins
  const losses = openingsData.losses
  const draws = openingsData.draws
  const urls = openingsData.urls

  const ctx = document.getElementById("openings");
  const chartInstance = Chart.getChart(ctx);

  if (chartInstance) {
    chartInstance.data.datasets[0].data = wins;
    chartInstance.data.datasets[1].data = draws;
    chartInstance.data.datasets[2].data = losses;
    chartInstance.data.labels = labels;
    chartInstance.update();
    return;
  }

    let colors = {
        RED: "#8f3431",
        GREEN: "#708641",
        GREY: "#888683"
    }

    new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
            label: 'Win',
            data: wins,
            borderWidth: 0.5,
            backgroundColor: colors.GREEN
          },
          {
            label: 'Draw',
            data: draws,
            borderWidth: 0.5,
            backgroundColor: colors.GREY
          },
          {
            label: 'Loss',
            data: losses,
            borderWidth: 0.5,
            backgroundColor: colors.RED
          }
        ]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              stacked: true
            },
            x: {
                beginAtZero: true,
                stacked: true
            }
          },
          onClick: function (event, elements) {
            if (elements.length) {
              const dataIndex = elements[0].index;
              const url = urls[dataIndex] + "?ref_id=74104030";
              window.open(url, "_blank");
            }
          },
        },
  
      });
}


