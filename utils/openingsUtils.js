import { getArchivedGames } from "~/utils/archiveUtils.js";
import { getResult } from "~/utils/utils.js";



export function calcOpeningsData() {
    let gameArchive = getArchivedGames();
    let myMainLines = ["Kings Pawn Opening", "Queens Pawn Opening", "Caro Kann Defense", "Vienna Game", "French Defense", "Italian Game", "Scandinavian Defense", "Center Game", "Petrovs Defense", "Pirc Defense", "Four Knights Game", "Giuoco Piano Game", "Barnes Opening", "Philidor Defense", "Sicilian Defense", "Ruy Lopez Opening", "Three Knights Opening", "Nimzowitsch Defense", "Scotch Game", "Bishops Opening", "Alekhines Defense", "Slav Defense", "Ponziani Opening", "Vant Kruijs Opening", "Modern Defense", "Queens Gambit Declined", "Closed Sicilian Defense", "Reti Opening", "Kings Fianchetto", "Kings Gambit", "Van Geet Opening", "Englund Gambit", "English Opening", "Englund Gambit Declined", "Alapin Sicilian", "Birds Opening", "Mieses Opening", "Dutch Defense", "Grob Opening", "Indian Game", "Kings Indian", "Kadas Opening", "Queens Gambit Accepted", "Saragossa Opening", "Ware Opening", "Colle System", "Dresden Opening", "London System", "English Defense", "Benko Gambit", "Benoni", "Bogo-Indian", "Catalan", "Danish Gambit", "Grunfeld Defense", "Budapest Gambit", "Kings Indian Defense", "Kings Indian Attack", "Nimzo Indian Defense", "Nimzowitsch Larsen Attack", "Old Indian Defense", "Owens Defense", "Polish Opening", "Queens Indian Defense", "Semi Slav Defense", "Tarrasch Defense", "Trompowsky Attack"]
    let openings = {
        mainLines : [],
    }

    for (let i = 0; i < gameArchive.length; i++) {
        let opening = gameArchive[i].opening;
        for (let j = 0; j < myMainLines.length; j++) {
            if (opening.startsWith(myMainLines[j])) {
                openings["mainLines"].push({
                    timeClass: gameArchive[i].timeClass,
                    result: gameArchive[i].result,
                    mainLine: myMainLines[j],
                    userRating: gameArchive[i].userRating,
                    opponentRating:  gameArchive[i].opponentRating,
                    opening: opening,
                    gameUrl: gameArchive[i].gameUrl,
                    openingUrl: gameArchive[i].openingUrl
                });
            }
        }
    }

    return openings;
}

export function saveOpeningsData(openingsData) {
    try {
        window.localStorage.setItem("openings", JSON.stringify(openingsData));
    } catch (err) {
        let inlineStorage = document.createElement("div");
        let appDiv = document.getElementById("app");
        inlineStorage.setAttribute("id", "openingsInlineStorage");
        inlineStorage.setAttribute("hidden", "hidden");
        inlineStorage.textContent = JSON.stringify(openingsData);
        appDiv.appendChild(inlineStorage);
    }
}


export function getSavedOpeningsData() {

    if (window.localStorage.getItem("openings") !== null) {
        console.log("openings found in local storage")
        let openings = window.localStorage.getItem("openings");
        return JSON.parse(openings);
    } 
    else if (document.getElementById("openingsInlineStorage") !== null) {
        console.log("openings not found in local storage")
        let inlineDiv = document.getElementById("openings");
        let openings = inlineDiv.textContent;
        return JSON.parse(openings);
    }
    else {
        return null;
    }
}


