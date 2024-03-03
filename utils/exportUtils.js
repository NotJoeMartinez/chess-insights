import {
    getUserName,
    getFormattedTimestamp
} from '~/utils/utils.js';
import {
    getArchivedGames,
    getPgnGames
} from '~/utils/archiveUtils.js';


export function rowsToCsv(csvData, option) {
    csvData = csvData.join('\n');
    let csvFile = new Blob([csvData], {
        type: 'text/csv'
    })

    let a = window.document.createElement('a');
    a.href = window.URL.createObjectURL(csvFile);


    let timeStamp = getFormattedTimestamp(); 
    let uname = getUserName();
    let fname = `${uname}_${option}_${timeStamp}.csv`;

    a.download = fname;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}



export function exportChessData(option) {

    let headers = [
        "userAccuracy", "opponentAccuracy", "gameUrl", "gameId",
        "timeClass", "fen", "userColor", "userRating","opponent", 
        "opponentRating", "opponentUrl", "result", "wonBy", "date", 
        "openingUrl", "opening", "startTime", "endTime", "outcome", "moveCount" 
    ];

    let archivedGames = getArchivedGames();


    let gameNodePgn = getPgnGames(archivedGames);
    if (gameNodePgn === null){
        alert("PGN data lost please download again and avoid refreshing the page");
        return;
    }

    let csvData = []

    if (option === 'all') {


        csvData.push(headers);

        for (let i = 0; i < archivedGames.length; i++) {
            let row = [];
            let parsedGameNode = archivedGames[i]; 

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
            row.push(parsedGameNode.wonBy);
            row.push(parsedGameNode.date);
            row.push(parsedGameNode.openingUrl);
            row.push(parsedGameNode.opening);
            row.push(parsedGameNode.startTime);
            row.push(parsedGameNode.endTime);
            row.push(parsedGameNode.moveCount);
            row.push(parsedGameNode.outcome);
            csvData.push(row);
        }
        rowsToCsv(csvData, "all");

    } else if (option === "simple") {
        csvData.push(["date", "timeClass", "result", "rating", "moveCount", "gameUrl"]);
        for (let i = 0; i < archivedGames.length; i++) {
            let row = [];
            let parsedGameNode = archivedGames[i];

            row.push(parsedGameNode.date);
            row.push(parsedGameNode.timeClass);
            row.push(parsedGameNode.result);
            row.push(parsedGameNode.userRating);
            row.push(parsedGameNode.gameUrl);
            row.push(parsedGameNode.moveCount);
            csvData.push(row);
        }
        rowsToCsv(csvData, "simple");

    } else if (option === 'pgn') {

        let pgnData = "";
        for (let game in gameNodePgn) {
            pgnData += gameNodePgn[game] + "\n";
        }

        let pgnFile = new Blob([pgnData], {
            type: 'text'
        })

        let a = window.document.createElement('a');
        a.href = window.URL.createObjectURL(pgnFile);


        let timeStamp = getFormattedTimestamp(); 
        let uname = getUserName();
        let fname = `${uname}_${timeStamp}.pgn`;

        a.download = fname;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

    } else if (option === 'json') {

        let parsedGames = [];
        for (let i = 0; i < archivedGames.length; i++) {
            let parsedGameNode = archivedGames[i];
            parsedGameNode.pgn = gameNodePgn[parsedGameNode.gameId];
            parsedGames.push(parsedGameNode);
        }
  
        let allJsonData = {
            "userName": getUserName(),
            "playerStats": JSON.parse(window.localStorage.getItem("playerStats")),
            "openings": JSON.parse(window.localStorage.getItem("openings")),    
            "parsedGames": parsedGames
        } 

        let jsonFile = new Blob([JSON.stringify(allJsonData)], {
            type: 'text/json'
        })

        let a = window.document.createElement('a');
        a.href = window.URL.createObjectURL(jsonFile);

        let timeStamp = getFormattedTimestamp();
        let uname = getUserName();
        let fname = `${uname}_${timeStamp}.json`;

        a.download = fname;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

    }

}


export function showCustomExport() {
    document.querySelector("#exportModal > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > button:nth-child(2)").click();

    let headers = [
        "userAccuracy", "opponentAccuracy", "gameUrl", "gameId",
        "timeClass", "fen", "userColor", "userRating", "opponent", 
        "opponentRating", "opponentUrl", "result", "date", "openingUrl", 
        "opening", "startTime", "endTime", "pgn", "moveCount", "outcome"
    ];

    let modalBody = document.getElementById("customExportBody");

    let checkBoxStr = "";

    for (let i = 0; i < headers.length; i++) {
        checkBoxStr += " <div class='form-check'>";
        checkBoxStr += `<input class='form-check-input custom-check-input' value='${headers[i]}' type='checkbox' id=${headers[i]}>`;
        checkBoxStr += `<label class="form-check-label" for="${headers[i]}"></label>`;
        checkBoxStr += headers[i];
        checkBoxStr += "</label>";
        checkBoxStr += "</div>";
    }
    modalBody.innerHTML = checkBoxStr;
}


export function makeCustomExport() {

    let headers = [];
    const container = document.querySelector("#customExportBody");
    const checked = container.querySelectorAll("input[type='checkbox']:checked");
    headers = Array.from(checked).map(x => x.value)

    let archivedGames = getArchivedGames();
    let gameNodePgn = getPgnGames(archivedGames);

    if (gameNodePgn === null){
        alert("PGN data lost please download again and avoid refreshing the page");
        return;
    }

    let csvData = []

    csvData.push(headers);

    for (let i = 0; i < archivedGames.length; i++) {
        let row = [];
        let parsedGameNode = archivedGames[i];
        for (let j = 0; j < headers.length; j++) {
            if (headers[j] === "pgn") {
                row.push(gameNodePgn[parsedGameNode.gameId].replace(/(\r\n|\r|\n)/g, ''));
                continue;
            }
            row.push(parsedGameNode[headers[j]]);
        }

        csvData.push(row);
    }

    rowsToCsv(csvData, "custom");
}