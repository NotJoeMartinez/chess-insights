

import { clearLocalStorage } from "@/scripts/utils.js";

export async function fetchTestUserData(){
    clearLocalStorage();

    let testData = await fetch('/testData/testUser_data.json')
    return testData.json();
}

export function saveTestToStorage(data) {

    let userName = data["userName"];
    let playerStats = data["playerStats"];
    let parsedArchivedGames = data["archivedGames"];
    let openings = data["openings"];

    window.localStorage.setItem("userName", userName);
    window.localStorage.setItem("playerStats", JSON.stringify(playerStats));

    // game archive
    try {
        window.localStorage.setItem("archivedGames", JSON.stringify(parsedArchivedGames));
        console.log("archivedGames saved to local storage")
    } catch (err) {
        let inlineStorage = document.createElement("div");
        let appDiv = document.getElementById("app");
        inlineStorage.setAttribute("id", "archivedGames");
        inlineStorage.setAttribute("hidden", "hidden");
        inlineStorage.textContent = JSON.stringify(parsedArchivedGames);
        appDiv.appendChild(inlineStorage);
        console.log("archived games saved to inline storage")

    }

    // openings
    try {
        window.localStorage.setItem("openings", JSON.stringify(openings));
    } catch (err) {
        let inlineStorage = document.createElement("div");
        let appDiv = document.getElementById("app");
        inlineStorage.setAttribute("id", "openingsInlineStorage");
        inlineStorage.setAttribute("hidden", "hidden");
        inlineStorage.textContent = JSON.stringify(openingsData);
        appDiv.appendChild(inlineStorage);
    }

}

function otherSetup(){
    let largestTimeClass = getLargestTimeClass();

    this.ovTimeClass = largestTimeClass;

    this.openingsTimeClass = "all";
    this.winTimeClass = "all";
    this.lossTimeClass = "all";
    this.drawTimeClass = "all";
    this.resByOppTimeClass = "all";

    this.updateOverview("all")
    this.writeEloOverTime(largestTimeClass);
}