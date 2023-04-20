export function clearCharts() {
    const graphs = document.querySelectorAll('.chart');
    graphs.forEach(graph => {
        graph.remove();
    });
}

export function clearLocalStorage() {
    localStorage.clear();
    const inlineStorage = document.querySelector('#inlineStorage');
    const parsedInlineStorage = document.querySelector('#parsedInlineStorage');
    if (inlineStorage) {
        inlineStorage.remove()
    }     
    if (parsedInlineStorage) {
        parsedInlineStorage.remove()
    }
}

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
        if ((gameNode.rules == "chess" || gameNode.rules == "chess960")) {
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


// export function getWinsByOpenings(timeClass, opening) {

//     let parsedArchivedGames = getParsedArchivedGames()
//     let winCount = 0;

//     if (timeClass == "all") {
//         for (let i = 0; i < parsedArchivedGames.length; i++) {
//             let gameNode = parsedArchivedGames[i] 
//             if (gameNode.opening == opening && gameNode.result == "win") {
//                 winCount++;
//             }

//         }
//         return winCount;

//     } else {

//         for (let i = 0; i < parsedArchivedGames.length; i++) {
//             let gameNode = parsedArchivedGames[i]
//             if (gameNode.opening == opening && gameNode.result == "win" && gameNode.timeClass == timeClass) {
//                 winCount++;
//             }
//         }
//         return winCount

//     }
// }


// export function getLossByOpenings(timeClass, opening) {

//     let parsedArchivedGames = getParsedArchivedGames()
//     let lossCount = 0;

//     if (timeClass == "all") {
//         for (let i = 0; i < parsedArchivedGames.length; i++) {
//             let gameNode = parsedArchivedGames[i]
//             if (gameNode.opening == opening && gameNode.result == "loss") {
//                 lossCount++;
//             }

//         }
//         return lossCount;

//     } else {
//         for (let i = 0; i < parsedArchivedGames.length; i++) {
//             let gameNode = parsedArchivedGames[i]
//             if (gameNode.opening == opening && gameNode.result != "win" && gameNode.timeClass == timeClass) {
//                 lossCount++;
//             }
//         }
//         return lossCount

//     }
// }

export function getWinsAndLossesByOpenings(timeClass, opening, parsedArchivedGames) {
    let winCount = 0;
    let lossCount = 0;

    for (let i = 0; i < parsedArchivedGames.length; i++) {
        let gameNode = parsedArchivedGames[i];

        if (gameNode.opening === opening && gameNode.timeClass === timeClass) {
            if (gameNode.result === "win") {
                winCount++;
            } else if (gameNode.result === "resigned" || gameNode.result === "timeout" || gameNode.result === "checkmated" || gameNode.result == "abandoned") {
                lossCount++;
            }
        }
    }

    return { winCount, lossCount };
}


export function parseAndSaveArchivedGames() {
    let parsedArchivedGames = []
    let archivedGames = getArchivedGames()
    for (let i = 0; i < archivedGames.length; i++) {
        let gameNode = parseGameNode(archivedGames[i])
        parsedArchivedGames.push(gameNode)

    }
    console.log(`parsedArchivedGames: ${parsedArchivedGames.length}`)
    try {
        window.localStorage.setItem("parsedArchiveGames", JSON.stringify(parsedArchivedGames));
        console.log("parsedArchiveGames saved to local storage")
      }
      catch(err) {
        let inlineStorage = document.createElement("div");
        let appDiv = document.getElementById("app");
        inlineStorage.setAttribute("id", "parsedInlineStorage");
        inlineStorage.setAttribute("hidden", "hidden");
        inlineStorage.textContent = JSON.stringify(parsedArchivedGames);
        appDiv.appendChild(inlineStorage);
        console.log("parsedArchiveGames saved to inline storage")
      }

}

export function getParsedArchivedGames() {

    if (window.localStorage.getItem("parsedArchiveGames") != null) {
        let parsedArchive = window.localStorage.getItem("parsedArchiveGames");
        return JSON.parse(parsedArchive);
    } else {
        let inlineDiv = document.getElementById("parsedInlineStorage");
        let parsedArchive = inlineDiv.textContent;
        return JSON.parse(parsedArchive);
    }

}

export function saveOpeningsData(){
    // let timeClasses = ["all", "bullet", "blitz", "rapid", "daily"]
    let openingsData = {
        all: calculateOpening("all"),
        bullet: calculateOpening("bullet"),
        blitz: calculateOpening("blitz"),
        rapid: calculateOpening("rapid"),
        daily: calculateOpening("daily")
    }
    try {
        window.localStorage.setItem("openings", JSON.stringify(openingsData));
      }
      catch(err) {
        let inlineStorage = document.createElement("div");
        let appDiv = document.getElementById("app");
        inlineStorage.setAttribute("id", "openingsInlineStorage");
        inlineStorage.setAttribute("hidden", "hidden");
        inlineStorage.textContent = JSON.stringify(openingsData);
        appDiv.appendChild(inlineStorage);
      }
}

export function calculateOpening(timeClass) {

    let parsedArchivedGames = getParsedArchivedGames();
    // let uname = getUserName();
  
    const openingData = {};
    if (timeClass=="all"){
      for (let i = 0; i < parsedArchivedGames.length; i++) {
        let gameNode =  parsedArchivedGames[i];
        const string = gameNode.opening;
        openingData[string] = (openingData[string] || 0) + 1;
      }
    } else {
      for (let i = 0; i < parsedArchivedGames.length; i++) {
        let gameNode = parsedArchivedGames[i];
        if (gameNode.timeClass == timeClass) {
          const string = gameNode.opening;
          openingData[string] = (openingData[string] || 0) + 1;
        }
      }
    }
  
    
  
    let allNumbers = []
  /* eslint-disable no-unused-vars */
    for (const [key, value] of Object.entries(openingData)) {
      allNumbers.push(value)
    }
  
    let titles = []
    let values = []
  
    /* eslint-disable no-unused-vars */
    for (const [key, value] of Object.entries(openingData)) {
      if (isTop90Percentile(value, allNumbers)) {
          titles.push(key);
          values.push(value);
      }
    }
  
  
    let arrayOfObj = titles.map(function(d, i) {
      return {
        label: d,
        data: values[i] || 0
      };
    });
  
    let sortedArrayOfObj = arrayOfObj.sort(function(a, b) {
      return b.data>a.data;
    });
  
    let sortedTitles = [];
    let sortedValues = [];
  
    sortedArrayOfObj.forEach(function(d){
      sortedTitles.push(d.label);
      sortedValues.push(d.data);
    })

    let res = [];
    for (let i = 0; i < sortedTitles.length; i++) {
        let urlPath = sortedTitles[i];
        if (urlPath[0] == " ") {
            urlPath = urlPath.slice(1);
        }

        let openingUrl = "https://www.chess.com/openings/" + urlPath.replace(/ /g, "-");
        let opening = sortedTitles[i];
        let openingCount = sortedValues[i];

        let { winCount, lossCount } = getWinsAndLossesByOpenings(timeClass, opening, parsedArchivedGames);

        res.push({ title: opening, value: openingCount, url: openingUrl, winCount: winCount, lossCount: lossCount });
    }
    return res
}
  
