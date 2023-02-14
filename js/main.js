
async function getAllUserData() {

    clearData();
    toggleSpinner();
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
            archivedGames.push(archiveGameList[j]);
        }
    }

    window.localStorage.setItem("archivedGames", JSON.stringify(archivedGames));
    window.localStorage.setItem("userName", userName);


    eloOverTime();
    writeGameStats();
    // writeOpenings(archivedGames);

    playerStatsUrl = `https://api.chess.com/pub/player/${userName}/stats`;
    var playerStatsRes = await fetch(playerStatsUrl);
    var playerStats = await playerStatsRes.json();
    window.localStorage.setItem("playerStats", JSON.stringify(playerStats));

    writePlayerStats();
    writeAllGamesTable();
    writeExportButton();
    toggleSpinner();
}

