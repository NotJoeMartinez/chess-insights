

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
    console.log(data);

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