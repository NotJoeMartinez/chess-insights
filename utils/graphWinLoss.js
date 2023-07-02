// import { Chart } from 'chart.js';
import Chart from 'chart.js/auto'
import {
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  TimeScale
} from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
// import zoomPlugin from 'chartjs-plugin-zoom';

// import moment from 'moment';
import 'chartjs-adapter-moment';

// Chart.register(zoomPlugin, LinearScale, PointElement, Tooltip, Legend, TimeScale);
Chart.register(LinearScale, PointElement, Tooltip, Legend, TimeScale);

import {
  getArchivedGames
} from '~/utils/archiveUtils.js';

export function graphWinLoss(inputResult, timeClass = "all") {

  let ctx = '';
  let data = [];
  let labels = [];
  // let colorObj = {}

  if (inputResult == "loss") {
    ctx = document.getElementById("gamesLostBy");
    data = getLossData(timeClass)
    labels = ["Abandonment", "Checkmate", "Resignation", "Timeout"];
    // colorObj = getColors("loss")

  }
  if (inputResult == "win") {
    ctx = document.getElementById("gamesWonBy");
    data = getWinData(timeClass)
    labels = ["Abandonment", "Checkmate", "Resignation", "Timeout"];
    // colorObj = getColors("win")

  }
  if (inputResult == "draw") {
    ctx = document.getElementById("gamesDrawnBy");
    data = getDrawData(timeClass)
    labels = ["Agreement", "Stalemate", "Repetition", "Insufficient"];
    // colorObj = getColors("draw")
  }



  const chartInstance = Chart.getChart(ctx);
  if (chartInstance) {
    chartInstance.data.datasets[0].data = data;
    chartInstance.update();
    console.log("chart updated");
    return;
  }





  var myChart = new Chart(ctx, {
    type: "doughnut",
    plugins: [ChartDataLabels],
    data: {
      labels: labels,
      datasets: [{
        label: "Number of games",
        data: data,
        // backgroundColor: colorObj.backgroundColor,
        // borderColor: colorObj.borderColor,
        // hoverBackgroundColor: colorObj.hoverBackgroundColor,
        backgroundColor: [
          "rgba(91, 138, 99, 1)",
          "rgba(138, 91, 121, 1)",
          "rgba(136, 122, 91, 1)",
          "rgba(91, 106, 138, 1)"
        ],
        borderColor: [
          "rgba(91, 138, 99, 1)",
          "rgba(138, 91, 121, 1)",
          "rgba(136, 122, 91, 1)",
          "rgba(91, 106, 138, 1)"
        ],
        hoverBackgroundColor: [
          "rgba(91, 138, 99, 0.8)",
          "rgba(138, 91, 121, 0.8)",
          "rgba(136, 122, 91, 0.8)",
          "rgba(91, 106, 138, 0.8)"
        ],

        hoverOffset: 30,
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        datalabels: {
          color: '#ffffff',
          anchor: 'center',
          display: 'auto',
          formatter: (value, context) => {
            const label = context.chart.data.labels[context.dataIndex];
            return label;
          }
        }
      }
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

  for (var i = 0; i < archivedGames.length; i++) {
    let parsedGameNode = archivedGames[i];
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


    data = [lAbandoned, lCheckmated, lResignation, lTimeOut];
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

  for (var i = 0; i < archivedGames.length; i++) {
    let parsedGameNode = archivedGames[i];
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
    data = [wAbandoned, wCheckmated, wResignation, wTimeOut];
  }
  return data;

}

function getDrawData(timeClass) {
  let archivedGames = getArchivedGames();
  let data = []

  let agreed = 0;
  let stalemate = 0;
  let repetition = 0;
  let m_insufficient = 0;

  for (var i = 0; i < archivedGames.length; i++) {
    let parsedGameNode = archivedGames[i];
    let nodeTimeClass = parsedGameNode.timeClass;
    let result = parsedGameNode.result;

    // specific time class
    if (timeClass != "all" && nodeTimeClass == timeClass) {
      switch (result) {
        case "agreed":
          agreed++;
          break;
        case "stalemate":
          stalemate++;
          break;
        case "repetition":
          repetition++;
          break;
        case "insufficient":
          m_insufficient++;
          break;
        default:
          break;
      }
    }

    // all time class
    if (timeClass == "all") {
      switch (result) {
        case "agreed":
          agreed++;
          break;
        case "stalemate":
          stalemate++;
          break;
        case "repetition":
          repetition++;
          break;
        case "insufficient":
          m_insufficient++;
          break;
        default:
          break;
      }

    }
    data = [agreed, stalemate, repetition, m_insufficient]
  }
  return data;
}

function getColors(mode) {
  let colorObj = {}
  if (mode == "win") {
    colorObj.backgroundColor = [
        "rgba(91, 138, 99, 1)",
        "rgba(138, 91, 121, 1)",
        "rgba(136, 122, 91, 1)",
        "rgba(91, 106, 138, 1)"
      ],
      colorObj.borderColor = [
        "rgba(91, 138, 99, 1)",
        "rgba(138, 91, 121, 1)",
        "rgba(136, 122, 91, 1)",
        "rgba(91, 106, 138, 1)"
      ],
      colorObj.hoverBackgroundColor = [
        "rgba(91, 138, 99, 0.8)",
        "rgba(138, 91, 121, 0.8)",
        "rgba(136, 122, 91, 0.8)",
        "rgba(91, 106, 138, 0.8)"
      ]
  }


  if (mode == "loss") {
    colorObj.backgroundColor = [
      "rgba(51, 178, 48, 1)",
      "rgba(52, 202, 49, 1)",
      "rgba(51, 178, 48, 1)",
      "rgba(52, 202, 49, 1)"
    ]
    colorObj.borderColor= [
      "rgba(51, 178, 48, 1)",
      "rgba(52, 202, 49, 1)",
      "rgba(51, 178, 48, 1)",
      "rgba(52, 202, 49, 1)"
    ]
    colorObj.hoverBackgroundColor =[
      "rgba(51, 178, 48, 0.8)",
      "rgba(52, 202, 49, 0.8)",
      "rgba(51, 178, 48, 0.8)",
      "rgba(52, 202, 49, 0.8)"
    ]
  }

  if (mode == "draw") {
    colorObj.backgroundColor = [
      "rgba(189, 190, 185, 1)",
      "rgba(137, 139, 139, 1)",
      "rgba(101, 102, 102, 1)",
      "rgba(216, 218, 218, 1)"
    ]
    colorObj.borderColor = [
      "rgba(189, 190, 185, 1)",
      "rgba(137, 139, 139, 1)",
      "rgba(101, 102, 102, 1)",
      "rgba(216, 218, 218, 1)"
    ]
    colorObj.hoverBackgroundColor =  [
      "rgba(189, 190, 185, 0.8)",
      "rgba(137, 139, 139, 0.8)",
      "rgba(101, 102, 102, 0.8)",
      "rgba(216, 218, 218, 0.8)"
    ]

  }
  return colorObj

}