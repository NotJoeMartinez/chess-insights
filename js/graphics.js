
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

 function graphOpenings(canvasId) {
  const ctx = document.getElementById(canvasId);
  // Chart.defaults.interaction.mode = 'nearest';
   let uname = getUserName();
    // data=[]
    // for (var i=0; i<archivedGames.length; i++){
    //     parsedGameNode = parseGameNode(archivedGames[i], uname);
    //     opening = parsedGameNode.opening;
    //     data.push(opening);
    // }
    // let labels = [... new Set(openings)];
    const labels = ["Jan", "Feb", "March", "April", "May", "June", "July"];
    const myData= {
      labels: labels,
      datasets: [{
        label: 'My First Dataset',
        data: [65, 59, 80, 81, 56, 55, 40],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(255, 205, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(201, 203, 207, 0.2)'
        ],
        borderColor: [
          'rgb(255, 99, 132)',
          'rgb(255, 159, 64)',
          'rgb(255, 205, 86)',
          'rgb(75, 192, 192)',
          'rgb(54, 162, 235)',
          'rgb(153, 102, 255)',
          'rgb(201, 203, 207)'
        ],
        borderWidth: 1
      }]
    };
  // Interaction mode is set to nearest because it was not overridden here
  new Chart(ctx, {
      type: 'line',
      data: myData 
  });
  

 
    // let label_count = [];

    // for (var i=0; i<labels.length; i++) {
    //     for (var j=0; j<openings.length; j++) {
    //         var instances = 0;
    //         if (openings[j] == labels[i])
    //         {
    //             instances++;
    //         }
    //     }
    //     if (label_count != 0) {

    //         label_count.push(instances)
    //     }
    // }
    // // console.log(`all: ${openings.length}`);
    // // console.log(`uniq: ${labels.length}`);
    // // console.log(`count ${label_count.length}`);

    // const ctx = document.getElementById(canvasId);
    // const data = {
    //     labels:labels, 
    //     datasets: [{
    //       label: 'openings',
    //       data: label_count,
    //       backgroundColor: [
    //         'rgb(255, 99, 132)',
    //         'rgb(54, 162, 235)',
    //         'rgb(255, 205, 86)'
    //       ],
    //       hoverOffset: 4
    //     }]
    //   };
    //   new Chart(ctx, {
    //     type: "pie",
    //     data: data,
    //     responsive: true
    //   });
     
 }