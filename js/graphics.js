
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

function graphElo(timeClass="rapid")  {
    archivedGames = getArchivedGames();
    uname = getUserName();


    let data = [];
    let dates = []
    for (var i=0; i<archivedGames.length; i++)
    {
        parsedGameNode = parseGameNode(archivedGames[i],uname);
        if (parsedGameNode.timeClass == timeClass) {
            let rating = parsedGameNode.userRating;
            let date = parsedGameNode.date;
            data.push(rating)
            dates.push(date)
        }
    }

    // get min elo
    // get max elo
    const ctx = document.getElementById('eloOverTime');
    new Chart(ctx, {
        type: 'line',
        data: {
          labels: dates,
          datasets: [{
            label: 'ELO',
            data: data,
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        },
        
      });
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

  arrayLabel = ["Total", "301 Redirect", "Broken Pages (4xx Errors)", "Uncategorised HTTP Response Codes", "5xx Errors", "Unauthorised Pages", "Non-301 Redirects"]
  arrayData = [16, 1, 14, 0, 0, 0, 1];

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

  // console.log(sorte)
  // console.log(values.length)

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