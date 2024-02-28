import Chart from 'chart.js/auto'
import {LinearScale, PointElement, Tooltip, Legend, TimeScale} from "chart.js"; 
import zoomPlugin from 'chartjs-plugin-zoom';
import { getResult } from '~/utils/utils.js';
import { getMainLine } from '~/utils/openingsUtils.js';
import 'chartjs-adapter-moment';

Chart.register(zoomPlugin, LinearScale, PointElement, Tooltip, Legend, TimeScale); 

import { getArchivedGames } from '~/utils/archiveUtils.js';


export function graphElo(timeClass="rapid") {
    console.debug(`graphElo called with timeClass: ${timeClass}`);
    let ctx = document.getElementById('eloOverTime');
    let chartInstance = Chart.getChart(ctx);

    let allData = getChartData(timeClass);

    let dates = allData.dates;
    let ratings = allData.ratings;
    let results = allData.results;
    let links = allData.links;
    let openings = allData.opening;
    let userColor = allData.userColor;

    let green = "#32CD32"
    let grey = "#cacac9"
    let red = "#E10600" 
    
    let colors = results.map(result => result === "win" ? green : result === "loss" ? red: grey);

    if (chartInstance) {
        console.debug("Chart instance exists, updating data");

        // update labels
        chartInstance.data.labels = dates; 
        chartInstance.data.datasets[0].data = ratings;
        chartInstance.data.datasets[0].links = links;
        chartInstance.data.datasets[0].backgroundColor = colors;

        // update toolips 
        chartInstance.options.plugins.tooltip.callbacks = {
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
        }

        // update click handler
        chartInstance.clickHandler = function(click) {
            const points = chartInstance.getElementsAtEventForMode(click, 'nearest',
            {intersect: true}, true);
            if (points.length) {
              const firstPoint = points[0]
              let url = links[firstPoint.index]
              window.open(url, "_blank");
            }
        }

        ctx.onclick = chartInstance.clickHandler;

        console.debug(chartInstance.data.datasets);

        chartInstance.update();
        chartInstance.resetZoom();
        return chartInstance;
    }


    let eloChart = new Chart(ctx, {
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
                  enabled: true ,
                  speed: 0.02
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
      console.debug("This should not run if chart is already defined");
      ctx.onclick = clickHandler;

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
    let chartInstance = Chart.getChart(ctx);

    chartInstance.resetZoom();
}