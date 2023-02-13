import requests, json, re, datetime, sys 
import sqlite3

def main():
    arg_one = sys.argv[1]

    if arg_one == "--user":
        if len(sys.argv) < 3:
            print("usage: python3 chess_api_cli.py --user [username]")
            exit()
        else:
            user = sys.argv[2] 
            get_games(user)
    elif arg_one == "--make-db":
        if len(sys.argv) < 3:
            print("usage: python3 chess_api_cli.py --make-db [path/to/json_file.json]")
            exit()
        else:
            json_path = sys.argv[2]
            username = sys.argv[3]
            get_stats(json_path, username)
    else:
        print(f"Argument [{arg_one}] not recognized")


def get_games(user):
    r = requests.get(f"https://api.chess.com/pub/player/{user}/games/archives")
    month_urls = r.json()


    games_dict = {}

    for url in month_urls["archives"]:
        res = requests.get(url).json()
        match = re.search(r"games\/(\d{4})\/(\d{2})$",url)
        year = match.group(1)
        month = match.group(2)
        games_dict[year] = []

    for url in month_urls["archives"]:
        match = re.search(r"games\/(\d{4})\/(\d{2})$",url)
        year = match.group(1)
        month = match.group(2)
        res = requests.get(url).json()
        games_dict[year].append({month:res})



    now = datetime.datetime.now()
    today = now.strftime("%Y-%m-%d")
    fname = f"{user}_chess_com_{today}.json"
    with open(fname, "w") as f:
        json.dump(games_dict,f)

    print(f"Saved data from {user} to {fname}")
    
def parse_pgn(pgn):
    parsed_pgn = {}

    pgn = pgn.split("\n")

    date = re.sub(r"\s|Date|\[|\]|\"|","",pgn[2])
    opening_url = re.sub(r"\s|\[ECOUrl|\]|\"|","",pgn[10])
    start_time = re.sub(r"\s|\[StartTime|\]|\"","",pgn[17])
    end_time = re.sub(r"\s|\[EndTime|\]|\"","",pgn[19])

    opening_group = re.search("openings/(.*)$",opening_url).group(1)
    opening = re.sub("-"," ",opening_group)

    parsed_pgn["date"] = date
    parsed_pgn["opening_url"] = opening_url
    parsed_pgn["opening"] = opening
    parsed_pgn["start_time"] = start_time
    parsed_pgn["end_time"] = end_time

    return parsed_pgn

def parse_game_node(game, uname):
    parsed = {}
    parsed["user_accuracy"] = ""
    parsed["opponent_accuracy"] = ""

    parsed["game_url"] = game["url"]
    parsed["game_id"] = re.search(r"live|daily/(.*)$",game["url"]).group(1)
    parsed["pgn"] = game["pgn"]
    parsed["time_class"] = game["time_class"]
    parsed["fen"] = game["fen"]

    if (game["white"]["username"] == uname):
        parsed["user_color"] = "white"
        parsed["user_rating"] = game["white"]["rating"]
        parsed["opponent"] = game["black"]["username"]
        parsed["opponent_rating"] = game["black"]["rating"]
        parsed["opponent_url"] = "https://www.chess.com/member/" + game["black"]["username"]
        parsed["result"] = game["white"]["result"]
        # check for accuracies 
        if "accuracies" in game: 
            parsed["user_accuracy"] = game["accuracies"]["white"]
            parsed["opponent_accuracy"] = game["accuracies"]["black"]

    else:
        parsed["user_color"] = "black"
        parsed["user_rating"] = game["black"]["rating"]
        parsed["opponent"] = game["white"]["username"]
        parsed["opponent_rating"] = game["white"]["rating"]
        parsed["opponent_url"] = "https://www.chess.com/member/" + game["white"]["username"]
        parsed["result"] = game["black"]["result"]
        # check for accuracies 
        if "accuracies" in game: 
            parsed["user_accuracy"] = game["accuracies"]["black"]
            parsed["opponent_accuracy"] = game["accuracies"]["white"]

    parsed_pgn = parse_pgn(game["pgn"])
    parsed["date"] = parsed_pgn["date"]
    parsed["opening_url"] = parsed_pgn["opening_url"]
    parsed["opening"] = parsed_pgn["opening"]
    parsed["start_time"] = parsed_pgn["start_time"]
    parsed["end_time"] = parsed_pgn["end_time"]

    return parsed

def get_stats(json_path, username):

    with open(json_path, "r") as f:
        data = json.load(f)


    sql = """CREATE TABLE IF NOT EXISTS games (
                user_accuracy TEXT, 
                opponent_accuracy TEXT, 
                game_url TEXT, 
                game_id TEXT, 
                pgn TEXT, 
                time_class TEXT, 
                fen TEXT, 
                user_color TEXT, 
                user_rating TEXT, 
                opponent TEXT, 
                opponent_rating TEXT, 
                opponent_url TEXT, 
                result TEXT, 
                date TEXT, 
                opening_url TEXT, 
                opening TEXT, 
                start_time TEXT, 
                end_time TEXT);
          """
    conn = sqlite3.connect(f"{username}.db")
    cur = conn.cursor()
    cur.execute(sql)

    rows = []
    # lol
    for year in data.keys():
        months_lst = data[year]
        for month_dict in months_lst:
            for month in month_dict:
                games_dict = month_dict[month]
                for games in games_dict:
                    for game in games_dict[games]:
                        node = parse_game_node(game, username)
                        print(node["game_id"])
                        row = tuple(list(node.values()))
                        rows.append(row)

    # this seems normal
    cur.executemany("INSERT INTO games VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", rows)
    conn.commit()  


if __name__ == '__main__': 
    main()