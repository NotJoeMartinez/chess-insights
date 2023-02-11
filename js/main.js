
function getUserName(){
    let userName = document.getElementById("username");
    return userName.value;
}

function clearData() {
    if (document.contains(document.getElementById("gameTable"))) {
        document.getElementById("gameTable").remove();
    }   

    if (document.contains(document.getElementById("statTable"))) {
        document.getElementById("statTable").remove();
    }  

    if (document.contains(document.getElementById("playerStats"))) {
        document.getElementById("playerStats").remove();
    }  

}

async function getAllUserData() {

    clearData();
    let userName = getUserName();

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


    writeGameStats(archivedGames, userName);

    playerStatsUrl = `https://api.chess.com/pub/player/${userName}/stats`;
    var playerStatsRes = await fetch(playerStatsUrl);
    var playerStats = await playerStatsRes.json();
    console.log(playerStats);
    writePlayerStats(playerStats);

    writeArchiveGameUrls(archivedGames, userName);
}

