

import { getOpeningsData } from "@/scripts/openingsUtils.js";

import Chart from 'chart.js/auto'
import zoomPlugin from 'chartjs-plugin-zoom';
import 'chartjs-adapter-moment';
import { LinearScale, PointElement, Tooltip, Legend, TimeScale } from "chart.js"; 
Chart.register(zoomPlugin, LinearScale, PointElement, Tooltip, Legend, TimeScale); 


export function graphOpenings(timeClass="all") {
    const ctx = document.getElementById("openings");
    const chartInstance = Chart.getChart(ctx);

    let games = getGamesByTimeClass(timeClass)
    let topOpenings = getTopOpenings(games, 10) 

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
            label: 'Loss',
            data: losses,
            borderWidth: 1,
            backgroundColor: red, 
          },
          {
            label: 'Draw',
            data: draws,
            borderWidth: 1,
            backgroundColor: grey, 
          },
          {
            label: 'Win',
            data: wins,
            borderWidth: 1,
            backgroundColor: green, 
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

function getTopOpenings(games, n) {

  let mainLines = games["mainLines"] 

  let counts = {};

  for (let i = 0; i < mainLines.length; i++) {
    let current = mainLines[i]["mainLine"]
    counts[current] = (counts[current] || 0) + 1;
  }

  let allCounts = []
  for (const [key, value] of Object.entries(counts)) {
      allCounts.push(value)
  }



  let openingTitles = []
  let openingCounts = []

  for (const [key, value] of Object.entries(counts)) {
      if (nTopPercentile(value, allCounts, 0.7)) {
        openingTitles.push(key);
        openingCounts.push(value);
      }
  }
  console.log(openingTitles)
  console.log(openingCounts)

  games["sortedOpenings"] = {
      "labels": openingTitles,
      "values": openingCounts
  }

  console.log(games)
  return games
}

function nTopPercentile(num, allNums, n) {
  console.log(num)
  console.log(allNums)

  allNums.sort((a, b) => a - b);

  const index = Math.ceil(num.length * 0.9) - 1;
  const percentileValue = allNums[index];


  return num >= percentileValue;
}

function getGamesByTimeClass(timeClass) {
  let data = getOpeningsData();

  let classData = [];

  for (let i = 0; i < data["mainLines"].length; i++){
    let game = data["mainLines"][i];
    let rating = game["rating"];
    if (timeClass != "all" && rating == timeClass){
      classData.push(game)
    }
    else {
      classData.push(game)
    }
  }

  return data;
}