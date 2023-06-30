

// import { getOpeningsData } from "@/scripts/openingsUtils.js";

import Chart from 'chart.js/auto'
import zoomPlugin from 'chartjs-plugin-zoom';
import 'chartjs-adapter-moment';
import { LinearScale, PointElement, Tooltip, Legend, TimeScale } from "chart.js"; 
Chart.register(zoomPlugin, LinearScale, PointElement, Tooltip, Legend, TimeScale); 


export function makeOpeningsChart(filters="") {

  let gameArchive = JSON.parse(localStorage.getItem("archivedGames"))
  let openingsData = {} 

  let filteredArchive = filterOpeningsData(gameArchive, filters) 
  let unsortedOpenings = getOpeningsData(filteredArchive)
  openingsData = processOpeningsData(unsortedOpenings, 10)

  const labels = openingsData.labels 
  const counts = openingsData.counts
  const wins = openingsData.wins
  const losses = openingsData.losses
  const draws = openingsData.draws

  const ctx = document.getElementById("openings");
  const chartInstance = Chart.getChart(ctx);

  if (chartInstance) {
    chartInstance.data.datasets[0].data = wins;
    chartInstance.data.datasets[1].data = draws;
    chartInstance.data.datasets[0].data = losses;
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
          }
        }
      });
}


export function processOpeningsData(openingsData, n=100) {
  // Sort the data by count in descending order
  openingsData.sort((a, b) => b.count - a.count);

  // Determine the cutoff index based on the percentile
  const cutoffIndex = Math.ceil((n / 100) * openingsData.length);

  // Slice the array to get the top n%
  const topOpeningsData = openingsData.slice(0, cutoffIndex);

  // Create separate arrays for each property
  const labels = topOpeningsData.map(data => data.name);
  const counts = topOpeningsData.map(data => data.count);
  const wins = topOpeningsData.map(data => data.win);
  const losses = topOpeningsData.map(data => data.loss);
  const draws = topOpeningsData.map(data => data.draw);

  return {
      labels,
      counts,
      wins,
      losses,
      draws
  };
}

export function filterOpeningsData(gameArchive, filters) {
  // skip this part if filters is none
  const timeClass = filters.timeClass;
  const color = filters.color;

  let filteredGameArchive = [];

  console.log(filters)

  if (timeClass === "all" && color === "all") {
    return gameArchive;
  }

  if (timeClass != "all" && color === "all") {
    for (let i = 0; i < gameArchive.length; i++) {
      if (gameArchive[i].timeClass === timeClass) {
        filteredGameArchive.push(gameArchive[i])
      }
    }
    return filteredGameArchive;
  }

  if (timeClass === "all" && color != "all") {
    for (let i = 0; i < gameArchive.length; i++) {
      if (gameArchive[i].timeClass === timeClass) {
        filteredGameArchive.push(gameArchive[i])
      }
    }
    return filteredGameArchive;
  }

  for (let i = 0; i < gameArchive.length; i++) {
    if (gameArchive[i].timeClass === timeClass && gameArchive[i].color === color) {
      filteredGameArchive.push(gameArchive[i])
    }

  }
  return filteredGameArchive;
}

function getResult(result) {
  if (result === "win") {
    return "win";
  } 
  else if (result === "resigned" || result === "timeout" || result === "checkmated" || result === "abandoned") {
    return "loss";
  }
  else {
    return "draw";
  }
}

export function getOpeningsData(gameArchive) {

  let mainLines = ["Kings Pawn Opening", "Queens Pawn Opening", "Caro Kann Defense", "Vienna Game", "French Defense", "Italian Game", "Scandinavian Defense", "Center Game", "Petrovs Defense", "Pirc Defense", "Four Knights Game", "Giuoco Piano Game", "Barnes Opening", "Philidor Defense", "Sicilian Defense", "Ruy Lopez Opening", "Three Knights Opening", "Nimzowitsch Defense", "Scotch Game", "Bishops Opening", "Alekhines Defense", "Slav Defense", "Ponziani Opening", "Vant Kruijs Opening", "Modern Defense", "Queens Gambit Declined", "Closed Sicilian Defense", "Reti Opening", "Kings Fianchetto", "Kings Gambit", "Van Geet Opening", "Englund Gambit", "English Opening", "Englund Gambit Declined", "Alapin Sicilian", "Birds Opening", "Mieses Opening", "Dutch Defense", "Grob Opening", "Indian Game", "Kings Indian", "Kadas Opening", "Queens Gambit Accepted", "Saragossa Opening", "Ware Opening", "Colle System", "Dresden Opening", "London System", "English Defense", "Benko Gambit", "Benoni", "Bogo-Indian", "Catalan", "Danish Gambit", "Grunfeld Defense", "Budapest Gambit", "Kings Indian Defense", "Kings Indian Attack", "Nimzo Indian Defense", "Nimzowitsch Larsen Attack", "Old Indian Defense", "Owens Defense", "Polish Opening", "Queens Indian Defense", "Semi Slav Defense", "Tarrasch Defense", "Trompowsky Attack"]

  let allOpenings = []

  for (let i = 0; i < gameArchive.length; i++) {
      let opening = gameArchive[i].opening;
      for (let j = 0; j < mainLines.length; j++) {
          if (opening.startsWith(mainLines[j])) {
              allOpenings.push({
                  timeClass: gameArchive[i].timeClass,
                  color: gameArchive[i].color,
                  result: getResult(gameArchive[i].result),
                  name: mainLines[j],
                  openingUrl: gameArchive[i].openingUrl
              });
          }
      }
    }

  let countedOpenings = getCounts(allOpenings);
  return countedOpenings;
}

