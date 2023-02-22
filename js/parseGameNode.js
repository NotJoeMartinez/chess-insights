


function parseGameNode(gameNode) {
    uname = window.localStorage.getItem("userName");

    let parsedGameNode = {};

    // easy ones
    parsedGameNode["unixTimeStamp"] = gameNode.end_time;   
    parsedGameNode["timeClass"] = gameNode.time_class;   
    parsedGameNode["gameUrl"] = gameNode.url;   
    parsedGameNode["fen"] = gameNode.fen;  
    parsedGameNode["timeStamp"] = utcToHuman(gameNode.end_time);
    
    let ogPgn = gameNode.pgn;
    let stripedPgn = ogPgn.replace(/(\r\n|\r|\n)/g,''); 
    parsedGameNode["pgn"] = stripedPgn;  

    parsedGameNode["ogPgn"] = gameNode.pgn;  

    // find game color
    if(gameNode.white.username.toUpperCase() == uname.toUpperCase()) {
        parsedGameNode["userColor"] = "white";
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
        parsedGameNode["userColor"] = "black";
        parsedGameNode["result"] = gameNode.black.result;
        parsedGameNode["opponent"] = gameNode.white.username; 
        parsedGameNode["opponentUrl"] = `https://www.chess.com/member/${gameNode.white.username}`; 

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

    // find out how you won
    parsedGameNode["wonBy"] = "";
    if ((parsedGameNode.userColor == "white") && (parsedGameNode.result == "win")) {
        parsedGameNode["wonBy"] = gameNode.black.result;
    }

    if ((parsedGameNode.userColor == "black") && (parsedGameNode.result == "win")) {
        parsedGameNode["wonBy"] = gameNode.white.result;
    }

    // pgn parsing
    let pgn = gameNode.pgn.split('\n');
    parsedGameNode["date"] = pgn[2].replace(/\\|\[|\]|\"|Date/g,'');

    // find opening url. The fact we have to do this means something is broken
    let openingUrl = "";
    for (let i = 0; i < pgn.length; i++){
        if (pgn[i].startsWith("[ECOUrl")){
            openingUrl = pgn[i];
            break;
        }
    }
    parsedGameNode["openingUrl"] = openingUrl.replace(/\\|\[|\]|\"|ECOUrl/g,''); 
    let tmp_opening = openingUrl.replace(/\\|\[|\]|\"|ECOUrl|https:\/\/www.chess.com\/openings\//g,'');
    parsedGameNode["opening"] = tmp_opening.replace(/-/g," ");

    let mainLine = parsedGameNode["opening"].match(/^(\D*)(?=\d)/);
    if (mainLine){
        parsedGameNode["mainLineOpening"] = mainLine[1];
    }
    else {
        parsedGameNode["mainLineOpening"] = parsedGameNode["opening"]; 
    }

    parsedGameNode["startTime"] = pgn[17].replace(/\s|\[StartTime|\]|\"/g,'');
    parsedGameNode["endTime"] = pgn[19].replace(/\s|\[EndTime|\]|\"/g,'');

    // ugly  
    parsedGameNode["gameId"] = parsedGameNode["gameUrl"].match(/(live|daily)\/(.*)$/)[2];


    // main line openings 
    

    return parsedGameNode;
} 