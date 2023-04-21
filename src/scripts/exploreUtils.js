
import { getParsedArchivedGames } from "@/scripts/utils.js";


export function exploreAll() {

    let games = getParsedArchivedGames();
    let gridData = [];

    for (let i = 0; i < games.length; i++) {
        let row = {
        timeClass: games[i].timeClass,
        opponent : games[i].opponent,
        userRating : games[i].result,
        date : games[i].date,
        }
        gridData.push(row)
    }

    return gridData;
}