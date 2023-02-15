function getUserName(){
    let userName = document.getElementById("username");
    return userName.value;
}

function utcToHuman(unix_timestamp) {
    let date = new Date(unix_timestamp * 1000);
    let formattedDate = date.toISOString().substring(0, 10);
    return formattedDate;
  }

function clearData() {
    if (document.contains(document.getElementById("insights"))) {
        document.getElementById("insights").remove();
    }

    if (document.contains(document.getElementById("inlineStorage"))) {
        document.getElementById("inlineStorage").remove();
    }


    localStorage.removeItem("userName");
    localStorage.removeItem("archivedGames");

    title = document.getElementById("title")
    title.textContent = "";
    
}

function getArchivedGames() {
    
    // console.log(window.localStorage.getItem("archivedGames"));
    if (window.localStorage.getItem("archivedGames") != null){
        let archive = window.localStorage.getItem("archivedGames");
        return JSON.parse(archive);
    }
    else {
        let inlineDiv = document.getElementById("inlineStorage");
        let archive = inlineDiv.textContent;
        console.log(archive);
        console.log(typeof(JSON.parse(archive)));
        return JSON.parse(archive);
    }

}

function getPlayerStats() {
    let playerStats = window.localStorage.getItem("playerStats");
    return JSON.parse(playerStats);
}