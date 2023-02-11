

function parseGameNode(gameNode, uname) {

    let parsedGameNode = {};

    // find game color
    if(gameNode.white.username.toUpperCase() == uname.toUpperCase()) {
        parsedGameNode["color"] = "white";
        parsedGameNode["result"] = gameNode.white.result;
        parsedGameNode["opponent"] = gameNode.black.username; 
        parsedGameNode["opponentUrl"] = `https://www.chess.com/member/${gameNode.black.username}`; 

        parsedGameNode["opponentRating"] = gameNode.black.rating;
        parsedGameNode["userRating"] = gameNode.white.rating;

        if (gameNode.hasOwnProperty("accuracies")) {
            parsedGameNode["userAccuracy"] = gameNode.accuracies.white;
            parsedGameNode["opponentAccuracy"] = gameNode.accuracies.black;
        }
        else {
            parsedGameNode["userAccuracy"] = "" ;
            parsedGameNode["opponentAccuracy"] = ""; 
        }

    }
    else {
        parsedGameNode["color"] = "black";
        parsedGameNode["result"] = gameNode.black.result;
        parsedGameNode["opponent"] = gameNode.white.username; 
        parsedGameNode["opponentUrl"] = `https://www.chess.com/member/${gameNode.white  .username}`; 

        parsedGameNode["opponentRating"] = gameNode.white.rating;
        parsedGameNode["userRating"] = gameNode.black.rating;

        if (gameNode.hasOwnProperty("accuracies")) {
            parsedGameNode["userAccuracy"] = gameNode.accuracies.black;
            parsedGameNode["opponentAccuracy"] = gameNode.accuracies.white;
        }
        else {
            parsedGameNode["userAccuracy"] = "" ;
            parsedGameNode["opponentAccuracy"] = ""; 
        }

    }

    let pgn = gameNode.pgn.split('\n');
    parsedGameNode["date"] = pgn[2].replace(/\\|\[|\]|\"|Date/g,'');
    parsedGameNode["openingUrl"] = pgn[10].replace(/\\|\[|\]|\"|ECOUrl/g,'');
    parsedGameNode["opening"] = pgn[10].replace(/\\|\[|\]|\"|ECOUrl|https:\/\/www.chess.com\/openings\//g,'');
    parsedGameNode["gameType"] = gameNode.time_class;   
    parsedGameNode["url"] = gameNode.url;   


    return parsedGameNode;
} 