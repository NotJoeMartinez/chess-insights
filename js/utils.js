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
        return JSON.parse(archive);
    }

}

function isTop90Percentile(number, numbers) {
    numbers.sort((a, b) => a - b); // Sort the array in ascending order
    const index = Math.ceil(numbers.length * 0.9) - 1; // Find the index of the 90th percentile
    const percentileValue = numbers[index]; // Get the value at the 90th percentile
    return number >= percentileValue; // Compare the number to the 90th percentile value
  }
  
function getPlayerStats() {
    let playerStats = window.localStorage.getItem("playerStats");
    return JSON.parse(playerStats);
}
