
function toggleSpinner() {
  if (document.contains(document.getElementById("spinner-div"))) {
      document.getElementById("spinner-div").remove();
  }
  else {
      let spinnerDiv = document.createElement("div");
      spinnerDiv.setAttribute("id","spinner-div");
      spinnerDiv.setAttribute("class","container");

      let spinner = document.createElement("div");
      spinner.setAttribute("class","spinner-border")

      spinnerDiv.appendChild(spinner)

      let mainDiv = document.getElementById("main");
      mainDiv.appendChild(spinnerDiv);

  }
}

function progressBar(prog) {
  // if there is no progress bar write one  
  let progExists = document.contains(document.getElementById("progress-div"))
  if (progExists != true && prog < 100) {

      let progDiv = document.createElement("div");
      progDiv.setAttribute("id","progress-div");
      progDiv.setAttribute("class","container");

      let progStr = "";
      progStr+="<div class='progress'>";
      progStr+="<div id='progBar' class='progress-bar' role='progressbar' aria-label='Example with label'"; 
      progStr+=`style='width: ${prog}%;' aria-valuenow='prog' aria-valuemin='0' aria-valuemax='100'>${prog}%</div>`;
      progStr+= "</div>";


      progDiv.innerHTML += progStr;

      let mainDiv = document.getElementById("main");
      mainDiv.appendChild(progDiv);
  }
  // if the bar exists update the values
  if ((progExists == true) && (prog < 100) ){
      let progBar = document.getElementById("progBar");
      let style = `width: ${prog}%;`;
      progBar.style = style;
      progBar.innerText = `${prog}%`;
  }

  if (prog == "remove"){
    document.getElementById("progress-div").remove();
  }



}

function inArr(str, arr) {
  for (var i = 0; i<arr.length; i++){
    if (arr[i] == str){
      return true;
    }
  }
  return false;
}

function graphElo(timeClass="rapid")  {
    archivedGames = getArchivedGames();
    uname = getUserName();


    let parsedDates = [];
    let allData = [];

    for (var i=0; i<archivedGames.length; i++) {
        parsedGameNode = parseGameNode(archivedGames[i],uname);
        if (parsedGameNode.timeClass == timeClass){
          let rating = parsedGameNode.userRating;
          let link = parsedGameNode.gameUrl;
          let safeDate = parsedGameNode.timeStamp.replaceAll(".","-");
          allData.push({ date: `${safeDate}`, game: {elo: rating, link: `${link}`} });
        }


    }
  

   

    const ctx = document.getElementById('eloOverTime');
    // let timeFormat = "MM/DD/YYYY HH:mm";
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

          parsing: {
            yAxisKey: 'game.elo',
            xAxisKey: 'date'
          },
          xAxes: [
            {
              type: "time",
              // time: {
                // parser: timeFormat
                // unit: "minute",
                // displayFormats: {
                  // minute: "YYYY-MM-DD:hh:mm"
                  // second: "MM/DD/YYYY HH:mm"
                // }
              // }
            }
          ],
          plugins: {
            zoom: {
              zoom: {
                wheel: {
                  enabled: false,
                },
                // pan: {
                //   enabled: true
                // },
                // drag: {
                //   enabled: true
                // },
                limits: {
                    y: {min: 100, max: 1000},
                    x: {min: 100, max: 1000}
                  },
                mode: 'xy',
                sensitivity: 1
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

      // ctx.register(zoomPlugin);
 }



 function graphOpenings(timeClass="all") {
  const ctx = document.getElementById("openings");

  archivedGames = getArchivedGames();
  uname = getUserName();

  
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

  

  const sortedOpeningData = {};

  for (let i = 0; i < archivedGames.length; i++) {

  }
  

  

  let allNumbers = []

  for (const [key, value] of Object.entries(openingData)) {
    allNumbers.push(value)
  }

  let titles = []
  let values = []

  for (const [key, value] of Object.entries(openingData)) {
    // console.log(`${value}/${total} = ` + value/total );
    if (isTop90Percentile(value, allNumbers)) {
        titles.push(key);
        values.push(value);
    }
  }


  arrayOfObj = titles.map(function(d, i) {
    return {
      label: d,
      data: values[i] || 0
    };
  });

  sortedArrayOfObj = arrayOfObj.sort(function(a, b) {
    return b.data>a.data;
  });

  sortedTitles = [];
  sortedValues = [];

  sortedArrayOfObj.forEach(function(d){
    sortedTitles.push(d.label);
    sortedValues.push(d.data);
  })


  var myChart = new Chart(ctx, {
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

 }

function graphLosses(canvasId) {

  archivedGames = getArchivedGames();
  userName = window.localStorage.getItem("userName");
  ctx = document.getElementById(canvasId);

  lAbandoned = 0;
  lCheckmated = 0;
  lResignation = 0;
  lTimeOut = 0;

  for (var i=0; i<archivedGames.length; i++) {
    parsedGameNode = parseGameNode(archivedGames[i]);
    let result = parsedGameNode.result;
    switch (result) {
      case "abandoned":
        lAbandoned++;
      case "checkmated":
        lCheckmated++;
      case "resigned":
        lResignation++;
      case "timeout":
        lTimeOut++;

    }
  }

  labels = ["Abandonment", "Checkmate", "Resignation", "Timeout"];
  data = [lAbandoned,lCheckmated,lResignation,lTimeOut];
  var myChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Games You Lost By",
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

}