// import { Chart } from 'chart.js';
import Chart from 'chart.js/auto'
import {LinearScale, PointElement, Tooltip, Legend, TimeScale} from "chart.js"; 
import zoomPlugin from 'chartjs-plugin-zoom';
import { getResult } from '@/scripts/utils.js';
import { getMainLine } from '@/scripts/openingsUtils.js';

// import moment from 'moment';
import 'chartjs-adapter-moment';

Chart.register(zoomPlugin, LinearScale, PointElement, Tooltip, Legend, TimeScale); 

import {  getUserName, } from '@/scripts/utils.js';
import { getArchivedGames, parseGameNode } from '@/scripts/archiveUtils.js';


export function graphElo(timeClass="rapid")  {

  
    const ctx = document.getElementById('eloOverTime');
    const chartInstance = Chart.getChart(ctx);

    let allData = getChartData(timeClass);

    const dates = allData.dates;
    const ratings = allData.ratings;
    const results = allData.results;
    const links = allData.links;
    const openings = allData.opening;

  let green = "#708641"
  let grey = "#888683"
  let red = "#8f3431"
  const colors = results.map(result => result == "win" ? green : result == "loss" ? red: grey);

    if (chartInstance) {
      chartInstance.data.labels = dates; 
      chartInstance.data.datasets[0].data = ratings;
      chartInstance.update();
      return;
    }


    // let timeFormat = "YYYY-MM-DD HH:mm";
    const eloChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: dates,
          datasets: [
            {
            label: 'ELO',
            data: ratings,
            borderWidth: 1,
            // color: colors,
            }
        ]
        },
        options: {
          responsive: true,
          interactions:  {
            intersect: false,
            mode: 'index'
          },
          parsing: {
            yAxisKey: ratings,
            xAxisKey: dates
          },

          scales: {
            x: {
                type: "timeseries",
                unit: "month",
                grid: {
                  display:false 
                },
                ticks: {
                  display: false,
                  autoSkip: true,
                  autoSkipPadding: 50,
                  maxRotation: 45,
                  major: {
                    enabled: true
                  }

                },

             
              },
        },
          
          plugins: {
            tooltip: {
              enabled: true,
              intersect: false,
              mode: 'index',
              borderWidth: 1,
              callbacks: {
                label: function(context) {
                  let label = context.dataset.label || '';
                  if (label) {
                      label += ': ';
                  }
                  if (context.parsed.y !== null) {

                    let index = context.dataIndex;
                    let result = results[index];
                    let rating = ratings[index];
                    label += ` (${result}) ${rating}`;
                  }
                  return label;
                },
                labelColor: function(context) {
                  let index = context.dataIndex;
                  return {
                  borderColor: colors[index],
                  backgroundColor: colors[index],
                  borderWidth: 2,
                  borderDash: [2, 2],
                  borderRadius: 2,
                };
              },
              footer: function(context){
                let index = context[0].dataIndex;
                let opening = openings[index];
                return opening;

              }

            },
            zoom: {
              zoom: {
                wheel: {
                  enabled: false 
                },
                pan: {
                  enabled: true
                },
                drag: {
                  enabled: true
                },
                limits: {
                    y: {min: 100, max: 1000},
                    x: {min: 100, max: 1000}
                  },
                mode: 'x',
              }
            }
          }
        }
      }
      });

      function clickHandler(click) {
        const points = eloChart.getElementsAtEventForMode(click, 'nearest',
        {intersect: true}, true);
        if (points.length) {
          const firstPoint = points[0]
          let url = links[firstPoint.index]
          window.open(url, "_blank");
        }
      }
  
      ctx.onclick = clickHandler;
      eloChart.update();

      return eloChart;
 }

 function removeData(chart) {
  chart.data.labels.pop();
  chart.data.datasets.forEach((dataset) => {
      dataset.data.pop();
  });
  chart.update();
}




 function getChartData(timeClass) {

  let archivedGames = getArchivedGames();
  let uname = getUserName();


  // let parsedDates = [];
  // let allData = [];
  let allData = {
    ratings: [],
    dates: [],
    results: [],
    links: [],
    opening: []
  }


  for (var i=0; i<archivedGames.length; i++) {
      // let parsedGameNode = parseGameNode(archivedGames[i],uname);
      let parsedGameNode = archivedGames[i]
      if (parsedGameNode.timeClass == timeClass){

        let rating = parsedGameNode.userRating;
        let link = parsedGameNode.gameUrl;
        let safeDate = parsedGameNode.timeStamp.replaceAll(".","-");
        let result = getResult(parsedGameNode.result);
        let opening = getMainLine(parsedGameNode.opening);

        allData.ratings.push(rating);
        allData.dates.push(safeDate);
        allData.results.push(result);
        allData.links.push(link);
        allData.opening.push(opening);

        // allData.push({ date: 
        //   `${safeDate}`, 
        //   game: {
        //     elo: rating, 
        //     link: `${link}`,
        //     result: getResult(parsedGameNode)
        //   }});
      }

  }

  console.log(allData)
  return allData;
 }

export function resetChartZoom(timeClass) {

  const ctx = document.getElementById('eloOverTime');
  const chartInstance = Chart.getChart(ctx);

  let allData = getChartData(timeClass);
  let dates = allData.dates;
  let ratings = allData.ratings;


  if (chartInstance) {
    chartInstance.data.labels = dates; 
    chartInstance.data.datasets[0].data = ratings;

    chartInstance.resetZoom();
    chartInstance.update();
    return;
  }


 
 }