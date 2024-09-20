import { utcToHuman } from "~/utils/utils.js";

export function parseAndSaveArchivedGames(archivedGames) {
    let parsedArchivedGames = []

    let pgnGames = {}

    for (let i = 0; i < archivedGames.length; i++) {
        let gameNode = parseGameNode(archivedGames[i])
        pgnGames[gameNode.gameId] = gameNode.ogPgn
        delete gameNode.ogPgn
        parsedArchivedGames.push(gameNode)

    }

    savePgnGames(pgnGames)

    try {
        window.localStorage.setItem("archivedGames", JSON.stringify(parsedArchivedGames));
        console.log("archivedGames saved to local storage")
    } catch (err) {
        let inlineStorage = document.createElement("div");
        let appDiv = document.getElementById("app");
        inlineStorage.setAttribute("id", "archivedGames");
        inlineStorage.setAttribute("hidden", "hidden");
        inlineStorage.textContent = JSON.stringify(parsedArchivedGames);
        appDiv.appendChild(inlineStorage);
        console.log("archived games saved to inline storage")

    }

}

export function verifyLiveChess(gameNode) {

    try {
        if ((gameNode.rules === "chess" )) {
            return true;
        } else {
            return false;
        }

    } catch (error) {
        return false
    }
}

export function parseGameNode(gameNode) {
    let refId = "?ref_id=74104030"
    let uname = window.localStorage.getItem("userName");

    let parsedGameNode = {};

    // easy ones
    parsedGameNode["unixTimeStamp"] = gameNode.end_time;
    parsedGameNode["timeClass"] = gameNode.time_class;
    parsedGameNode["gameUrl"] = gameNode.url + refId; 
    parsedGameNode["fen"] = gameNode.fen;
    parsedGameNode["timeStamp"] = utcToHuman(gameNode.end_time);

    let ogPgn = gameNode.pgn;
    let stripedPgn = ogPgn.replace(/(\r\n|\r|\n)/g, '');
    parsedGameNode["pgn"] = stripedPgn;

    parsedGameNode["ogPgn"] = gameNode.pgn;

    // find game color
    if (gameNode.white.username.toUpperCase() === uname.toUpperCase()) {
        parsedGameNode["userColor"] = "white";
        parsedGameNode["result"] = gameNode.white.result;
        parsedGameNode["opponent"] = gameNode.black.username;
        parsedGameNode["opponentUrl"] = `https://www.chess.com/member/${gameNode.black.username}`;

        parsedGameNode["opponentRating"] = gameNode.black.rating;
        parsedGameNode["userRating"] = gameNode.white.rating;

        // eslint-disable-next-line no-prototype-builtins
        if (gameNode.hasOwnProperty("accuracies")) {
            parsedGameNode["userAccuracy"] = gameNode.accuracies.white;
            parsedGameNode["opponentAccuracy"] = gameNode.accuracies.black;
        } else {
            parsedGameNode["userAccuracy"] = "";
            parsedGameNode["opponentAccuracy"] = "";
        }

    } else {
        parsedGameNode["userColor"] = "black";
        parsedGameNode["result"] = gameNode.black.result;
        parsedGameNode["opponent"] = gameNode.white.username;
        parsedGameNode["opponentUrl"] = `https://www.chess.com/member/${gameNode.white.username}`;

        parsedGameNode["opponentRating"] = gameNode.white.rating;
        parsedGameNode["userRating"] = gameNode.black.rating;

        // eslint-disable-next-line no-prototype-builtins
        if (gameNode.hasOwnProperty("accuracies")) {
            parsedGameNode["userAccuracy"] = gameNode.accuracies.black;
            parsedGameNode["opponentAccuracy"] = gameNode.accuracies.white;
        } else {
            parsedGameNode["userAccuracy"] = "";
            parsedGameNode["opponentAccuracy"] = "";
        }

    }

    // find out how you won and the title of the outcome
    parsedGameNode["wonBy"] = "";
    parsedGameNode["outcome"] = ""; 

    if ((parsedGameNode.userColor === "white") && (parsedGameNode.result === "win")) {

        let result = gameNode.black.result;

        if (result === "checkmated") {
            parsedGameNode["wonBy"] = "checkmate";
        }
        else {
            parsedGameNode["wonBy"] = result; 
        }
    }
    if ((parsedGameNode.userColor === "black") && (parsedGameNode.result === "win")) {
        let result = gameNode.white.result;
        if (result === "checkmated") {
            parsedGameNode["wonBy"] = "checkmate";
        }
        else {
            parsedGameNode["wonBy"] = result;
        }
    } 


    if (parsedGameNode.userColor === "white") {
        if (parsedGameNode.result === "win") {
            parsedGameNode["outcome"] = gameNode.black.result; 
        }
        else if (parsedGameNode.result === "loss") {
            parsedGameNode["outcome"] = gameNode.white.result;
        }
        else {
            parsedGameNode["outcome"] = gameNode.white.result; 
        }
    }
    else {
        if (parsedGameNode.result === "win") {
            parsedGameNode["outcome"] = gameNode.white.result;
        }
        else {
            parsedGameNode["outcome"] = gameNode.black.result;
        }
    }


 

    // pgn parsing
    let pgn = gameNode.pgn.split('\n');
    // eslint-disable-next-line no-useless-escape
    parsedGameNode["date"] = pgn[2].replace(/\\|\[|\]|\"|Date/g, '');

    // find opening url. The fact we have to do this means something is broken
    let openingUrl = "";
    for (let i = 0; i < pgn.length; i++) {
        if (pgn[i].startsWith("[ECOUrl")) {
            openingUrl = pgn[i];
            break;
        }
    }
    // eslint-disable-next-line no-useless-escape
    parsedGameNode["openingUrl"] = openingUrl.replace(/\\|\[|\]|\"|ECOUrl/g, '');
    // eslint-disable-next-line no-useless-escape
    let tmp_opening = openingUrl.replace(/\\|\[|\]|\"|ECOUrl|https:\/\/www.chess.com\/openings\//g, '');
    parsedGameNode["opening"] = tmp_opening.replace(/-/g, " ");
    parsedGameNode["opening"] = parsedGameNode["opening"].trimStart();

    let mainLine = parsedGameNode["opening"].match(/^(\D*)(?=\d)/);
    if (mainLine) {
        parsedGameNode["mainLineOpening"] = mainLine[1];
    } else {
        parsedGameNode["mainLineOpening"] = parsedGameNode["opening"];
    }

    // start and end time
    if (gameNode.hasOwnProperty("tournament")){
        parsedGameNode["startTime"] = pgn[18].replace(/\s|\[StartTime|\]|\"/g, '');
        parsedGameNode["endTime"] = pgn[20].replace(/\s|\[EndTime|\]|\"/g, '');
    }   
    else {
        parsedGameNode["startTime"] = pgn[17].replace(/\s|\[StartTime|\]|\"/g, '');
        parsedGameNode["endTime"] = pgn[19].replace(/\s|\[EndTime|\]|\"/g, '');
    }


    // time played
    if (parsedGameNode["timeClass"] === "daily") {
        parsedGameNode["timePlayed"] = 0;
    }
    else {
        let timePlayed = getSecondsBetween(parsedGameNode["startTime"], parsedGameNode["endTime"]);
        if (timePlayed < 0) {
            console.log(`error: date: ${parsedGameNode["date"]} startTime: ${parsedGameNode["startTime"]} endTime: ${parsedGameNode["endTime"]} timePlayed: ${timePlayed}`);
        }
        parsedGameNode["timePlayed"] = timePlayed;
    }


    // move numbers 
    parsedGameNode["moveCount"] = countMoves(parsedGameNode.pgn);

    // ugly  
    parsedGameNode["gameId"] = parsedGameNode["gameUrl"].split('/').pop().split('?')[0];
    parsedGameNode.gameId = parsedGameNode.gameId;

    delete parsedGameNode.pgn
    // main line openings 
    return parsedGameNode;
}

export function savePgnGames(pgn){
    let inlineStorage = document.createElement("div");
    let appDiv = document.getElementById("app");
    inlineStorage.setAttribute("id", "pgnGames");
    inlineStorage.setAttribute("hidden", "hidden");
    inlineStorage.textContent = JSON.stringify(pgn);
    appDiv.appendChild(inlineStorage);
    console.log("pgnGames saved");
}

export function getPgnGames(){
    if (document.getElementById("pgnGames") !== null) {
        let inlineDiv = document.getElementById("pgnGames");
        let archive = inlineDiv.textContent;
        return JSON.parse(archive);
    }
    else {
        return null;
    }
}


export function getSecondsBetween(startTime, endTime) {
    // Create Date objects from the start and end times
    const startDate = new Date(`1970-01-01T${startTime}Z`);
    const endDate = new Date(`1970-01-01T${endTime}Z`);

    // Get the difference in milliseconds
    let diff = endDate - startDate;

    // If the difference is negative, add 24 hours to the difference
    if (diff < 0) {
        diff += 24 * 60 * 60 * 1000;
    }

    // Convert to seconds and return
    return diff / 1000;
}

export function getTotalTimePlayed() {
    let archivedGames = getArchivedGames();
    let totalSeconds = 0;
    for (let i = 0; i < archivedGames.length; i++) {
        totalSeconds += archivedGames[i].timePlayed; 
    }

    let days = Math.floor(totalSeconds / 86400);
    let hours = Math.floor(totalSeconds / 3600);
    let minutes = Math.floor((totalSeconds - (hours * 3600)) / 60);
    let seconds = totalSeconds - (hours * 3600) - (minutes * 60);

    let returnString = "";


    if (hours > 0) {
        returnString += hours + " hours ";
    }
    if (minutes > 0) {
        returnString += minutes + " minutes ";
    }
    if (seconds > 0) {
        returnString += seconds + " seconds ";
    }

    return returnString;
}

export function getArchivedGames() {

    if (window.localStorage.getItem("archivedGames") !== null) {
        console.log("archivedGames found in local storage")
        let archive = window.localStorage.getItem("archivedGames");
        return JSON.parse(archive);
    } 
    else if (document.getElementById("archivedGames") !== null) {
        console.log("archivedGames not found in local storage")
        let inlineDiv = document.getElementById("archivedGames");
        let archive = inlineDiv.textContent;
        return JSON.parse(archive);
    }
    else {
        console.log("no archivedGames found")
        return null;
    }

}


function countMoves(gameString) {

    for (let i = gameString.length - 1; i > 0; i--) {
        if (gameString[i] === '}') {
            while (gameString[i] !== '{') {
                i--;
            }
        }
        else {
            continue;
        }
       

        while (gameString[i] !== '.') {
            i--;
        }


        let moveCount = "";
        while (gameString[i] !== ' ') {
            moveCount += gameString[i];
            i--;
        }

        let withDots = moveCount.split('').reverse().join('');

        // replace all instances of '.' with ''
        moveCount = withDots.replace(/\./g, '');

        return Number(moveCount);
    }

  }
