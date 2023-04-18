
// import { Chart } from 'chart.js';
import Chart from 'chart.js/auto'
import {LinearScale, PointElement, Tooltip, Legend, TimeScale} from "chart.js"; 
import zoomPlugin from 'chartjs-plugin-zoom';

// import moment from 'moment';
import 'chartjs-adapter-moment';

Chart.register(zoomPlugin, LinearScale, PointElement, Tooltip, Legend, TimeScale); 

import { getArchivedGames, parseGameNode, isTop90Percentile } from './utils.js';

export function graphOpenings(timeClass="all") {
    console.log(`graph Openings: ${timeClass}`)

    const ctx = document.getElementById("openings");
    const chartInstance = Chart.getChart(ctx);

    let allData = getOpeningsData(timeClass);

    if (chartInstance) {
      chartInstance.data.datasets[0].data = allData.values;
      chartInstance.data.labels = allData.titles;
      chartInstance.update();
      console.log("chart updated");
      return;
    }

    let sortedTitles = allData.titles;
    let sortedValues = allData.values;
  
    console.log(`ctx: ${ctx}`);
    var openingChart = new Chart(ctx, {
      type: "bar",
      label: "openings",
      data: {
      labels: sortedTitles,
      datasets: [
        {
        label: "times used",
        data: sortedValues,
        borderWidth: 1
      }
      ]
    },
    options: {
      responsive: true,
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
  
  
function getOpeningsData(timeClass){

  let archivedGames = getArchivedGames();
  // let uname = getUserName();

  const openingData = {};
  if (timeClass=="all"){
    for (let i = 0; i < archivedGames.length; i++) {
      let parsedGameNode = parseGameNode(archivedGames[i]);
      const string = parsedGameNode.opening;
      openingData[string] = (openingData[string] || 0) + 1;
    }
  } else {
    for (let i = 0; i < archivedGames.length; i++) {
      let parsedGameNode = parseGameNode(archivedGames[i]);
      if (parsedGameNode.timeClass == timeClass) {
        const string = parsedGameNode.opening;
        openingData[string] = (openingData[string] || 0) + 1;
      }
    }
  }

  

  let allNumbers = []
/* eslint-disable no-unused-vars */
  for (const [key, value] of Object.entries(openingData)) {
    allNumbers.push(value)
  }

  let titles = []
  let values = []

  /* eslint-disable no-unused-vars */
  for (const [key, value] of Object.entries(openingData)) {
    // console.log(`${value}/${total} = ` + value/total );
    if (isTop90Percentile(value, allNumbers)) {
        titles.push(key);
        values.push(value);
    }
  }


  let arrayOfObj = titles.map(function(d, i) {
    return {
      label: d,
      data: values[i] || 0
    };
  });

  let sortedArrayOfObj = arrayOfObj.sort(function(a, b) {
    return b.data>a.data;
  });

  let sortedTitles = [];
  let sortedValues = [];

  sortedArrayOfObj.forEach(function(d){
    sortedTitles.push(d.label);
    sortedValues.push(d.data);
  })

  let res = {
    titles: sortedTitles,
    values: sortedValues
  }

  return res;
}