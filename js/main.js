
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
    
    localStorage.removeItem("userName");
    localStorage.removeItem("archivedGames");

    title = document.getElementById("title")
    title.textContent = "";
    
}


function getArchivedGames() {
    let archive = window.localStorage.getItem("archivedGames");
    return JSON.parse(archive);
}

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

    console.log(`before json str ${typeof(archivedGames)}`)
    window.localStorage.setItem("archivedGames", JSON.stringify(archivedGames));
    window.localStorage.setItem("userName", userName);
    // testLocalStorage();


    writeGameStats(userName);
    eloOverTime(archivedGames, "rapid");
    writeOpenings(archivedGames);

    playerStatsUrl = `https://api.chess.com/pub/player/${userName}/stats`;
    var playerStatsRes = await fetch(playerStatsUrl);
    var playerStats = await playerStatsRes.json();

    writePlayerStats(playerStats);
    writeAllGamesTable(archivedGames, userName);
    writeExportButton();
    toggleSpinner();
}

