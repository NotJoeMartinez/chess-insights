import requests, json, re, datetime, sys

def main():
    user = sys.argv[1]
    get_games(user)


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
    with open(f"{user}_chess_com_{today}.json", "w") as f:
        json.dump(games_dict,f)

    



if __name__ == '__main__': 
    main()