// import { Chart } from 'chart.js';
import Chart from 'chart.js/auto'
import {LinearScale, PointElement, Tooltip, Legend, TimeScale} from "chart.js"; 
import zoomPlugin from 'chartjs-plugin-zoom';

// import moment from 'moment';
import 'chartjs-adapter-moment';

Chart.register(zoomPlugin, LinearScale, PointElement, Tooltip, Legend, TimeScale); 

import {  getUserName, } from '@/scripts/utils.js';
import { getArchivedGames, parseGameNode } from '@/scripts/archiveUtils.js';


export function graphElo(timeClass="rapid")  {

  
    const ctx = document.getElementById('eloOverTime');
    const chartInstance = Chart.getChart(ctx);

    let allData = getChartData(timeClass);

    if (chartInstance) {
      chartInstance.data.datasets[0].data = allData; 
      chartInstance.update();
      return;
    }


    // let timeFormat = "YYYY-MM-DD HH:mm";
    const eloChart = new Chart(ctx, {
        type: 'line',
        data: {
          // labels: dates,
          datasets: [
            {
            label: 'ELO',
            data: allData,
            borderWidth: 1
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
            yAxisKey: 'game.elo',
            xAxisKey: 'date'
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
                  // offset: true,
                  // autoSkip: true,
                  // // autoSkipPadding: 50,
                  // maxRotation: 90
                },
                // time: {
                  // displayFormats: {

                    // hour: 'HH:mm',
                    // minute: 'HH:mm',
                  // }
                // }
             
              },
        },

          
          plugins: {
            tooltip: {
              enabled: true,
              intersect: false,
              mode: 'index',
              borderWidth: 1
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
                // sensitivity: 1
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
          const value = eloChart.data.datasets[firstPoint.datasetIndex].data[firstPoint.index];
          window.open(value.game.link, "_blank");
        }
      }
      ctx.onclick = clickHandler;
      eloChart.update();

      return eloChart;
 }


 function getChartData(timeClass) {

  let parsedArchivedGames = getParsedArchivedGames();
  let uname = getUserName();


  // let parsedDates = [];
  let allData = [];

  for (var i=0; i<archivedGames.length; i++) {
      // let parsedGameNode = parseGameNode(archivedGames[i],uname);
      let parsedGameNode = archivedGames[i]
      if (parsedGameNode.timeClass == timeClass){
        let rating = parsedGameNode.userRating;
        let link = parsedGameNode.gameUrl;

        let safeDate = parsedGameNode.timeStamp.replaceAll(".","-");

        allData.push({ date: `${safeDate}`, game: {elo: rating, link: `${link}`} });
      }

  }
  return allData;
 }

export function resetChartZoom(timeClass) {

  const ctx = document.getElementById('eloOverTime');
  const chartInstance = Chart.getChart(ctx);

  let allData = getChartData(timeClass);

  if (chartInstance) {
    chartInstance.data.datasets[0].data = allData; 
    chartInstance.resetZoom();
    chartInstance.update();
    return;
  }


 
 }