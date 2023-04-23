
import { getArchivedGames, getParsedArchivedGames } from "@/scripts/archiveUtils.js";

export function clearCharts() {
    const graphs = document.querySelectorAll('.chart');
    graphs.forEach(graph => {
        graph.remove();
    });
}

export function clearLocalStorage() {
    localStorage.clear();
    console.log("local storage cleared")
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

}


export function getPlayerStats() {
    let playerStats = window.localStorage.getItem("playerStats");
    return JSON.parse(playerStats);
}

export function getUserName() {
    let userName = document.getElementById("uname");

    return userName.value;
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


export function isTop90Percentile(number, numbers) {
    numbers.sort((a, b) => a - b);
    const index = Math.ceil(numbers.length * 0.9) - 1;
    const percentileValue = numbers[index];
    return number >= percentileValue;
}


export function getWinsAndLossesByOpenings(timeClass, opening, parsedArchivedGames) {
    let winCount = 0;
    let lossCount = 0;

    if (timeClass === "all") {
        for (let i = 0; i < parsedArchivedGames.length; i++) {
            let gameNode = parsedArchivedGames[i];
            if (gameNode.opening === opening) {
                if (gameNode.result === "win") {
                    winCount++;
                } else if (gameNode.result === "resigned" || gameNode.result === "timeout" || gameNode.result === "checkmated" || gameNode.result == "abandoned") {
                    lossCount++;
                }
            }
        }
        return {
            winCount,
            lossCount
        };
    }


    for (let i = 0; i < parsedArchivedGames.length; i++) {
        let gameNode = parsedArchivedGames[i];
        if (gameNode.opening === opening && gameNode.timeClass === timeClass) {
            if (gameNode.result === "win") {
                winCount++;
            } else if (gameNode.result === "resigned" || gameNode.result === "timeout" || gameNode.result === "checkmated" || gameNode.result == "abandoned") {
                lossCount++;
            }
        }
    }

    return {
        winCount,
        lossCount
    };
}




export function saveOpeningsData() {
    // let timeClasses = ["all", "bullet", "blitz", "rapid", "daily"]
    let openingsData = {
        all: calculateOpening("all"),
        bullet: calculateOpening("bullet"),
        blitz: calculateOpening("blitz"),
        rapid: calculateOpening("rapid"),
        daily: calculateOpening("daily")
    }
    try {
        window.localStorage.setItem("openings", JSON.stringify(openingsData));
    } catch (err) {
        let inlineStorage = document.createElement("div");
        let appDiv = document.getElementById("app");
        inlineStorage.setAttribute("id", "openingsInlineStorage");
        inlineStorage.setAttribute("hidden", "hidden");
        inlineStorage.textContent = JSON.stringify(openingsData);
        appDiv.appendChild(inlineStorage);
    }
}

export function calculateOpening(timeClass) {

    let parsedArchivedGames = getArchivedGames();
    // let uname = getUserName();

    const openingData = {};
    if (timeClass == "all") {
        for (let i = 0; i < parsedArchivedGames.length; i++) {
            let gameNode = parsedArchivedGames[i];
            const string = gameNode.opening;
            openingData[string] = (openingData[string] || 0) + 1;
        }
    } else {
        for (let i = 0; i < parsedArchivedGames.length; i++) {
            let gameNode = parsedArchivedGames[i];
            if (gameNode.timeClass == timeClass) {
                const string = gameNode.opening;
                openingData[string] = (openingData[string] || 0) + 1;
            }
        }
    }



    let allNumbers = []
    /* eslint-disable no-unused-vars */
    for (const [key, value] of Object.entries(openingData)) {
        allNumbers.push(value)
    }

    let titles = []
    let values = []

    /* eslint-disable no-unused-vars */
    for (const [key, value] of Object.entries(openingData)) {
        if (isTop90Percentile(value, allNumbers)) {
            titles.push(key);
            values.push(value);
        }
    }


    let arrayOfObj = titles.map(function (d, i) {
        return {
            label: d,
            data: values[i] || 0
        };
    });

    let sortedArrayOfObj = arrayOfObj.sort(function (a, b) {
        return b.data > a.data;
    });

    let sortedTitles = [];
    let sortedValues = [];

    sortedArrayOfObj.forEach(function (d) {
        sortedTitles.push(d.label);
        sortedValues.push(d.data);
    })

    let res = [];
    for (let i = 0; i < sortedTitles.length; i++) {
        let urlPath = sortedTitles[i];
        if (urlPath[0] == " ") {
            urlPath = urlPath.slice(1);
        }

        let openingUrl = "https://www.chess.com/openings/" + urlPath.replace(/ /g, "-");
        let opening = sortedTitles[i];
        let openingCount = sortedValues[i];

        let {
            winCount,
            lossCount
        } = getWinsAndLossesByOpenings(timeClass, opening, parsedArchivedGames);

        res.push({
            title: opening,
            value: openingCount,
            url: openingUrl,
            winCount: winCount,
            lossCount: lossCount
        });
    }
    return res
}

// gets overview of player stats
export async function fetchUserStats(userName){
    let playerStatsUrl = `https://api.chess.com/pub/player/${userName}/stats`;
    let playerStatsRes = await fetch(playerStatsUrl);
    return playerStatsRes;


}

// gets all games ever played by user
export async function fetchArchiveUrls(userName) {
    let archiveUrl = `https://api.chess.com/pub/player/${userName}/games/archives`;
    let response = await fetch(archiveUrl);

    return response; 
}