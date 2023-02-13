
function utcToHuman(unix_timestamp) {
  let date = new Date(unix_timestamp * 1000);
  let formattedDate = date.toISOString().substring(0, 10);
  return formattedDate;
}

function testLocalStorage() {
  let uname = window.localStorage.getItem("userName");
  let archive = window.localStorage.getItem("archivedGames");
  console.log(`archive = ${archive}`);
  console.log(`archive.length = ${archive.length}`);
  console.log(`archive = ${typeof(archive)}`);
  archiveObj = JSON.parse(archive);
  console.log(typeof(archiveObj));
  // for (var i=0; i<archive.length; i++) {
  //   console.log(`archive = ${archive[i]}`);
  // }
}

function writeInsightsDiv() {

  let mainDiv = document.getElementById("main");
  let insightsDiv = document.createElement("div");
  insightsDiv.classList.add("container", "insights")
  insightsDiv.setAttribute("id","insights");
  mainDiv.appendChild(insightsDiv);

}


function eloOverTime(gameType){

  archivedGames = getArchivedGames();
  let insightsDiv = document.getElementById("insights");
  let eloDiv = document.createElement("div");
  eloDiv.classList.add("container", "eloOverTime");
  eloDiv.innerHTML += `<h2> ${gameType} ELO Over Time </h1>`;
  eloDiv.innerHTML += "<canvas id='eloOverTime'></canvas>"
  insightsDiv.appendChild(eloDiv);
  graphElo(archivedGames, gameType);
}


function writeOpenings(archivedGames){
  let insightsDiv = document.getElementById("insights");
  let openingDiv = document.createElement("div");
  openingDiv.classList.add("container", "openings","h-50");
  let divStr  = "";
  divStr += "<h2>Openings</h1>";
  divStr += "<div class='row'> ";
  divStr += "<div class='col'> <canvas id='openings'></canvas> </div>";
  divStr += "</div> ";
  openingDiv.innerHTML += divStr;
  insightsDiv.appendChild(openingDiv);
  openingsPieChart(archivedGames, "openings");
}

function writeTable(tableTitle, tableId, tableStr){

  mainDiv = document.getElementById("insights")

  // create a div for the table
  let tableDiv = document.createElement("div"); 
  tableDiv.setAttribute("id",tableId);
  tableDiv.setAttribute("class","container");

  tableDiv.innerHTML += `<h2>${tableTitle}</h2>`;

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
      tableStr += `<td> <a href="${gameNode.url}"  target='_blank' > Link </td>`;
      tableStr += `<td> ${gameNode.date} </td>`;
      tableStr += `<td> ${gameNode.gameType} </td>`;
      tableStr += `<td> ${gameNode.color} </td>`;
      tableStr += `<td> ${gameNode.result} </td>`;
      tableStr += `<td> <a href="${gameNode.opponentUrl}"  target='_blank' > ${gameNode.opponent} </td>`;
      tableStr += `<td> ${gameNode.opponentRating} </td>`;
      tableStr += `<td>  ${gameNode.userRating} </td>`;
      tableStr += `<td> ${gameNode.opponentAccuracy} </td>`;
      tableStr += `<td> ${gameNode.userAccuracy} </td>`;
      tableStr += `<td> <a href="${gameNode.openingUrl}"  target='_blank' > ${gameNode.opening} </td>`;
      tableStr += "</tr> ";
   }

  writeTable("All Games", "gameTable", tableStr);

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

  writeTable("Overall Game Stats", "statTable", tableStr);

}


function writePlayerStats(playerStats) {

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

writeTable("Player Stats", "playerStats", tableStr);


}