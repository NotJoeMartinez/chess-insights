

function parseGameNode(gameNode, uname) {

    let parsedGameNode = {};

    // find game color
    if(gameNode.white.username.toUpperCase() == uname.toUpperCase()) {
        parsedGameNode["color"] = "white";
        parsedGameNode["result"] = gameNode.white.result;
        parsedGameNode["opponent"] = gameNode.black.username; 
        parsedGameNode["opponentUrl"] = `https://www.chess.com/member/${gameNode.black.username}`; 
    }
    else {
        parsedGameNode["color"] = "black";
        parsedGameNode["result"] = gameNode.black.result;
        parsedGameNode["opponent"] = gameNode.white.username; 
        parsedGameNode["opponentUrl"] = `https://www.chess.com/member/${gameNode.white  .username}`; 
    }

    let pgn = gameNode.pgn.split('\n');
    parsedGameNode["date"] = pgn[2].replace(/\\|\[|\]|\"|Date/g,'');
    parsedGameNode["openingUrl"] = pgn[10].replace(/\\|\[|\]|\"|ECOUrl/g,'');
    parsedGameNode["opening"] = pgn[10].replace(/\\|\[|\]|\"|ECOUrl|https:\/\/www.chess.com\/openings\//g,'');
    parsedGameNode["gameType"] = gameNode.time_class;   
    parsedGameNode["url"] = gameNode.url;   


    return parsedGameNode;
} 