export function getWinsAndLossesByOpenings(timeClass, opening, parsedArchivedGames) {
    let winCount = 0;
    let lossCount = 0;
    let drawCount = 0;

    if (timeClass === "all") {
        for (let i = 0; i < parsedArchivedGames.length; i++) {
            let gameNode = parsedArchivedGames[i];
            if (gameNode.opening === opening) {
                let result = gameNode.result

                if (result === "win") {
                    winCount++;
                } 
                else if (result === "resigned" || result === "timeout" || result === "checkmated" || result === "abandoned") {
                    lossCount++;
                }
                else if (result === "agreed" || result === "stalemate" || result === "repetition" || result === "insufficient" || result === "timevsinsufficient" ) {
                    drawCount++;
                }
            }
        }
        return {
            winCount,
            lossCount,
            drawCount
        };
    }


    for (let i = 0; i < parsedArchivedGames.length; i++) {
        let gameNode = parsedArchivedGames[i];
        if (gameNode.opening === opening && gameNode.timeClass === timeClass) {
            let result = gameNode.result
            if (result === "win") {
                winCount++;
            } else if (result === "resigned" || result === "timeout" || result === "checkmated" || result === "abandoned") {
                lossCount++;
            }
            else if (result === "agreed" || result === "stalemate" || result === "repetition" || result === "insufficient" || result === "timevsinsufficient" ) {
                drawCount++;
            }
        }
    }

    return {
        winCount,
        lossCount,
        drawCount
    };
}

export function getOpeningsData(gameArchive) {
    let mainLines = ["Kings Pawn Opening", "Queens Pawn Opening", "Caro Kann Defense", "Vienna Game", "French Defense", "Italian Game", "Scandinavian Defense", "Center Game", "Petrovs Defense", "Pirc Defense", "Four Knights Game", "Giuoco Piano Game", "Barnes Opening", "Philidor Defense", "Sicilian Defense", "Ruy Lopez Opening", "Three Knights Opening", "Nimzowitsch Defense", "Scotch Game", "Bishops Opening", "Alekhines Defense", "Slav Defense", "Ponziani Opening", "Vant Kruijs Opening", "Modern Defense", "Queens Gambit Declined", "Closed Sicilian Defense", "Reti Opening", "Kings Fianchetto", "Kings Gambit", "Van Geet Opening", "Englund Gambit", "English Opening", "Englund Gambit Declined", "Alapin Sicilian", "Birds Opening", "Mieses Opening", "Dutch Defense", "Grob Opening", "Indian Game", "Kings Indian", "Kadas Opening", "Queens Gambit Accepted", "Saragossa Opening", "Ware Opening", "Colle System", "Dresden Opening", "London System", "English Defense", "Benko Gambit", "Benoni", "Bogo-Indian", "Catalan", "Danish Gambit", "Grunfeld Defense", "Budapest Gambit", "Kings Indian Defense", "Kings Indian Attack", "Nimzo Indian Defense", "Nimzowitsch Larsen Attack", "Old Indian Defense", "Owens Defense", "Polish Opening", "Queens Indian Defense", "Semi Slav Defense", "Tarrasch Defense", "Trompowsky Attack"]
    let allOpenings = []
  
    for (let i = 0; i < gameArchive.length; i++) {
        let opening = gameArchive[i].opening;
        for (let j = 0; j < mainLines.length; j++) {
            if (opening.startsWith(mainLines[j])) {
              let url = "https://www.chess.com/openings/" + mainLines[j].replace(/\s/g, "-").toLowerCase();
                allOpenings.push({
                    timeClass: gameArchive[i].timeClass,
                    color: gameArchive[i].userColor,
                    result: getResult(gameArchive[i].result),
                    name: mainLines[j],
                    openingUrl: url 
                });
            }
        }
      }
  
    let countedOpenings = getCounts(allOpenings);
    return countedOpenings;
  }
  
export function getCounts(rawOpenings) {
let nodeWithCounts = {};
// Count occurrences of each opening name
for (let i = 0; i < rawOpenings.length; i++) {
    let name = rawOpenings[i].name;
    let url = rawOpenings[i].openingUrl;
    if (nodeWithCounts[name]) {
    nodeWithCounts[name].count++;
    } else {
    nodeWithCounts[name] = {
    count: 1,
    win: 0,
    loss: 0,
    draw: 0,
    url: url
    };
    }
}

// get win, loss, and draw counts for each opening
for (let i = 0; i < rawOpenings.length; i++) {
    let currentNode = rawOpenings[i];
    let name = currentNode.name;
    nodeWithCounts[name][currentNode.result]++;
}

// add counts to array 
let countedOpenings = [];
for (let name in nodeWithCounts) {
    let countedNode = nodeWithCounts[name];
    let processedNode = {
    name: name,
    url: countedNode.url,
    count: countedNode.count,
    win: countedNode.win,
    loss: countedNode.loss,
    draw: countedNode.draw
    };

    countedOpenings.push(processedNode);
}
return countedOpenings;
}

