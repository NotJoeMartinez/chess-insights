import requests, json, re, datetime, sys 

def main():
    arg_one = sys.argv[1]

    if arg_one == "--user":
        if len(sys.argv) < 3:
            print("usage: python3 --user [username]")
            exit()
        else:
            user = sys.argv[2] 
            get_games(user)
    elif arg_one == "--stats":
        if len(sys.argv) < 3:
            print("usage: python3 --stats [path/to/json_file.json]")
            exit()
        else:
            json_path = sys.argv[2]
            get_stats(json_path)
    else:
        print(f"Argument [{arg_one}] not recognized")


def get_games(user):
    r = requests.get(f"https://api.chess.com/pub/player/{user}/games/archives")
    month_urls = r.json()

    games_dict = {}

    for url in month_urls["archives"]:
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
    

def get_stats(json_path):

    with open(json_path, "r") as f:
        data = json.load(f)

    # lol
    for year in data.keys():
        months_lst = data[year]
        for month_dict in months_lst:
            for month in month_dict:
                games_dict = month_dict[month]
                for games in games_dict:
                    for game in games_dict[games]:
                        print(game["url"])
    





if __name__ == '__main__': 
    main()