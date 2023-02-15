
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

    for (var i=0; i<archivedGames.length; i++)
    {
        parsedGameNode = parseGameNode(archivedGames[i],uname);
        if (parsedGameNode.timeClass == timeClass) {

            let inputDate = parsedGameNode.date;

            if (inArr(inputDate,parsedDates ) == true) {
              continue;
            }
            else {

              // find all days with input date in archivedGames 
              days = [];
              for (let j=0; j<archivedGames.length; j++){
                let currentParsedGameNode = parseGameNode(archivedGames[i])
                let currentDate = currentParsedGameNode.date 

                if (currentDate == inputDate){
                    days.push(currentParsedGameNode);
                  }
              }

          
              maxIndex = 0;
              // go through the matching days and 
              for (let k = 0; k < days.length; k++) {
                  for (let l=0; l<days[l].length; l++) {
                      if(days[k].rating > days[l].rating){
                          maxIndex = k;
                        }
                    }
                }

            parsedDates.push(inputDate);
            highestDateEloObj = days[maxIndex];

            let rating = highestDateEloObj.userRating;
            let link = highestDateEloObj.gameUrl;
            let safeDate = highestDateEloObj.date.replaceAll(".","-");

            allData.push({ date: `${safeDate}`, game: {elo: rating, link: `${link}`} });

            }
        }
    }

   

    const ctx = document.getElementById('eloOverTime');
    const eloChart = new Chart(ctx, {
        type: 'line',
        data: {
          // labels: dates,
          datasets: [
            {
            // label: 'ELO',
            data: allData,
            borderWidth: 1
            }
        ]
        },
        options: {
          parsing: {
            yAxisKey: 'game.elo',
            xAxisKey: 'date'
          },
          responsive: true
          // scales: {
          //   y: {
          //     beginAtZero: true
          //   }
          // }
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
      // if (key.length > 20) {
      //   const first20 = key.slice(0, 20);
      //   titles.push(first20);
      //   values.push(value);
      // }
      // else {
        titles.push(key);
        values.push(value);
      // }

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