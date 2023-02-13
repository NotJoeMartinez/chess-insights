function getUserName(){
    let userName = document.getElementById("username");
    return userName.value;
}

function clearData() {
    if (document.contains(document.getElementById("insights"))) {
        document.getElementById("insights").remove();
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