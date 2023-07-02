
<template>
    <NavBar/>
    <div class="container px-3 py-3 mt-5" id="aboutPage">
            <h2 class="demoTitle">How to use this site</h2>
            <p>
                chessinsights.xyz is an open source website that aims to provide an intuitive and 
                free way to explore your chess.com data. It is built with Vue.js and Bootstrap and 
                pulls data directly from the chess.com API. The source code is available on github 
                <a target="_blank" href="https://github.com/NotJoeMartinez/chess-insights">here</a>.
            </p>

            <hr class="border border-1 opacity-50">
            <h3>General usage</h3>
            <img src="../assets/magnusDemo.png" alt="usage" class="img-fluid demo">
            <p>
                Enter in any chess.com username and click the "get insights" button. And 
                the site will generate a variety of charts and graphs based on the data. 
            </p>
            <h3>Exporting Data</h3>
            <img src="../assets/exporting.png" alt="usage" class="img-fluid demo">
            <p>
                To export your data click the button that says export and you will see this popup.
                See the git repo for a more detailed explanation of each of the data points pulled   
                from the API. If you want as much data as possible or want to reupload your 
                data to the site select the json file option.
            </p>
            <h3>Importing Data</h3>
            <img src="../assets/importing.png" alt="usage" class="img-fluid demo">
            <p>
                To import your data click the button that says import and it will bring up a file
                picker. Select the json file you downloaded from the export page and click open.
                I recommend this option if you use the site frequently as it will prevent us
                from spamming the chess.com API with requests. 
            </p>

            <hr class="border border-1 opacity-50">
            <h2>What the graphs mean</h2>

            <img src="../assets/slicers.png" alt="usage" class="img-fluid demo">
            <p>
                Every graph has a row of buttons that allow you to filter the data 
                by the time class. Rapid 10+0, Blitz 5+0, Bullet 1+0, etc.
            </p>

            <h3>ELO over time</h3>
            <img src="../assets/eloGraph.png" alt="usage" class="img-fluid demo">
            <p>
                The ELO over time graph shows your ELO over time. The the line is made up off
                unique data points representing each game you played. You can zoom in by 
                clicking and dragging on the chart and if you click a data point it 
                open the game replay in a new tab on chess.com.
            </p>
            <h3>Top Openings Graph</h3>
            <img src="../assets/topOpenings.png" alt="usage" class="img-fluid demo">
            <p>
                The top openings graph is a stacked bar chart showing your most played openings.
                The openings shown are in the top 50% of openings played and I are counted 
                by their mainline variation. If you click on a bar it will open a new tab   
                to the chess.com wiki of the opening.
            </p>

            <h3>Result By Opponent Ratings</h3>
            <img src="../assets/resByOpp.png" alt="usage" class="img-fluid demo">
            <hr class="border border-1 opacity-50">
            <p>
                The result by opponent ratings graph shows your win/loss/draw rate against opponents of
                different ratings. The ratings are grouped into 100 point increments. 
            </p>

            <h2> Explore Page </h2>

            <img src="../assets/explorePage.png" alt="usage" class="img-fluid demo">
            <p>
                The explore page allows you to search through all of the games in the database.
                You can search by most of the columns in the table by selecting the dropdown
                next to the search bar. You can set filters by selecting the dropdowns 
                at the top of the columns. You can also export the data to a csv file by 
                clicking the export button.
            </p>

            <hr class="border border-1 opacity-50">
            <h2><a id="donations"> Donations </a> </h2>
                
            <p>
                I'm a broke collage student and I made this site for fun. If you want to support
                this site and help me pay for hosting you can donate to me on the following platforms:
            </p>

                <div class="begginglinks">
                    <ul>
                        <li><a target="_blank" href="https://www.buymeacoffee.com/notjoemartinez"> Buy Me A Coffee</a></li>
                        <li><a target="_blank" href="https://paypal.me/notjoemartinez"> PayPal</a></li>
                    </ul>
                </div>
            <p>
                Or if you plan on purchasing a chess.com premium membership you can use my
                affiliate link <a target="_blank" href="https://www.chess.com/membership?ref_id=74104030">here</a>.
            </p>
            <p>
                If you have any questions or suggestions you can contact me via email at
                notjoemartinez@tutanota.com or just open an issue on the github repo.
                I also have a blog and youtube channel where I post about my projects 
                and other things.
            </p>
            <div class="begginglinks">
            <ul>
                <li><a target="_blank" href="https://notjoemartinez.com">Blog</a></li>
                <li><a target="_blank" href="https://www.youtube.com/@notjoemartinez4438/videos">YouTube</a></li>
            </ul>


        <div class="spacers">

            <br>
            .
            <br>
            .
            <br>
            .
            <br>
            .
            <br>
            .
            <br>
            .
            <br>
            .
            <br>
            .
            <br>
            .
            <br>
            .
            <br>
            
        </div>

        </div>
    </div>
</template>

<script>
export default {
    name: "About",

}
</script>

<style scoped>

.spacers {
    color: #262421;
}
.beggingLings {
    margin-bottom: 100px;
}
img.demo {
    display: flex; 
    align-content: center;
    border: 1px solid #779556;
    padding-left: 10px;
    padding-right: 10px;
}
h2 {
    color: #fff;
    font-size: 1.5em;
    font-weight: bold;
    margin-bottom: 20px;
}
h3{
    color: #fff;
}
#aboutPage{
	color: hsla(0,0%,100%,.72); 
    background: #262421;
    margin-top: 20px;
    font-size: 1.5em;
    text-align: start;
    max-width: 900px;
}
</style>