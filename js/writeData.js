
 function writeTable(tableTitle, tableId, tableStr){

  mainDiv = document.getElementById("container")

  // create a div for the table
  let tableDiv = document.createElement("div"); 
  tableDiv.setAttribute("id",tableId);

  tableDiv.innerHTML += `<h4>${tableTitle}</h4>`;

  // create a table tag
  const table = document.createElement("table"); 
  let tableBody = document.createElement("tbody"); 

  // let tableStr = "";
  // tableStr += "<tr>";
  // for (var i=0; i<tableHeaders.length; i++) {
  //   tableStr += `<th> ${table} </th>`;
  // }
  // tableStr += "</tr>";
  

  tableBody.innerHTML += tableStr;

  table.appendChild(tableBody);
  tableDiv.appendChild(table);
  mainDiv.appendChild(tableDiv);

 }

function writeArchiveGameUrls(archiveGameUrls, userName) {

  // const mainDiv = document.getElementById("container")
  

  // // create a div for the table
  // let gameTableDiv = document.createElement("div"); 
  // gameTableDiv.setAttribute("id",'gameTable');

  // gameTableDiv.innerHTML += "<h4>All Games</h4>";

  // // create a table tag
  // const gameTable = document.createElement("table"); 
  // let gameTableBody = document.createElement("tbody"); 

  let tableStr = "";
  tableStr += "<tr>";
  tableStr += "<th> Url </th>";
  tableStr += "<th> Date </th>";
  tableStr += "<th> Game Type </th>";
  tableStr += "<th> Color </th>";
  tableStr += "<th> Result </th>";
  tableStr += "<th> Opponent </th>";
  tableStr += "<th> Opening </th>";
  tableStr += "</tr>";

  for (var i=0; i < archiveGameUrls.length; i++) {
      let gameNode = parseGameNode(archiveGameUrls[i], userName);
      let gameUrl = gameNode.url;
      let gameColor = gameNode.color;
      let gameResult = gameNode.result;
      let gameOpponent = gameNode.opponent;
      tableStr += "<tr> ";
      tableStr += `<td> <a href="${gameUrl}"  target='_blank' > Link </td>`;
      tableStr += `<td> ${gameNode.date} </td>`;
      tableStr += `<td> ${gameNode.gameType} </td>`;
      tableStr += `<td> ${gameColor} </td>`;
      tableStr += `<td> ${gameResult} </td>`;
      tableStr += `<td> <a href="${gameNode.opponentUrl}"  target='_blank' > ${gameOpponent} </td>`;
      tableStr += `<td> <a href="${gameNode.openingUrl}"  target='_blank' > ${gameNode.opening} </td>`;
      tableStr += "</tr> ";
   }


  writeTable("All Games", "gameTable", tableStr);
  

  // gameTableBody.innerHTML += tableStr;
  // gameTable.appendChild(gameTableBody);
  // gameTableDiv.appendChild(gameTable);
  // mainDiv.appendChild(gameTableDiv);
}

function writeGameStats(archivedGames, uname){

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

  const mainDiv = document.getElementById("container")

  // create a div for the table
  let statTableDiv = document.createElement("div"); 
  statTableDiv.setAttribute("id",'statTable');

  statTableDiv.innerHTML += "<h4>Game Stats</h4>";

  // create a table tag
  const statTable = document.createElement("table"); 
  let statTableBody = document.createElement("tbody"); 



  let tableStr = "";
  tableStr += "<tr>";
  tableStr += "<th> Games Played </th>";
  tableStr += "<th> Wins </th>";
  tableStr += "<th> Losses </th>";
  tableStr += "<th> Draws </th>";
  tableStr += "</tr>";


  tableStr += "<tr> ";
  tableStr += `<td> ${numGames} </td>`;
  tableStr += `<td> ${numWins} </td>`;
  tableStr += `<td> ${numLosses} </td>`;
  tableStr += `<td> ${numDraw} </td>`;
  tableStr += "</tr> ";

   statTableBody.innerHTML += tableStr;
   statTable.appendChild(statTableBody);
   statTableDiv.appendChild(statTable);

   mainDiv.appendChild(statTableDiv);

}



// function writePlayerStats(playerStats) {



// }