
// import { Chart } from 'chart.js';
import Chart from 'chart.js/auto'
import {LinearScale, PointElement, Tooltip, Legend, TimeScale} from "chart.js"; 
import zoomPlugin from 'chartjs-plugin-zoom';

// import moment from 'moment';
import 'chartjs-adapter-moment';

Chart.register(zoomPlugin, LinearScale, PointElement, Tooltip, Legend, TimeScale); 

import { getArchivedGames, parseGameNode} from './utils.js';

export function graphWinLoss(inputResult, timeClass="all") {
    console.log(`graphWinLoss(${inputResult}, ${timeClass})`)

    let ctx = '';
    let data = [];

    if (inputResult == "loss" ){
        ctx = document.getElementById("gamesLostBy");
        data = getLossData(timeClass)
    }
    if (inputResult == "win"){
        ctx = document.getElementById("gamesWonBy");
        data = getWinData(timeClass)
    }
    

    const chartInstance = Chart.getChart(ctx);
    if (chartInstance) {
      chartInstance.data.datasets[0].data = data;
      chartInstance.update();
      console.log("chart updated");
      return;
    }

    
    let labels = ["Abandonment", "Checkmate", "Resignation", "Timeout"];
  
  
  
    var myChart = new Chart(ctx, {
      type: "pie",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Number of games",
            data: data,
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
            ],
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true
      }
    });
  
    return myChart;
  }

  function getLossData(timeClass) {
        let archivedGames = getArchivedGames();

        let lAbandoned = 0;
        let lCheckmated = 0;
        let lResignation = 0;
        let lTimeOut = 0;
        let data = []
    
        for (var i=0; i<archivedGames.length; i++) {
          let parsedGameNode = parseGameNode(archivedGames[i]);
          let result = parsedGameNode.result;
          let nodeTimeClass = parsedGameNode.timeClass;
    
          if (timeClass != "all" && nodeTimeClass == timeClass) {
            switch (result) {
              case "abandoned":
                lAbandoned++;
                break;
              case "checkmated":
                lCheckmated++;
                break;
              case "resigned":
                lResignation++;
                break;
              case "timeout":
                lTimeOut++;
                break;
              default:
                break;
            }
          }
    
          if (timeClass == "all") {
            switch (result) {
              case "abandoned":
                lAbandoned++;
                break;
              case "checkmated":
                lCheckmated++;
                break;
              case "resigned":
                lResignation++;
                break;
              case "timeout":
                lTimeOut++;
                break;
              default:
                break;
            }
          }
    
    
          data = [lAbandoned,lCheckmated,lResignation,lTimeOut];
        }
    
        return data;
  }
  
  function getWinData(timeClass) {
        let archivedGames = getArchivedGames();
        let data = []
  
        let wAbandoned = 0;
        let wCheckmated = 0;
        let wResignation = 0;
        let wTimeOut = 0;
    
        for (var i=0; i<archivedGames.length; i++) {
          let parsedGameNode = parseGameNode(archivedGames[i]);
          let wonBy = parsedGameNode.wonBy;
          let nodeTimeClass = parsedGameNode.timeClass;
    
          // specific time class
          if (wonBy != "" && timeClass != "all" && nodeTimeClass == timeClass) {
            switch (wonBy) {
              case "abandoned":
                wAbandoned++;
                break;
              case "checkmated":
                wCheckmated++;
                break;
              case "resigned":
                wResignation++;
                break;
              case "timeout":
                wTimeOut++;
                break;
              default:
                break;
              }
            } 
    
          // all time class
          if (wonBy != "" && timeClass == "all") {
            switch (wonBy) {
              case "abandoned":
                wAbandoned++;
                break;
              case "checkmated":
                wCheckmated++;
                break;
              case "resigned":
                wResignation++;
                break;
              case "timeout":
                wTimeOut++;
                break;
              default:
                break;
    
              }
    
            } 
          data = [wAbandoned,wCheckmated,wResignation,wTimeOut];
          }
          return data;
    
  }

  