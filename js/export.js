
function writeExportButton() {

    let insights = document.getElementById("insights");

    let exportDiv = document.createElement("div");
    exportDiv.classList.add("container", "exportButton" )

    let exportRow = document.createElement("div");

    btnStr = "";

    btnStr += "<div class='row mb-5'>";
        btnStr += "<div class='col'></col>";
        btnStr += "<div class='col '>";
            btnStr += "<button type='button' id='exportButton' class='btn' data-bs-toggle='modal' data-bs-target='#exportModal'>"
            btnStr += "Export your data";
            btnStr += "</button>"
        btnStr += "</div>";
    btnStr += "<div class='col'></col>";
    btnStr += "</div>";

    exportRow.innerHTML = btnStr;

    exportDiv.appendChild(exportRow)
    insights.prepend(exportDiv);

}

function rowsToCsv(csvData) {
      csvData = csvData.join('\n');
      csvFile = new Blob([csvData], {type: 'text/csv'})
  
      var a = window.document.createElement('a');
      a.href = window.URL.createObjectURL(csvFile);
  
  
      let today = new Date().toISOString().slice(0, 10)
      let uname = getUserName(); 
      let fname = `chess_com_${uname}_${today.replace("-","_")}.csv`;
  
      a.download = fname;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
}



function exportData(option) {

    let headers = ["userAccuracy", "opponentAccuracy", "gameUrl", "gameId", 
                    "timeClass", "fen", "userColor", "userRating", 
                    "opponent", "opponentRating", "opponentUrl", "result", 
                    "date", "openingUrl", "opening", "startTime", "endTime","pgn"];

    let archivedGames = getArchivedGames();


    let csvData = []

    if (option == 'all') {

        csvData.push(headers);
        for (var i=0; i<archivedGames.length; i++ ) {
            var row = [];
            let gameNode = archivedGames[i];
            let parsedGameNode = parseGameNode(gameNode);
    
            row.push(parsedGameNode.userAccuracy);
            row.push(parsedGameNode.opponentAccuracy);
            row.push(parsedGameNode.gameUrl);
            row.push(parsedGameNode.gameId);
            row.push(parsedGameNode.timeClass);
            row.push(parsedGameNode.fen);
            row.push(parsedGameNode.userColor);
            row.push(parsedGameNode.userRating);
            row.push(parsedGameNode.opponent);
            row.push(parsedGameNode.opponentRating);
            row.push(parsedGameNode.opponentUrl);
            row.push(parsedGameNode.result);
            row.push(parsedGameNode.date);
            row.push(parsedGameNode.openingUrl);
            row.push(parsedGameNode.opening);
            row.push(parsedGameNode.startTime);
            row.push(parsedGameNode.endTime);
            row.push(parsedGameNode.pgn);
            csvData.push(row);
        }
        rowsToCsv(csvData);
    }
    else if(option == "simple") {
        csvData.push(["date", "timeClass", "result", "rating", "gameUrl"]);
        for (var i=0; i<archivedGames.length; i++ ) {
            var row = [];
            let gameNode = archivedGames[i];
            let parsedGameNode = parseGameNode(gameNode);
    
            row.push(parsedGameNode.date);
            row.push(parsedGameNode.timeClass);
            row.push(parsedGameNode.result);
            row.push(parsedGameNode.userRating);
            row.push(parsedGameNode.gameUrl);
            csvData.push(row);
        }
        rowsToCsv(csvData);  
    }
    else if (option == 'pgn'){

        pgnData = "";
        for (let i=0; i<archivedGames.length; i++ ){
            parsedGameNode = parseGameNode(archivedGames[i]);
            pgnData += parsedGameNode.ogPgn; 

        }

        pgnFile = new Blob([pgnData], {type: 'text'})
  
        var a = window.document.createElement('a');
        a.href = window.URL.createObjectURL(pgnFile);
    
    
        let today = new Date().toISOString().slice(0, 10)
        let uname = getUserName(); 
        let fname = `chess_com_${uname}_${today.replace("-","_")}.pgn`;
    
        a.download = fname;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
    else if (option == 'json') {

        parsedGames = [];
        for (let i=0; i<archivedGames.length; i++ ){
            parsedGameNode = parseGameNode(archivedGames[i]);
            parsedGames.push(parsedGameNode);
        }

        jsonFile = new Blob([JSON.stringify(parsedGames)], {type: 'text/json'})
  
        var a = window.document.createElement('a');
        a.href = window.URL.createObjectURL(jsonFile);
    
    
        let today = new Date().toISOString().slice(0, 10)
        let uname = getUserName(); 
        let fname = `chess_com_${uname}_${today.replace("-","_")}.json`;
    
        a.download = fname;
        document.body.appendChild(a);

        a.click();
        document.body.removeChild(a);


    }

}


function showCustomExport(){
    document.querySelector("#exportModal > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > button:nth-child(2)").click();

    let headers = ["userAccuracy", "opponentAccuracy", "gameUrl", "gameId", 
                    "timeClass", "fen", "userColor", "userRating", 
                    "opponent", "opponentRating", "opponentUrl", "result", 
                    "date", "openingUrl", "opening", "startTime", "endTime","pgn"];

    modalBody = document.getElementById("customExportBody");

    checkBoxStr = "";
    for (let i =0; i<headers.length; i++) {
        checkBoxStr += " <div class='form-check'>";
        checkBoxStr += `<input class='form-check-input custom-check-input' value='${headers[i]}' type='checkbox' id=${headers[i]}>`;
        checkBoxStr += `<label class="form-check-label" for="${headers[i]}"></label>`;
        checkBoxStr += headers[i];
        checkBoxStr += "</label>";
        checkBoxStr += "</div>";
    }
    modalBody.innerHTML = checkBoxStr;
}


function makeCustomExport() {

    let headers = [];
    const container = document.querySelector("#customExportBody");
    const checked = container.querySelectorAll("input[type='checkbox']:checked");
    headers = Array.from(checked).map(x => x.value)

    let archivedGames = getArchivedGames();

    let csvData = [] 

    csvData.push(headers);

    for (var i=0; i<archivedGames.length; i++ ) {
        var row = [];
        let gameNode = archivedGames[i];
        let parsedGameNode = parseGameNode(gameNode);

        for (var j=0; j<headers.length; j++){
            row.push(parsedGameNode[headers[j]]);
        }

        csvData.push(row);
    }

    rowsToCsv(csvData);
}