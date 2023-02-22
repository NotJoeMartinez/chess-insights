

function writeInsightsDiv() {
  let mainDiv = document.getElementById("main");
  let insightsDiv = document.createElement("div");
  insightsDiv.classList.add("container", "insights")
  insightsDiv.setAttribute("id","insights");
  mainDiv.appendChild(insightsDiv);

}


function eloOverTime(timeClass="rapid"){

  let userStats = getPlayerStats();
  let apiTimeClass = "chess_" + timeClass;
  
  let numWins = 0;
  let numLosses = 0; 
  let numDraws = 0;


  if (userStats.hasOwnProperty(apiTimeClass)){
    numWins = userStats[apiTimeClass].record.win;
    numLosses = userStats[apiTimeClass].record.loss;
    numDraws = userStats[apiTimeClass].record.draw;
  }

  let totalGames = numWins + numDraws + numLosses;


  
  let decWins = (numWins * 100)/totalGames;
  percentWins = Math.round(decWins * 100 ) / 100;

  let decDraws = (numDraws * 100)/totalGames;
  percentDraws = Math.round(decDraws * 100)/100;

  let decLosses = (numLosses * 100)/totalGames;
  percentLosses = Math.round(decLosses * 100)/100;


  testNode = document.getElementById("eloGraph");
  if (( testNode == null ) || (testNode.timeClass != timeClass)) {

      if (testNode != null)  {
        document.getElementById("eloGraph").remove(); 
      }

      archivedGames = getArchivedGames();


      // make elo div
      let eloDiv = makeDiv(["div","container","eloOverTime"], "eloGraph",[{"timeClass":timeClass}]);

      // write title
      let eloTitle = document.createElement("h2")
      eloTitle.innerText = "ELO Over Time"
      eloDiv.appendChild(eloTitle)


      //  write card text
      let eloCard = makeDiv(classNames=["card"], id="eloCard")
      eloCard.innerHTML += `<p class="card-text"> Click data points to open game in another window </p>`;
      eloCard.innerHTML += `<p class="card-text"> Click and drag to zoom in on specific area </p>`;


      // write win loss draw percentages
      let winLossDrawRow = makeDiv(classNames=["row"], id="winLossRow")
        winLossDrawRow.innerHTML += `<div class='col'> <h3><b>${percentWins}%</b></h3> ${numWins} Won</div>`;
        winLossDrawRow.innerHTML += `<div class='col'> <h3><b>${percentDraws}%</b></h3> ${numDraws} Drawn</div>`;
        winLossDrawRow.innerHTML += `<div class='col'> <h3><b>${percentLosses}%</b></h3> ${numLosses} Lost</div>`;
      eloCard.appendChild(winLossDrawRow)


      // write win loss draw graph 
      let winLossDrawGraph = makeDiv(classNames=["progress"], id="winLossDrawGraph")
          winLossDrawGraph.innerHTML += "<div class='progress-bar' id='progWinds' role='progressbar' style='width: 49%; background-color: #85a94e;' aria-valuenow='49' aria-valuemin='0' aria-valuemax='100'>Wins</div>";
          winLossDrawGraph.innerHTML += "<div class='progress-bar ' id='progDraws' role='progressbar' style='width: 3.9%; background-color: #8b8987;' aria-valuenow='3.9' aria-valuemin='0' aria-valuemax='100'>Draws</div>";
          winLossDrawGraph.innerHTML += "<div class='progress-bar ' id='progLoss' role='progressbar' style='width: 47.1%; background-color: #b23330;' aria-valuenow='47.1' aria-valuemin='0' aria-valuemax='100'>Losses</div>"
      eloCard.appendChild(winLossDrawGraph)


      // write card body
      let cardBody = makeDiv(classNames=["card-body"], id="eloCardBody")
      let cardBodyStr = "";
      cardBodyStr += "<canvas id='eloOverTime'></canvas>"

      let btnList = ["bullet","blitz", "rapid", "daily",];
      for (var i=0; i<btnList.length; i++){
            
          if (btnList[i] == timeClass){
            cardBodyStr += "<button class='btn active ' onclick=eloOverTime('"+btnList[i]+"')>"+btnList[i].toUpperCase()+"</button>";
          }
          else {
            cardBodyStr += "<button class='btn btn-primary ' onclick=eloOverTime('"+btnList[i]+"')>"+btnList[i].toUpperCase()+"</button>";
          }
      }
      cardBody.innerHTML += cardBodyStr 
      eloCard.appendChild(cardBody)


      // make a row and append eloCard 
      let eloRow = makeDiv(classNames=["row"], id="eloCardRow")
      eloRow.appendChild(eloCard)

      // append eloRow to elo Div
      eloDiv.appendChild(eloRow)

      // append everything to insights div
      let insightsDiv = document.getElementById("insights");
      insightsDiv.insertBefore(eloDiv, insightsDiv.children[1]);
    
      graphElo(timeClass);

  }

  else {
    console.log('I already exists');
  }

}


