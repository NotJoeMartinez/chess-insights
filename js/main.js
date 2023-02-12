
function getUserName(){
    let userName = document.getElementById("username");
    console.log(userName.value  )
    return userName.value;
}

function toggleSpinner() {
    if (document.contains(document.getElementById("spinner-div"))) {
        document.getElementById("spinner-div").remove();
    }
    else {
        let spinnerDiv = document.createElement("div");
        spinnerDiv.setAttribute("id","spinner-div");
        spinnerDiv.setAttribute("class","container");

        let spinner = document.createElement("div");
        spinner.setAttribute("class","spinner-border")

        spinnerDiv.appendChild(spinner)

        let mainDiv = document.getElementById("main");
        mainDiv.appendChild(spinnerDiv);

    }
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

    title = document.getElementById("title")
    title.textContent = "";

}

async function getAllUserData() {

    clearData();
    toggleSpinner();
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


    writeGameStats(archivedGames, userName);

    playerStatsUrl = `https://api.chess.com/pub/player/${userName}/stats`;
    var playerStatsRes = await fetch(playerStatsUrl);
    var playerStats = await playerStatsRes.json();

    writePlayerStats(playerStats);
    writeAllGamesTable(archivedGames, userName);
    writeExportButton();
    toggleSpinner();
}

