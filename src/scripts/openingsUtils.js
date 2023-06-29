import { getArchivedGames } from "@/scripts/archiveUtils.js";



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


export function getOpeningsData(timeClass) {
    if (window.localStorage.getItem("openings") != null) {
      let localOpenings = window.localStorage.getItem("openings");
      let openings = JSON.parse(localOpenings);
      return openings;
    } else {
      let inlineDiv = document.getElementById("openingsInlineStorage");
      let inlineOpenings = JSON.parse(inlineDiv.textContent);
      return inlineOpenings;
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
                else if (result === "agreed" || result == "stalemate" || result === "repetition" || result === "insufficient" || result === "timevsinsufficient" ) {
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
            } else if (result === "resigned" || result === "timeout" || result === "checkmated" || result == "abandoned") {
                lossCount++;
            }
            else if (result === "agreed" || result == "stalemate" || result === "repetition" || result === "insufficient" || result === "timevsinsufficient" ) {
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