function writeOpenings(timeClass="all"){
  testNode = document.getElementById("openings");
  if (( testNode == null ) || (testNode.timeClass != timeClass)) {

      if (testNode != null)  {


        // update card title
        let cardTitle = document.getElementById("openingsTitle");
        cardTitle.innerText = `${timeClass.toUpperCase()} Openings`;

        // remove and update graph
        document.getElementById("openings").remove(); 
        let canvas = document.createElement("canvas");
        canvas.setAttribute("id", "openings");

        cardText = document.querySelector('#openingsTitle');
        firstParagraph = openingsTitle.nextElementSibling;
        firstParagraph.after(canvas);
        
        // update buttons
        let buttons = document.querySelectorAll("#openingsGraph .btn");
        for (let i = 0; i < buttons.length; i++) {
          let button = buttons[i]; 
            for (let j = 0; j < button.classList.length; j++) {
              if (button.classList[j] == "active") {
                button.classList.remove("active");
              }
              if (button.innerText == timeClass.toUpperCase()){
                  button.classList.add("active");
                }
              }
          }


        graphOpenings(timeClass);
      }
    else {
      let insightsDiv = document.getElementById("insights");
      let openingDiv = document.createElement("div");
      openingDiv.setAttribute("id", "openingsGraph")
      openingDiv.classList.add("container", "openings",);
      let divStr  = "";

      divStr += "<div class='row'> ";
      divStr += "<div class='card'>";

      divStr += "<div class='card-body'>";
      divStr += `<h2 id="openingsTitle" class='card-title'>Top openings for <b>${timeClass.toUpperCase()}</b> games</h2>`;
      divStr += `<p class='card-text'> top 90% percentile</p>`;
      divStr += "<canvas id='openings'></canvas>";
  
  
      let btnList = ["all", "bullet", "blitz", "rapid", "daily"];
      for (var i=0; i<btnList.length; i++){
            
          if (btnList[i] == timeClass){
            divStr+= "<button class='btn btn-primary active' onclick=writeOpenings('"+btnList[i]+"')>"+btnList[i].toUpperCase()+"</button>";
          }
          else {
            divStr+= "<button class='btn btn-primary' onclick=writeOpenings('"+btnList[i]+"')>"+btnList[i].toUpperCase()+"</button>";
          }
  
      }
  
    
      divStr += "</div> ";
      divStr += "</div> ";
      divStr += "</div> ";
      openingDiv.innerHTML += divStr;
      insightsDiv.appendChild(openingDiv);
      graphOpenings(timeClass);

    }


  }
}

function writeTable( tableId, tableStr){

  mainDiv = document.getElementById("insights")

  // create a div for the table
  let tableDiv = document.createElement("div"); 
  tableDiv.setAttribute("id",tableId);
  tableDiv.setAttribute("class","container");

  // tableDiv.innerHTML += `<h2>${tableTitle}</h2>`;

  // create a table tag
  const table = document.createElement("table"); 
  table.setAttribute("class", "table")

  // add table str to tbody element 
  let tableBody = document.createElement("tbody"); 
  tableBody.innerHTML += tableStr;


  table.appendChild(tableBody);
  tableDiv.appendChild(table);
  mainDiv.appendChild(tableDiv);

 }


function writeAllGamesTable() {
  archivedGames = getArchivedGames();
  userName = window.localStorage.getItem("userName");

  let tableStr = "";
  tableStr += "<thead>";
  tableStr += "<tr>";
  tableStr += "<th scope='col'>  Url </th>";
  tableStr += "<th scope='col' > Date </th>";
  tableStr += "<th scope='col'> Game Type </th>";
  tableStr += "<th scope='col' > Color </th>";
  tableStr += "<th scope='col'> Result </th>";
  tableStr += "<th scope='col'> Opponent </th>";
  tableStr += "<th scope='col'> Opponent Rating</th>";
  tableStr += "<th scope='col'> User Rating </th>";
  tableStr += "<th scope='col'> Opponent Accuracy </th>";
  tableStr += "<th scope='col'> User Accuracy </th>";
  tableStr += "<th scope='col'> Opening </th>";
  tableStr += "</tr>";

  tableStr += "</thead>";

  for (var i=0; i < archivedGames.length; i++) {
      let gameNode = parseGameNode(archivedGames[i], userName);

      tableStr += "<tr> ";
      tableStr += `<td> <a href="${gameNode.gameUrl}"  target='_blank' > Link </td>`;
      tableStr += `<td> ${gameNode.date} </td>`;
      tableStr += `<td> ${gameNode.timeClass} </td>`;
      tableStr += `<td> ${gameNode.userColor} </td>`;
      tableStr += `<td> ${gameNode.result} </td>`;
      tableStr += `<td> <a href="${gameNode.opponentUrl}"  target='_blank' > ${gameNode.opponent} </td>`;
      tableStr += `<td> ${gameNode.opponentRating} </td>`;
      tableStr += `<td>  ${gameNode.userRating} </td>`;
      tableStr += `<td> ${gameNode.opponentAccuracy} </td>`;
      tableStr += `<td> ${gameNode.userAccuracy} </td>`;
      tableStr += `<td> <a href="${gameNode.openingUrl}"  target='_blank' > ${gameNode.opening} </td>`;
      tableStr += "</tr> ";
   }

  writeTable("gameTable", tableStr);

}