export function filterOpeningsData(gameArchive, filters) {
    // skip this part if filters is none
    const timeClass = filters.timeClass;
    const color = filters.color;

    let filteredGameArchive = [];

    for (let i = 0; i < gameArchive.length; i++) {
        if (timeClass === "all" && color === "all") {
            return gameArchive;
        }
        else if (timeClass !== "all" && color === "all") {
            if (gameArchive[i].timeClass === timeClass) {
                filteredGameArchive.push(gameArchive[i])
            }
        }
        else if (timeClass === "all" && color !== "all") {
            if (gameArchive[i].userColor === color) {
                filteredGameArchive.push(gameArchive[i])
            }
        }
        else {
            if (gameArchive[i].timeClass === timeClass && gameArchive[i].userColor === color) {
                filteredGameArchive.push(gameArchive[i])
            }
        }
    }
    return filteredGameArchive;
}

export function processOpeningsData(openingsData, n=100) {
    // Sort the data by count in descending order
    openingsData.sort((a, b) => b.count - a.count);

    // Determine the cutoff index based on the percentile
    const cutoffIndex = Math.ceil((n / 100) * openingsData.length);

    // Slice the array to get the top n%
    const topOpeningsData = openingsData.slice(0, cutoffIndex);

    // Create separate arrays for each property
    const labels = topOpeningsData.map(data => data.name);
    const counts = topOpeningsData.map(data => data.count);
    const wins = topOpeningsData.map(data => data.win);
    const losses = topOpeningsData.map(data => data.loss);
    const draws = topOpeningsData.map(data => data.draw);
    const urls = topOpeningsData.map(data => data.url);


    return {
        labels,
        counts,
        wins,
        losses,
        draws,
        urls
    };
}

export function getMainLine(opening) {
    let mainLines = ["Kings Pawn Opening", "Queens Pawn Opening", "Caro Kann Defense", "Vienna Game", "French Defense", "Italian Game", "Scandinavian Defense", "Center Game", "Petrovs Defense", "Pirc Defense", "Four Knights Game", "Giuoco Piano Game", "Barnes Opening", "Philidor Defense", "Sicilian Defense", "Ruy Lopez Opening", "Three Knights Opening", "Nimzowitsch Defense", "Scotch Game", "Bishops Opening", "Alekhines Defense", "Slav Defense", "Ponziani Opening", "Vant Kruijs Opening", "Modern Defense", "Queens Gambit Declined", "Closed Sicilian Defense", "Reti Opening", "Kings Fianchetto", "Kings Gambit", "Van Geet Opening", "Englund Gambit", "English Opening", "Englund Gambit Declined", "Alapin Sicilian", "Birds Opening", "Mieses Opening", "Dutch Defense", "Grob Opening", "Indian Game", "Kings Indian", "Kadas Opening", "Queens Gambit Accepted", "Saragossa Opening", "Ware Opening", "Colle System", "Dresden Opening", "London System", "English Defense", "Benko Gambit", "Benoni", "Bogo-Indian", "Catalan", "Danish Gambit", "Grunfeld Defense", "Budapest Gambit", "Kings Indian Defense", "Kings Indian Attack", "Nimzo Indian Defense", "Nimzowitsch Larsen Attack", "Old Indian Defense", "Owens Defense", "Polish Opening", "Queens Indian Defense", "Semi Slav Defense", "Tarrasch Defense", "Trompowsky Attack"]
    let mainLine = ""

    for (let i = 0; i < mainLines.length; i++) {
        if (opening.startsWith(mainLines[i])) {
            mainLine = mainLines[i]
            return mainLine
        }
    }
    return "Other"

}

export function getOpeningsForExplore(gameArchive) {
    let filters = {
        "timeClass": "all",
        "color": "all"
    }
    let filteredArchive = filterOpeningsData(gameArchive, filters) 
    let unsortedOpenings = getOpeningsData(filteredArchive)

    let openingsData = "" 
    openingsData = processOpeningsData(unsortedOpenings, 50)

    return openingsData.labels;
}