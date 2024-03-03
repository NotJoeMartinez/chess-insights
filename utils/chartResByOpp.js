/* eslint-disable */
import Chart from 'chart.js/auto'
import {LinearScale, PointElement, Tooltip, Legend, TimeScale} from "chart.js"; 
import 'chartjs-adapter-moment';
import {  getArchivedGames } from '~/utils/archiveUtils.js';

Chart.register(LinearScale, PointElement, Tooltip, Legend, TimeScale); 

export function graphResByOpp(timeClass) {


  const ctx = document.getElementById("resByOppChart");
  const chartInstance = Chart.getChart(ctx);

  let chartData = [] 
  let ranges = []
  let rangeLabels = []
  let data = [] 

  let wins = []
  let losses = []
  let draws = []


 

  if (chartInstance) {

    chartData = getChartData(timeClass); 
    ranges = getRanges(chartData);
    rangeLabels = getRangeLabels(ranges);
    data = makeDataSet(ranges, chartData);

    wins = data["winPercent"];
    losses = data["lossPercent"];
    draws = data["drawPercent"];    

    chartInstance.data.datasets[0].data = losses; 
    chartInstance.data.datasets[1].data = draws; 
    chartInstance.data.datasets[2].data = wins;
    chartInstance.data.labels = rangeLabels;

    chartInstance.update();
    return;
  }
  chartData = getChartData(timeClass); 
  ranges = getRanges(chartData);
  rangeLabels = getRangeLabels(ranges);
  data = makeDataSet(ranges, chartData);

  wins = data["winPercent"];
  losses = data["lossPercent"];
  draws = data["drawPercent"];    

  let green = "#708641"
  let grey = "#888683"
  let red = "#8f3431"

  const title = (tooltipItems) => {
    let titleStr = "";

    return titleStr;
  };

  const footer = (tooltipItems) => {  
    let rangeIndex = tooltipItems[0].parsed.x;
    let rangeKey = ranges[rangeIndex];
    let total = data[rangeKey]["total"] 
    let range = rangeLabels[rangeIndex];

    let afterLabelStr = `Elo Range: ${range}\nTotal Games: ${total}`;
    return afterLabelStr;
  }

const resByOppChart =  new Chart(ctx, {
      type: 'bar',
      data: {
        labels: rangeLabels,
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
        scales: {
          y: {
            beginAtZero: true,
            stacked: true
          },
          x: {
            stacked: true,
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              title: title,
              footer: footer,
              label:  function(context) {
                let label = context.dataset.label || '';

               
                if (context.parsed.y !== null) {


                    let rangeIndex = context.parsed.x;
                    let rangeKey = ranges[rangeIndex];
                    let rangeLabelY = context.parsed.y;


                    let labelOnHover = data[rangeKey][label.toLowerCase()];


                    if (label) {
                      label += ': ';
                    }

                    label += `${labelOnHover} (${rangeLabelY}%)`
                }
                return label; 
              }
            },
            bodyFont:{
              weight: 'bold',
            },
            titleFont:{
              size: 12,
            },
            footerFont: {
              size: 10,
              weight: 'normal'
            }

          }
        }
      }
    });
    resByOppChart.update()
    return resByOppChart;

}

function getChartData(timeClass) {

  let archivedGames = getArchivedGames();
  let chartData = [];

  for (let i=0; i<archivedGames.length; i++) {
      let parsedGameNode = archivedGames[i];
      if (parsedGameNode.timeClass === timeClass){
        let result = parsedGameNode.result;
        let rating = parsedGameNode.opponentRating;

        chartData.push({ opponentRating: `${rating}`, result: `${result}` });
      }
      else if (timeClass === "all") {
        let result = parsedGameNode.result;
        let rating = parsedGameNode.opponentRating;

        chartData.push({ opponentRating: `${rating}`, result: `${result}` });
      }

  }

  return chartData;
  
}

function getRanges(csvData) {
  let oppRatingList = [];
  for (let i = 0; i < csvData.length; i++) {
    let rating = Number(csvData[i]["opponentRating"]);
    if (isNaN(rating)) {
      continue;
    }
    oppRatingList.push(rating);
  }

  let min = Math.min(...oppRatingList);
  let max = Math.max(...oppRatingList);


  let ranges = [];
  let current = Math.floor(min/100) * 100;


  while (current <= max) {

    if (verifyRatingRange(current, oppRatingList)) {
      ranges.push(current + 99);
    }
    current += 100;
  } 


  return ranges;
}

function verifyRatingRange(current, oppRatingList) {
  let max = current + 99;

  for (let i = 0; i < oppRatingList.length; i++) {
    if (oppRatingList[i] >= current && oppRatingList[i] <= max) {
      return true;
    }
  }
  return false;
}

function getRangeLabels(ranges) {
let rangeLabels = [];
for (let i = 0; i < ranges.length; i++) {
  let start = ranges[i] - 99;
  rangeLabels.push(start + "-" + ranges[i]);
}
return rangeLabels;
}


function makeDataSet(ranges, chartData){

  let dataSets = {};

  for (let i = 0; i < ranges.length; i++) {
    dataSets[ranges[i]] = {
      "win": 0,
      "loss": 0,
      "draw": 0,
      "total": 0
    };
  }


  for (let i = 0; i < chartData.length; i++) {

    for (let j = 0; j < ranges.length; j++) {

      if (chartData[i]["opponentRating"] >= ranges[j] - 99 && chartData[i]["opponentRating"] <= ranges[j]) {
        let result = chartData[i]["result"];

        if (result === "win") {
          dataSets[ranges[j]]["win"] += 1;
        }
        else if (result === "resigned" || result === "checkmated" || result === "timeout" || result === "abandoned") {
          dataSets[ranges[j]]["loss"] += 1;
        }
        else if (
          result === "stalemate" || result === "agreed" || 
          result === "repetition" || result === "insufficient" || 
          result === "50mov" || result === "timevsinsufficient" 
          ) {
          dataSets[ranges[j]]["draw"] += 1;
        }
        else {  
          console.log("unknown result: " + result);
        }
      } 
    }

  }

  // add totals
  for (let i = 0; i < ranges.length; i++) {
    dataSets[ranges[i]]["total"] = dataSets[ranges[i]]["win"] + dataSets[ranges[i]]["loss"] + dataSets[ranges[i]]["draw"];
  }


  dataSets["win"] = [];
  dataSets["loss"] = [];
  dataSets["draw"] = [];

  for (let i = 0; i < ranges.length; i++) {
    dataSets["win"].push(dataSets[ranges[i]]["win"]);
    dataSets["loss"].push(dataSets[ranges[i]]["loss"]);
    dataSets["draw"].push(dataSets[ranges[i]]["draw"]);
  }

  dataSets["winPercent"] = [];
  dataSets["lossPercent"] = [];
  dataSets["drawPercent"] = [];

  for (let i=0; i <ranges.length; i++) {
    let total = Number(dataSets["win"][i] + dataSets["loss"][i] + dataSets["draw"][i]);

    let w = Math.round(dataSets["win"][i] / total * 100)
    let l =  Math.round(dataSets["loss"][i] / total * 100)
    let d =  Math.round(dataSets["draw"][i] / total * 100)

    if (isNaN(w)) {
      w = 0;
    }
    if (isNaN(l)) {
      l = 0;
    }

    if (isNaN(d)) {
      d = 0;
    }

    dataSets["winPercent"].push(w);
    dataSets["lossPercent"].push(l);
    dataSets["drawPercent"].push(d);
  }

  return dataSets;

}






