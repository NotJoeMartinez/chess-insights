import Chart from 'chart.js/auto'
import {LinearScale, PointElement, Tooltip, Legend, TimeScale} from "chart.js"; 
import zoomPlugin from 'chartjs-plugin-zoom';
import { getResult } from '~/utils/utils.js';
import { getMainLine } from '~/utils/openingsUtils.js';
import 'chartjs-adapter-moment';

Chart.register(zoomPlugin, LinearScale, PointElement, Tooltip, Legend, TimeScale); 

import { getArchivedGames } from '~/utils/archiveUtils.js';


export function graphElo(timeClass="rapid")  {

  
    const ctx = document.getElementById('eloOverTime');
    const chartInstance = Chart.getChart(ctx);

    let allData = getChartData(timeClass);

    const dates = allData.dates;
    const ratings = allData.ratings;
    const results = allData.results;
    const links = allData.links;
    const openings = allData.opening;
    const userColor = allData.userColor;

  let green = "#32CD32"
  let grey = "#cacac9"
  let red = "#E10600" 

  const colors = results.map(result => result === "win" ? green : result === "loss" ? red: grey);

    if (chartInstance) {
      chartInstance.data.labels = dates; 
      chartInstance.data.datasets[0].data = ratings;
      chartInstance.update();
      return;
    }


    const eloChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: dates,
          datasets: [
            {
            label: '',
            data: ratings,
            borderWidth: 0.2,
            borderColor: "#fff",
            backgroundColor: colors,
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
                    label += `${rating} (${result}) `;
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
                },
                beforeFooter: function(context) {
                  let index = context[0].dataIndex;
                  return `${userColor[index]}`;

                }
              },
            },

            zoom: {
              zoom: {
                wheel: {
                  enabled: true 
                },
                pan: {
                  enabled: true,
                  mode: 'xy'
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


 function getChartData(timeClass) {

  let archivedGames = getArchivedGames();



  let allData = {
    ratings: [],
    dates: [],
    results: [],
    links: [],
    opening: [],
    userColor: []
  }


  for (let i=0; i<archivedGames.length; i++) {
      let parsedGameNode = archivedGames[i]
      if (parsedGameNode.timeClass === timeClass){

        let rating = parsedGameNode.userRating;
        let link = parsedGameNode.gameUrl;
        let userColor = parsedGameNode.userColor;
        let safeDate = parsedGameNode.timeStamp.replaceAll(".","-");
        let result = getResult(parsedGameNode.result);
        let opening = getMainLine(parsedGameNode.opening);

        allData.userColor.push(userColor);
        allData.dates.push(safeDate);
        allData.ratings.push(rating);
        allData.links.push(link);
        allData.opening.push(opening);
        allData.results.push(result);


      }

  }

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