// damn I need to learn typescript
export function getCounts(rawOpenings) {
  let nodeWithCounts = {};
  // Count occurrences of each opening name
  for (let i = 0; i < rawOpenings.length; i++) {
    let name = rawOpenings[i].name;
    if (nodeWithCounts[name]) {
    nodeWithCounts[name].count++;
    } else {
    nodeWithCounts[name] = {
      count: 1,
      win: 0,
      loss: 0,
      draw: 0
    };
    }
  }

  // get win, loss, and draw counts for each opening
  for (let i = 0; i < rawOpenings.length; i++) {
    let currentNode = rawOpenings[i];
    let name = currentNode.name;
    nodeWithCounts[name][currentNode.result]++;
  }


  // add counts to array 
  let countedOpenings = [];
  for (let name in nodeWithCounts) {
    let countedNode = nodeWithCounts[name];
    let processedNode = {
    name: name,
    count: countedNode.count,
    win: countedNode.win,
    loss: countedNode.loss,
    draw: countedNode.draw
    };

    countedOpenings.push(processedNode);
  }
  return countedOpenings;
}


// export function graphOpenings(timeClass="all") {
//     const ctx = document.getElementById("openings");
//     const chartInstance = Chart.getChart(ctx);

//     let games = getGamesByTimeClass(timeClass)
//     games = addCounts(games) 

//     let labels = allData.map(entry => entry.title);
//     let values = allData.map(entry => entry.value);

//     if (chartInstance) {
//       chartInstance.data.datasets[0].data = values;
//       chartInstance.data.labels = labels;
//       updateTooltipData(chartInstance, allData); 
//       chartInstance.update();
//       return;
//     }

  
//     var openingChart = new Chart(ctx, {
//       type: "bar",
//       label: "openings",
//       data: {
//       labels: labels,
//       datasets: [
//           {
//             label: 'Loss',
//             data: losses,
//             borderWidth: 1,
//             backgroundColor: red, 
//           },
//           {
//             label: 'Draw',
//             data: draws,
//             borderWidth: 1,
//             backgroundColor: grey, 
//           },
//           {
//             label: 'Win',
//             data: wins,
//             borderWidth: 1,
//             backgroundColor: green, 
//           }
//       ]
//     },
//     options: {
//       responsive: true,
//       plugins: {
//         tooltip: {
//           callbacks: {
//             title: function (context) {
//               return context[0].label;
//             },
//             label: function (context) {
//               const winCount = allData[context.dataIndex].winCount;
//               const lossCount = allData[context.dataIndex].lossCount;
//               const drawCount = allData[context.dataIndex].drawCount;
//               return [
//                 `Wins: ${winCount}`,
//                 `Losses: ${lossCount}`,
//                 `Draws: ${drawCount}`
//               ];
//             },
//           },
//         },
//       },
//       onClick: function (event, elements) {
//         if (elements.length) {
//           const dataIndex = elements[0].index;
//           const url = allData[dataIndex].url;
//           window.open(url, "_blank");
//         }
//       },
//       scales: {
//         y: {
//           beginAtZero: true
//         },
//         x: {
//           ticks: {
//               display: false
//          }
//       }
//       }
//     }
//     });
//     return openingChart;
// }

// function updateTooltipData(chartInstance, allData) {
//   chartInstance.options.plugins.tooltip.callbacks.label = function (context) {
//     const winCount = allData[context.dataIndex].winCount;
//     const lossCount = allData[context.dataIndex].lossCount;
//     const drawCount = allData[context.dataIndex].drawCount;
//     return [
//       `Wins: ${winCount}`,
//       `Losses: ${lossCount}`,
//       `Draws: ${drawCount}`
//     ];
//   };
// }

// function addCounts(games) {
//   let mainLines = games["mainLines"] 

//   let counts = {};

//   for (let i = 0; i < mainLines.length; i++) {
//     let current = mainLines[i]["mainLine"]
//     counts[current]["count"] = (counts[current] || 0) + 1;

//     let result = mainLines[i]["result"]

//     counts[current]["Win"] = 0;
//     counts[current]["Loss"] = 0;
//     counts[current]["Draw"] = 0;

//     if (result === "win") {
//         counts[current]["Win"] += 1; 
//     } 
//     else if (result === "resigned" || result === "timeout" || result === "checkmated" || result === "abandoned") {
//       counts[current]["Loss"] += 1;
//     }
//     // else if (result === "agreed" || result == "stalemate" || result === "repetition" || result === "insufficient" || result === "timevsinsufficient" ) {
//     else {
//       counts[current]["Draw"] += 1;
//     }
//   }

//   games["counts"] = counts
//   console.log(games["counts"])
//   return games
// }

// function nTopPercentile(num, allNums, n) {
//   console.log(num)
//   console.log(allNums)
//   allNums.sort((a, b) => a - b);
//   const index = Math.ceil(num.length * 0.9) - 1;
//   const percentileValue = allNums[index];
//   return num >= percentileValue;
// }

// function getGamesByTimeClass(timeClass) {
//   let data = getOpeningsData();

//   let classData = [];

//   for (let i = 0; i < data["mainLines"].length; i++){
//     let game = data["mainLines"][i];
//     let rating = game["rating"];
//     if (timeClass != "all" && rating == timeClass){
//       classData.push(game)
//     }
//     else {
//       classData.push(game)
//     }
//   }

//   return data;
// }