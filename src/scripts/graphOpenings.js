
// import { Chart } from 'chart.js';
import Chart from 'chart.js/auto'
import {LinearScale, PointElement, Tooltip, Legend, TimeScale} from "chart.js"; 
import zoomPlugin from 'chartjs-plugin-zoom';

// import moment from 'moment';
import 'chartjs-adapter-moment';

Chart.register(zoomPlugin, LinearScale, PointElement, Tooltip, Legend, TimeScale); 

// import { parseGameNode, isTop90Percentile, getWinsByOpenings, getLossByOpenings} from './utils.js';

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
              return [
                `Wins: ${winCount}`,
                `Losses: ${lossCount}`,
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

    // openingChart.update();
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
  
// function getOpeningsData(timeClass){

//   let archivedGames = getArchivedGames();
//   // let uname = getUserName();

//   const openingData = {};
//   if (timeClass=="all"){
//     for (let i = 0; i < archivedGames.length; i++) {
//       let parsedGameNode = parseGameNode(archivedGames[i]);
//       const string = parsedGameNode.opening;
//       openingData[string] = (openingData[string] || 0) + 1;
//     }
//   } else {
//     for (let i = 0; i < archivedGames.length; i++) {
//       let parsedGameNode = parseGameNode(archivedGames[i]);
//       if (parsedGameNode.timeClass == timeClass) {
//         const string = parsedGameNode.opening;
//         openingData[string] = (openingData[string] || 0) + 1;
//       }
//     }
//   }

  

//   let allNumbers = []
// /* eslint-disable no-unused-vars */
//   for (const [key, value] of Object.entries(openingData)) {
//     allNumbers.push(value)
//   }

//   let titles = []
//   let values = []

//   /* eslint-disable no-unused-vars */
//   for (const [key, value] of Object.entries(openingData)) {
//     if (isTop90Percentile(value, allNumbers)) {
//         titles.push(key);
//         values.push(value);
//     }
//   }


//   let arrayOfObj = titles.map(function(d, i) {
//     return {
//       label: d,
//       data: values[i] || 0
//     };
//   });

//   let sortedArrayOfObj = arrayOfObj.sort(function(a, b) {
//     return b.data>a.data;
//   });

//   let sortedTitles = [];
//   let sortedValues = [];

//   sortedArrayOfObj.forEach(function(d){
//     sortedTitles.push(d.label);
//     sortedValues.push(d.data);
//   })

//   let res = []
//   for (let i = 0; i < sortedTitles.length; i++) {
//     let urlPath = sortedTitles[i];
//     if (urlPath[0] == " ") {
//       urlPath = urlPath.slice(1);
//     }


//     let openingUrl = "https://www.chess.com/openings/" + urlPath.replace(/ /g, "-");
//     let opening = sortedTitles[i];
//     let openingCount = sortedValues[i];

//     let winCount = getWinsByOpenings(timeClass, opening);
//     let lossCount = getLossByOpenings(timeClass, opening) 

//     res.push({title: opening, value: openingCount, url: openingUrl, winCount: winCount, lossCount: lossCount})
//   }

//   return res;
// }

function updateTooltipData(chartInstance, allData) {
  chartInstance.options.plugins.tooltip.callbacks.label = function (context) {
    const winCount = allData[context.dataIndex].winCount;
    const lossCount = allData[context.dataIndex].lossCount;
    return [
      `Wins: ${winCount}`,
      `Losses: ${lossCount}`,
    ];
  };
}