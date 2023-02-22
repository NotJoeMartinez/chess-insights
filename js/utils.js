function getUserName(){
    let userName = document.getElementById("inputUsername");
    return userName.value;
}

function utcToHuman(unixTimestamp) {
    const dateObject = new Date(unixTimestamp * 1000);
    const year = dateObject.getFullYear();
    const month = ('0' + (dateObject.getMonth() + 1)).slice(-2);
    const day = ('0' + dateObject.getDate()).slice(-2);
    const hours = ('0' + dateObject.getHours()).slice(-2);
    const minutes = ('0' + dateObject.getMinutes()).slice(-2);
    const seconds = ('0' + dateObject.getSeconds()).slice(-2);

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

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
        return JSON.parse(archive);
    }

}

function isTop90Percentile(number, numbers) {
    numbers.sort((a, b) => a - b); 
    const index = Math.ceil(numbers.length * 0.9) - 1; 
    const percentileValue = numbers[index]; 
    return number >= percentileValue; 
  }
  

function getPlayerStats() {
    let playerStats = window.localStorage.getItem("playerStats");
    return JSON.parse(playerStats);
}

function makeDiv(classNames=[], id="", customAtters=[]){

    const node = document.createElement("div");

  
    if (classNames.length != 0) {
        classNames.forEach(className => node.classList.add(className));
    }

    if (id != ""){
        node.setAttribute("id", id);
    }

    if (customAtters.length != 0) {

        for (let i=0; i<customAtters.length; i++) {

            for (let key in customAtters[i]) {
                const val = customAtters[i][key];
                node.setAttribute(key,val);
            }
        }

    }

    return node;

}

function insertAfter(newNode, existingNode) {
    existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
}


// verify that this game is actually chess
function verifyLiveChess(gameNode){
    try {
        let ogPgn = gameNode.pgn;
        let pgnList = gameNode.pgn.split('\n')
        if ((gameNode.rules == "chess")){
            return true;
        }
        else {
            return false;
        }
        
    }
    catch (error){
        return false
    }

}

function getLargestTimeClass(){

    let timeClassCount = {}
    let playerStats = getPlayerStats()

    if (playerStats.hasOwnProperty("chess_bullet")) {
        let record = playerStats.chess_bullet.record
        let total = (record.win + record.loss + record.draw)
        timeClassCount["bullet"] = total
    }
    if (playerStats.hasOwnProperty("chess_blitz")) {
        let record = playerStats.chess_blitz.record
        let total = (record.win + record.loss + record.draw)
        timeClassCount["blitz"] = total 
    }
    if (playerStats.hasOwnProperty("chess_rapid")) {
        let record = playerStats.chess_rapid.record
        let total = (record.win + record.loss + record.draw)
        timeClassCount["rapid"] = total 
    }
    if (playerStats.hasOwnProperty("chess_daily")) {
        let record = playerStats.chess_daily.record
        let total = (record.win + record.loss + record.draw)
        timeClassCount["daily"] = total 
    }

    let max = 0;
    let maxClass="rapid";

    for (let timeClass in timeClassCount) {
        const count = timeClassCount[timeClass];
        if (count > max) {
            maxClass = timeClass
            max = count
        }
    }
    return maxClass
}