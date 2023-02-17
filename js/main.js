
async function getAllUserData() {

    clearData();
    writeInsightsDiv();

    let userName = getUserName();

    title = document.getElementById("title")
    title.textContent = userName;

    archiveUrl = `https://api.chess.com/pub/player/${userName}/games/archives`;

    var response = await fetch(archiveUrl);
    var archiveMonths = await response.json();
    var archiveUrls = archiveMonths.archives

    archivedGames = []
    for (var i=0; i<archiveUrls.length; i++) {
        var archive = await fetch(archiveUrls[i]);
        var archiveJson = await archive.json();
        var archiveGameList = archiveJson.games;
        for (var j=0; j<archiveGameList.length; j++)  
        {
          if (verifyLiveChess(archiveGameList[j])){
              archivedGames.push(archiveGameList[j]);
          }
        }

        let prog = Math.ceil((i/ archiveUrls.length) * 100);
        progressBar(prog);
    }
    progressBar("remove")

    window.localStorage.setItem("userName", userName);
    try {
        window.localStorage.setItem("archivedGames", JSON.stringify(archivedGames));
      }
      catch(err) {
        // console.log(err);
        let inlineStorage = document.createElement("div");
        let appDiv = document.getElementById("app");
        inlineStorage.setAttribute("id", "inlineStorage");
        inlineStorage.setAttribute("hidden", "hidden");
        inlineStorage.textContent = JSON.stringify(archivedGames);
        appDiv.appendChild(inlineStorage);
      }


    writeExportButton();


    playerStatsUrl = `https://api.chess.com/pub/player/${userName}/stats`;
    var playerStatsRes = await fetch(playerStatsUrl);
    var playerStats = await playerStatsRes.json();
    window.localStorage.setItem("playerStats", JSON.stringify(playerStats));

    eloOverTime();
    writeOpenings();
    writeWon();
    writeLoss();
    // writeGameStats();
    // writePlayerStats();
    // writeAllGamesTable();
    
}

