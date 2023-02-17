
async function getAllUserData() {

    clearData();
    writeInsightsDiv();

    let userName = getUserName();

    playerStatsUrl = `https://api.chess.com/pub/player/${userName}/stats`;
    var playerStatsRes = await fetch(playerStatsUrl);
    var playerStats = await playerStatsRes.json();

    if (playerStatsRes.status != 404) {
      window.localStorage.setItem("playerStats", JSON.stringify(playerStats));
    } 
    else {
      alert("User Not found");
      return;
    }
    



    archiveUrl = `https://api.chess.com/pub/player/${userName}/games/archives`;

    var response = await fetch(archiveUrl);
    var archiveMonths = await response.json();
    var archiveUrls = archiveMonths.archives
    let totalGames = 0;

    archivedGames = []
    for (var i=0; i<archiveUrls.length; i++) {
        var archive = await fetch(archiveUrls[i]);
        var archiveJson = await archive.json();
        var archiveGameList = archiveJson.games;
        for (var j=0; j<archiveGameList.length; j++)  
        {
          if (verifyLiveChess(archiveGameList[j])){
              archivedGames.push(archiveGameList[j]);
              totalGames++;
          }
        }

        let prog = Math.ceil((i/ archiveUrls.length) * 100);
        progressBar(prog,totalGames);
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
    toggleSpinner();



    eloOverTime();
    writeOpenings();
    writeWon();
    writeLoss();

    toggleSpinner();
    // writeGameStats();
    // writePlayerStats();
    // writeAllGamesTable();
    
}

