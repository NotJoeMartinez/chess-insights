
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


function graphElo(archivedGames,gameType)  {

    uname = getUserName();
    let data = [];
    let dates = []
    for (var i=0; i<archivedGames.length; i++)
    {
        parsedGameNode = parseGameNode(archivedGames[i],uname);
        if (parsedGameNode.gameType == gameType) {
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
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
 }

 function openingsPieChart(archivedGames, canvasId) {

    let uname = getUserName();
    openings=[]
    for (var i=0; i<archivedGames.length; i++){
        parsedGameNode = parseGameNode(archivedGames[i], uname);
        opening = parsedGameNode.opening;
        openings.push(opening);
    }
    let labels = [... new Set(openings)];

    let label_count = [];

    for (var i=0; i<labels.length; i++) {
        for (var j=0; j<openings.length; j++) {
            var instances = 0;
            if (openings[j] == labels[i])
            {
                instances++;
            }
        }
        if (label_count != 0) {

            label_count.push(instances)
        }
    }
    console.log(`all: ${openings.length}`);
    console.log(`uniq: ${labels.length}`);
    console.log(`count ${label_count.length}`);

    const ctx = document.getElementById(canvasId);
    const data = {
        labels:labels, 
        datasets: [{
          label: 'openings',
          data: label_count,
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)'
          ],
          hoverOffset: 4
        }]
      };
      new Chart(ctx, {
        type: "pie",
        data: data,
        responsive: true
      });
     
 }