
export function clearLocalStorage() {
    window.localStorage.clear();
    let inlineStorage = document.getElementById('archivedGames');
    if (inlineStorage) {
        inlineStorage.remove()
        console.log("inline storage cleared")
    }
    let inlinePgnStorage = document.getElementById('pgnGames');
    if (inlinePgnStorage) {
        inlinePgnStorage.remove()
        console.log("inline pgn storage cleared")
    }
    let inlineOpeningsStorage = document.getElementById('openings');
    if (inlineOpeningsStorage) {
        inlineOpeningsStorage.remove()
        console.log("inline openings storage cleared")
    }
    console.log("local storage cleared")

}

export function getPlayerStats() {
    let playerStats = window.localStorage.getItem("playerStats");
    return JSON.parse(playerStats);
}

export function getUserName() {
    let userName = window.localStorage.getItem("userName");
    return userName;
}

export function utcToHuman(unixTimestamp) {
    const dateObject = new Date(unixTimestamp * 1000);
    const year = dateObject.getFullYear();
    const month = ('0' + (dateObject.getMonth() + 1)).slice(-2);
    const day = ('0' + dateObject.getDate()).slice(-2);
    const hours = ('0' + dateObject.getHours()).slice(-2);
    const minutes = ('0' + dateObject.getMinutes()).slice(-2);
    const seconds = ('0' + dateObject.getSeconds()).slice(-2);
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export function getFormattedTimestamp() {
    const now = new Date();
    const fullYear = now.getFullYear();
    const twoDigitYear = String(fullYear).slice(-2);
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');
    return `${twoDigitYear}${month}${day}${hour}${minute}`;
}

export function getLargestTimeClass() {

    let timeClassCount = {}
    let playerStats = getPlayerStats()

    // eslint-disable-next-line no-prototype-builtins
    if (playerStats.hasOwnProperty("chess_bullet")) {
        let record = playerStats.chess_bullet.record
        let total = (record.win + record.loss + record.draw)
        timeClassCount["bullet"] = total
    }
    // eslint-disable-next-line no-prototype-builtins
    if (playerStats.hasOwnProperty("chess_blitz")) {
        let record = playerStats.chess_blitz.record
        let total = (record.win + record.loss + record.draw)
        timeClassCount["blitz"] = total
    }
    // eslint-disable-next-line no-prototype-builtins
    if (playerStats.hasOwnProperty("chess_rapid")) {
        let record = playerStats.chess_rapid.record
        let total = (record.win + record.loss + record.draw)
        timeClassCount["rapid"] = total
    }
    // eslint-disable-next-line no-prototype-builtins
    if (playerStats.hasOwnProperty("chess_daily")) {
        let record = playerStats.chess_daily.record
        let total = (record.win + record.loss + record.draw)
        timeClassCount["daily"] = total
    }

    let max = 0;
    let maxClass = "rapid";

    for (let timeClass in timeClassCount) {
        const count = timeClassCount[timeClass];
        if (count > max) {
            maxClass = timeClass
            max = count
        }
    }
    return maxClass
}


export async function fetchUserStats(userName) {
    let playerStatsUrl = `https://api.chess.com/pub/player/${userName}/stats`;
    
    try {
      let playerStatsRes = await fetch(playerStatsUrl);
  
      // Add a check to see if the fetch request was successful
      if (!playerStatsRes.ok) {
        throw new Error(`HTTP error! status: ${playerStatsRes.status}`);
      }
  
      return playerStatsRes;
    } catch (error) {
      console.error(`There was a problem with the fetch operation: ${error.message}`);
      // Return an error code or a relevant error object
      return { error: true, message: error.message };
    }
  }


// gets all games ever played by user
export async function fetchArchiveUrls(userName) {
    let archiveUrl = `https://api.chess.com/pub/player/${userName}/games/archives`;
    let response = await fetch(archiveUrl);
    return response; 
}

export function logAPIRequest(userName) {
    const apiUri = "https://chessinsights.xyz" 
    fetch(`${apiUri}/api/logRequest`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({uname: userName}),
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}


export function getResult(result) {
    if (result === "win") {
      return "win";
    } 
    else if (result === "resigned" || result === "timeout" || result === "checkmated" || result === "abandoned") {
      return "loss";
    }
    else {
      return "draw";
    }
  }
