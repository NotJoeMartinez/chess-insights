import { utcToHuman } from "@/scripts/utils.js";

export function parseAndSaveArchivedGames(archivedGames) {
    let parsedArchivedGames = []
    // let archivedGames = getArchivedGames()
    for (let i = 0; i < archivedGames.length; i++) {
        let gameNode = parseGameNode(archivedGames[i])
        parsedArchivedGames.push(gameNode)

    }
    console.log(`archivedGames: ${parsedArchivedGames.length}`)
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
        if ((gameNode.rules == "chess" || gameNode.rules == "chess960")) {
            return true;
        } else {
            return false;
        }

    } catch (error) {
        return false
    }
}

export function parseGameNode(gameNode) {
    let uname = window.localStorage.getItem("userName");

    let parsedGameNode = {};

    // easy ones
    parsedGameNode["unixTimeStamp"] = gameNode.end_time;
    parsedGameNode["timeClass"] = gameNode.time_class;
    parsedGameNode["gameUrl"] = gameNode.url;
    parsedGameNode["fen"] = gameNode.fen;
    parsedGameNode["timeStamp"] = utcToHuman(gameNode.end_time);

    let ogPgn = gameNode.pgn;
    let stripedPgn = ogPgn.replace(/(\r\n|\r|\n)/g, '');
    parsedGameNode["pgn"] = stripedPgn;

    parsedGameNode["ogPgn"] = gameNode.pgn;

    // find game color
    if (gameNode.white.username.toUpperCase() == uname.toUpperCase()) {
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

    // find out how you won
    parsedGameNode["wonBy"] = "";
    if ((parsedGameNode.userColor == "white") && (parsedGameNode.result == "win")) {
        parsedGameNode["wonBy"] = gameNode.black.result;
    }

    if ((parsedGameNode.userColor == "black") && (parsedGameNode.result == "win")) {
        parsedGameNode["wonBy"] = gameNode.white.result;
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

    // eslint-disable-next-line no-useless-escape
    parsedGameNode["startTime"] = pgn[17].replace(/\s|\[StartTime|\]|\"/g, '');
    // eslint-disable-next-line no-useless-escape
    parsedGameNode["endTime"] = pgn[19].replace(/\s|\[EndTime|\]|\"/g, '');

    // ugly  
    parsedGameNode["gameId"] = parsedGameNode["gameUrl"].match(/(live|daily)\/(.*)$/)[2];

    delete parsedGameNode.ogPgn
    // main line openings 
    return parsedGameNode;
}


// export function getParsedArchivedGames() {

//     if (window.localStorage.getItem("parsedArchiveGames") != null) {
//         let parsedArchive = window.localStorage.getItem("parsedArchiveGames");
//         return JSON.parse(parsedArchive);
//     } else {
//         let inlineDiv = document.getElementById("parsedInlineStorage");
//         let parsedArchive = inlineDiv.textContent;
//         return JSON.parse(parsedArchive);
//     }

// }


export function getArchivedGames() {

    // console.log(window.localStorage.getItem("archivedGames"));
    if (window.localStorage.getItem("archivedGames") != null) {
        let archive = window.localStorage.getItem("archivedGames");
        return JSON.parse(archive);
    } else {
        let inlineDiv = document.getElementById("archivedGames");
        let archive = inlineDiv.textContent;
        return JSON.parse(archive);
    }

}