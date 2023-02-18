function getUserName(){
    let userName = document.getElementById("username");
    return userName.value;
}

function utcToHuman(unixTimestamp) {
    // const date = new Date(unix_timestamp* 1000); 
    // const year = date.getUTCFullYear();
    // const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
    // const day = date.getUTCDate().toString().padStart(2, "0");
    // const hour = date.getUTCHours().toString().padStart(2, "0");
    // const minute = date.getUTCMinutes().toString().padStart(2, "0");

    // return `${year}-${month}-${day} ${hour}:${minute}`;
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
        // node.classList.add(classNames);
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




