

import { parseAndSaveArchivedGames, verifyLiveChess } from "~/utils/archiveUtils.js";
import { getResult } from "~/utils/utils.js";
import { getMainLine } from "~/utils/openingsUtils.js"

export function exploreAll(games) {

    
    let gridData = [];

    for (let i = 0; i < games.length; i++) {

        // round to 2 decimal places
        let userAccuracy; 

        if (games[i].userAccuracy === null || 
            games[i].userAccuracy === undefined ||
            games[i].userAccuracy === "") {

            userAccuracy = "";
        }
        else {
            userAccuracy = Math.round(games[i].userAccuracy * 100) / 100; 
        }


        let row = {
          date : games[i].date,
          timeClass: games[i].timeClass,
          rating: games[i].userRating,
          accuracy: userAccuracy,
          result: getResult(games[i].result),
          moves: games[i].moveCount,
          color: games[i].userColor,
          outcome: games[i].outcome,
          opponent : games[i].opponent,
          opening: getMainLine(games[i].opening),
          gameUrl: games[i].gameUrl,
        }
        gridData.push(row)
    }

    return gridData;
}

export async function exploreFromAPI(  userName ) {
    
    let playerStatsUrl = `https://api.chess.com/pub/player/${userName}/stats`;
    let playerStatsRes = await fetch(playerStatsUrl);
    let playerStats = await playerStatsRes.json();

    console.log(playerStatsRes.status);

    // I'm not sure about type coercion here
    if (playerStatsRes.status != 404) {
      window.localStorage.setItem("playerStats", JSON.stringify(playerStats));
    } else {
      alert("Something broke");
      return;
    }

    let archiveUrl = `https://api.chess.com/pub/player/${userName}/games/archives`;
    let response = await fetch(archiveUrl);
    let archiveMonths = await response.json();
    let archiveUrls = archiveMonths.archives
    let totalGames = 0;

    let archivedGames = []
    for (let i = 0; i < archiveUrls.length; i++) {
      let archive = await fetch(archiveUrls[i]);
      let archiveJson = await archive.json();
      let archiveGameList = archiveJson.games;
      for (let j = 0; j < archiveGameList.length; j++) {
        if (verifyLiveChess(archiveGameList[j])) {
          archivedGames.push(archiveGameList[j]);
          totalGames = totalGames + 1;
        }
      }
    }
    if (archivedGames.length < 1) {
      alert("No games found under that user")
      return;
    }
    let inlineStorage = document.createElement("div");
    let appDiv = document.getElementById("app");
    inlineStorage.setAttribute("id", "inlineStorage");
    inlineStorage.setAttribute("hidden", "hidden");
    inlineStorage.textContent = JSON.stringify(archivedGames);
    appDiv.appendChild(inlineStorage);
    parseAndSaveArchivedGames(archivedGames);

}