function writeGameStats(){
  let archivedGames = getArchivedGames();
  let uname = window.localStorage.getItem("userName");
  let numGames = archivedGames.length;
  let numWins = 0;
  let numLosses = 0;
  let numCheckmated = 0;
  let numStalemate = 0;
  let numTimeout= 0;
  let numDraw = 0;
  let numAgreed= 0;
  let numResigned = 0;
  let numAbandoned = 0;

  for (var i=0; i <archivedGames.length; i++){
      let gameNode = parseGameNode(archivedGames[i], uname);

      if (gameNode.result == "win") {
          numWins++;
      }

      else if (gameNode.result == "stalemate") {
          numStalemate++;
          numDraw++;
      }
      else if (gameNode.result == "agreed") {
          numAgreed++;
          numDraw++;
      }
      else if (gameNode.result == "checkmated")
      {
          numCheckmated++;
          numLosses++;
      }
      else if (gameNode.result == "timeout")
      {
          numTimeout++;
          numLosses++;
      }
      else if (gameNode.result == "resigned")
      {
          numResigned++;
          numLosses++;
      }
      else if (gameNode.result == "abandoned")
      {
          numAbandoned++;
          numLosses++;
      }


  }

  // make table header 
  let tableStr = "";
  tableStr += "<tr>";
  tableStr += "<th scope='col'>Games</th>";
  tableStr += "<th scope='col'>Wins</th>";
  tableStr += "<th scope='col'>Losses</th>";
  tableStr += "<th scope='col'>Draws</th>";
  tableStr += "</tr>";

  // make table data
  tableStr += "<tr> ";
  tableStr += `<td>${numGames}</td>`;
  tableStr += `<td>${numWins}</td>`;
  tableStr += `<td>${numLosses}</td>`;
  tableStr += `<td>${numDraw}</td>`;
  tableStr += "</tr> ";

  writeTable("statTable", tableStr);

}


