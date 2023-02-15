
function writeExportButton() {

    let insights = document.getElementById("insights");

    let exportDiv = document.createElement("div");
    exportDiv.classList.add("container", "exportButton")

    let exportRow = document.createElement("div");
    exportRow.classList.add("row", "exportButton")

    let exportButton = document.createElement("button"); 
    exportButton.setAttribute("id","exportButton");
    exportButton.setAttribute("class","btn");
    exportButton.setAttribute("onclick","exportToCSV()");
    exportButton.innerText = "Export All Data To CSV";

    exportRow.appendChild(exportButton)
    exportDiv.appendChild(exportRow)
    insights.prepend(exportDiv);

}

function exportToCSV() {

    let headers = ["userAccuracy", "opponentAccuracy", "gameUrl", "gameId", 
                    "timeClass", "fen", "userColor", "userRating", 
                    "opponent", "opponentRating", "opponentUrl", "result", 
                    "date", "openingUrl", "opening", "startTime", "endTime","pgn"];

    let csv_data = [headers]

    let archivedGames = getArchivedGames();

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

        csv_data.push(row);
    }

    // combine each row data with new line character
    csv_data = csv_data.join('\n');
    csvFile = new Blob([csv_data], {type: 'text/csv'})

    var a = window.document.createElement('a');
    a.href = window.URL.createObjectURL(csvFile);


    // let today = new Date().format('Y-m-d');   //  07-06-2016 06:38:34
    let today = new Date().toISOString().slice(0, 10)
    let uname = document.getElementById("title").textContent;
    let fname = `chess_com_${uname}_${today.replace("-","_")}.csv`;

    a.download = fname;
    // Append anchor to body.
    document.body.appendChild(a);
    a.click();

    // Remove anchor from body
    document.body.removeChild(a);

}