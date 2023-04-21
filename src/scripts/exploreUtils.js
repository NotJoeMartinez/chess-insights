
import { getParsedArchivedGames } from "@/scripts/utils.js";

import { parseAndSaveArchivedGames, verifyLiveChess } from "@/scripts/utils.js";

export function exploreAll() {

    let games = getParsedArchivedGames();
    let gridData = [];

    for (let i = 0; i < games.length; i++) {
        let row = {
        timeClass: games[i].timeClass,
        opponent : games[i].opponent,
        result: games[i].result,
        date : games[i].date,
        rating: games[i].userRating,
        }
        gridData.push(row)
    }

    return gridData;
}

export async function exploreFromAPI(  userName ) {


    let playerStatsUrl = `https://api.chess.com/pub/player/${userName}/stats`;
    var playerStatsRes = await fetch(playerStatsUrl);
    var playerStats = await playerStatsRes.json();

    if (playerStatsRes.status != 404) {
      window.localStorage.setItem("playerStats", JSON.stringify(playerStats));
    } else {
      alert("Something broke");
      return;
    }

    let archiveUrl = `https://api.chess.com/pub/player/${userName}/games/archives`;
    var response = await fetch(archiveUrl);
    var archiveMonths = await response.json();
    var archiveUrls = archiveMonths.archives
    let totalGames = 0;

    let archivedGames = []
    for (var i = 0; i < archiveUrls.length; i++) {
      var archive = await fetch(archiveUrls[i]);
      var archiveJson = await archive.json();
      var archiveGameList = archiveJson.games;
      for (var j = 0; j < archiveGameList.length; j++) {
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
    parseAndSaveArchivedGames();

}