function writePlayerStats() {
  playerStats = getPlayerStats(); 

  tableStr = "";

  // headers
  tableStr += "<tr>";
  tableStr += "<th></th>";
  tableStr += "<td scope='col'> Daily </td>";
  tableStr += "<td scope='col'> Rapid </td>";
  tableStr += "<td scope='col'> Bullet </td>";
  tableStr += "<td scope='col'> Blitz </td>";
  tableStr += "</tr>";

  tableStr += "<tr>";

  tableStr += `<th>Best Rated Win</th>`;

  // Daily stats
let bestDailyRating = "N/A";
let bestDailyRatingDate = "N/A";
let bestDailyRatingUrl = "";

if (playerStats.hasOwnProperty("chess_daily")){
  if (playerStats.chess_daily.record.win > 0) {
      bestDailyRating =  playerStats.chess_daily.best.rating;
    if (playerStats.chess_daily.hasOwnProperty("game")) {
      bestDailyRatingUrl =  playerStats.chess_daily.best.game;
      let utc_timestamp = playerStats.chess_daily.best.date
      bestDailyRatingDate = utcToHuman(utc_timestamp);

    }
  }
}

// Rapid stats
let bestRapidRating = "N/A"; 
let bestRapidRatingDate = "N/A"; 
let bestRapidRatingUrl = ""; 

if (playerStats.hasOwnProperty("chess_rapid")) {
  if (playerStats.chess_rapid.record.win > 0) {
        bestRapidRating = playerStats.chess_rapid.best.rating;
    if (playerStats.chess_rapid.best.hasOwnProperty("game")) {
        bestRapidRatingUrl = playerStats.chess_rapid.best.game;
        let utc_timestamp = playerStats.chess_rapid.best.date;
        bestRapidRatingDate = utcToHuman(utc_timestamp); 
      }
    }
}

  // Bullet stats
let bestBulletRating = "N/A";
let bestBulletRatingDate = "N/A";
let bestBulletRatingUrl = "";

if (playerStats.hasOwnProperty("chess_bullet")){ 
  if (playerStats.chess_bullet.record.win > 0) {
      bestBulletRating =  playerStats.chess_bullet.best.rating;
    if (playerStats.chess_bullet.best.hasOwnProperty("game")) {
      bestBulletRatingUrl = playerStats.chess_bullet.best.game;
      let utc_timestamp = playerStats.chess_bullet.best.date;
      bestBulletRatingDate = utcToHuman(utc_timestamp);
    }
  }
}

// Blitz Stats
let bestBlitzRating = "N/A";
let bestBlitzRatingDate = "N/A";
let bestBlitzRatingUrl = "";

if (playerStats.hasOwnProperty("chess_blitz")) {
  if (playerStats.chess_blitz.record.win > 0) {
      bestBlitzRating = playerStats.chess_blitz.best.rating;
    if (playerStats.chess_blitz.best.hasOwnProperty("game")) {
      bestBlitzRatingUrl =  playerStats.chess_blitz.best.game;
      let utc_timestamp = playerStats.chess_blitz.best.date;
      bestBlitzRatingDate = utcToHuman(utc_timestamp)
    }
  }
}


if (bestDailyRatingUrl != "" ) {
  tableStr += `<td> <a href="${bestDailyRatingUrl}"  target='_blank' > ${bestDailyRating}</td>`;
}
else {
  tableStr += `<td>${bestDailyRating}</td>`;
}

// rapid
if ( bestRapidRatingUrl != ""){
  tableStr += `<td> <a href="${bestRapidRatingUrl}"  target='_blank' > ${bestRapidRating}</td>`;
}
else {
  tableStr += `<td> ${bestRapidRating}</td>`;
}

// 
if (bestBulletRatingUrl != "") {
  tableStr += `<td> <a href="${bestBulletRatingUrl}"  target='_blank' > ${bestBulletRating}</td>`;
}
else {
  tableStr += `<td> ${bestBulletRating}</td>`;
}

// blitz
if (bestBlitzRatingUrl != "") {
  tableStr += `<td> <a href="${bestBlitzRatingUrl}"  target='_blank' > ${bestBlitzRating}</td>`;
}
else {
  tableStr += `<td>${bestBlitzRating}</td>`;
}
  
tableStr += "</tr>";

tableStr += "<tr>";

tableStr += `<th>Date</th>`;
tableStr += `<td>${bestDailyRatingDate}</td>`;
tableStr += `<td>${bestRapidRatingDate}</td>`;
tableStr += `<td>${bestBulletRatingDate}</td>`;
tableStr += `<td>${bestBlitzRatingDate}</td>`;

tableStr += "</tr>";

writeTable("playerStats", tableStr);


}


function writeLoss() {

  let mainDiv = document.getElementById("main");
  let insightsDiv = document.getElementById("insights");

  let container = makeDiv(["container","loss-by"], id="lossContainer");
  let row = makeDiv(["row", "loss-by"]);
  let card = makeDiv(["card", "loss-by"]);
  let cardText = makeDiv(["card-text"]);
  let cardTitle = makeDiv(["card-title"]);
  cardTitle.innerHTML += "<h2> Games You Lost By</h2>";
  let cardBody = makeDiv(["card-body"]);
  let canvas = document.createElement("canvas");
  canvas.setAttribute("id","GamesLostBy");


  // append the things
  cardBody.appendChild(cardTitle);
  cardBody.appendChild(cardText);
  cardBody.appendChild(canvas);
  card.appendChild(cardBody);
  row.appendChild(card);
  container.appendChild(row)
  insightsDiv.appendChild(container)
  // insert the lost Container into the main div
  mainDiv.appendChild(insightsDiv)

  graphWinLoss("GamesLostBy", "loss");
}


function writeWon() {

  let mainDiv = document.getElementById("main");
  let insightsDiv = document.getElementById("insights");

  let container = makeDiv(["container","won-by"], id="wonContainer");
  let row = makeDiv(["row", "won-by"]);
  let card = makeDiv(["card", "won-by"]);
  let cardText = makeDiv(["card-text"]);
  let cardTitle = makeDiv(["card-title"]);
  cardTitle.innerHTML += "<h2> Games You won By</h2>";
  let cardBody = makeDiv(["card-body"]);
  let canvas = document.createElement("canvas");
  canvas.setAttribute("id","gamesWonBy");


  // append the things
  cardBody.appendChild(cardTitle);
  cardBody.appendChild(cardText);
  cardBody.appendChild(canvas);
  card.appendChild(cardBody);
  row.appendChild(card);
  container.appendChild(row)
  insightsDiv.appendChild(container)
  // insert the lost Container into the main div
  mainDiv.appendChild(insightsDiv)

  graphWinLoss("gamesWonBy", "win");
}
