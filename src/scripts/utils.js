export function getArchivedGames() {

    // console.log(window.localStorage.getItem("archivedGames"));
    if (window.localStorage.getItem("archivedGames") != null) {
        let archive = window.localStorage.getItem("archivedGames");
        return JSON.parse(archive);
    } else {
        let inlineDiv = document.getElementById("inlineStorage");
        let archive = inlineDiv.textContent;
        return JSON.parse(archive);
    }

}


export function getPlayerStats() {
    let playerStats = window.localStorage.getItem("playerStats");
    return JSON.parse(playerStats);
}

export function getUserName() {
    let userName = document.getElementById("uname");
    return userName.value;
}

export function utcToHuman(unixTimestamp) {
    const dateObject = new Date(unixTimestamp * 1000);
    const year = dateObject.getFullYear();
    const month = ('0' + (dateObject.getMonth() + 1)).slice(-2);
    const day = ('0' + dateObject.getDate()).slice(-2);
    const hours = ('0' + dateObject.getHours()).slice(-2);
    const minutes = ('0' + dateObject.getMinutes()).slice(-2);
    const seconds = ('0' + dateObject.getSeconds()).slice(-2);

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

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


    // main line openings 

    return parsedGameNode;
}

export function verifyLiveChess(gameNode) {
    try {
        if ((gameNode.rules == "chess")) {
            return true;
        } else {
            return false;
        }

    } catch (error) {
        return false
    }
}


export function getLargestTimeClass() {

    let timeClassCount = {}
    let playerStats = getPlayerStats()

    // eslint-disable-next-line no-prototype-builtins
    if (playerStats.hasOwnProperty("chess_bullet")) {
        let record = playerStats.chess_bullet.record
        let total = (record.win + record.loss + record.draw)
        timeClassCount["bullet"] = total
    }
    // eslint-disable-next-line no-prototype-builtins
    if (playerStats.hasOwnProperty("chess_blitz")) {
        let record = playerStats.chess_blitz.record
        let total = (record.win + record.loss + record.draw)
        timeClassCount["blitz"] = total
    }
    // eslint-disable-next-line no-prototype-builtins
    if (playerStats.hasOwnProperty("chess_rapid")) {
        let record = playerStats.chess_rapid.record
        let total = (record.win + record.loss + record.draw)
        timeClassCount["rapid"] = total
    }
    // eslint-disable-next-line no-prototype-builtins
    if (playerStats.hasOwnProperty("chess_daily")) {
        let record = playerStats.chess_daily.record
        let total = (record.win + record.loss + record.draw)
        timeClassCount["daily"] = total
    }

    let max = 0;
    let maxClass = "rapid";

    for (let timeClass in timeClassCount) {
        const count = timeClassCount[timeClass];
        if (count > max) {
            maxClass = timeClass
            max = count
        }
    }
    return maxClass
}


export function isTop90Percentile(number, numbers) {
    numbers.sort((a, b) => a - b);
    const index = Math.ceil(numbers.length * 0.9) - 1;
    const percentileValue = numbers[index];
    return number >= percentileValue;
}


export function getWinsByOpenings(timeClass, opening) {

    let archivedGames = getArchivedGames()
    let winCount = 0;
    // let lossCount = 0;

    if (timeClass == "all") {
        for (let i = 0; i < archivedGames.length; i++) {
            let gameNode = parseGameNode(archivedGames[i])
            if (gameNode.opening == opening && gameNode.result == "win") {
                winCount++;
            }
            
        }
        return winCount;

    } else {

        for (let i = 0; i < archivedGames.length; i++) {
            let gameNode = parseGameNode(archivedGames[i])
            if (gameNode.opening == opening && gameNode.result == "win" && gameNode.timeClass == timeClass) {
                winCount++;
            }
        }
        return winCount

    }
}


export function getLossByOpenings(timeClass, opening){
    
        let archivedGames = getArchivedGames()
        let lossCount = 0;
    
        if (timeClass == "all") {
            for (let i = 0; i < archivedGames.length; i++) {
                let gameNode = parseGameNode(archivedGames[i])
                if (gameNode.opening == opening && gameNode.result == "loss") {
                    lossCount++;
                }
                
            }
            return lossCount;
    
        } else {
            for (let i = 0; i < archivedGames.length; i++) {
                let gameNode = parseGameNode(archivedGames[i])
                if (gameNode.opening == opening && gameNode.result != "win" && gameNode.timeClass == timeClass) {
                    lossCount++;
                }
            }
            return lossCount
    
        }
}
