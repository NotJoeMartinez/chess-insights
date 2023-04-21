<template>

      <NavBar/>
      <InputForm @get-all-user-data="getAllUserData"/>
        <div v-if="showSpinner" class="container">
        <div class="spinner-border">
        </div>
            {{ spinnerText }}
        </div>

        <ProgBar
        v-if="showProg"
        :progress="progress"
        :games-found="gamesFound"
        />

        <div v-if="showCharts">
        <ExportData/>

        <UserOverview
        @update-user-overview="updateOverview($event)"
        :ovUserName="ovUserName"
        :ovTimeClass="ovTimeClass"
        :ovTotalGames="ovTotalGames"
        :ovWinPercentage="ovWinPercentage"
        :ovWinCount="ovWinCount"
        :ovDrawPercentage="ovDrawPercentage"
        :ovDrawCount="ovDrawCount"
        :ovLossPercentage="ovLossPercentage"
        :ovLossCount="ovLossCount"
        />

        <EloOverTime
        @update="writeEloOverTime($event)"
        :timeClass="eloTimeClass"
        />

        <OpeningGraph
        @update-time-class="openingsTimeClass = $event"
        :timeClass="openingsTimeClass"
        />


        <WinChart 
        @updateWin="winTimeClass = $event"
        :timeClass="winTimeClass"
        />

<LossChart 
@updateLoss="lossTimeClass = $event"
:timeClass="lossTimeClass"
/>

</div>

</template>

<script>
import { verifyLiveChess, getLargestTimeClass, parseAndSaveArchivedGames, saveOpeningsData, 
  clearLocalStorage} from '@/scripts/utils.js'

import NavBar from "./NavBar.vue";
import InputForm from "./InputForm.vue";
import ProgBar from "./ProgBar.vue";
import UserOverview from "./UserOverview.vue";
import EloOverTime from "./EloOverTime.vue";
import OpeningGraph from "./OpeningGraph.vue";
import WinChart from "./WinChart.vue";
import LossChart from "./LossChart.vue";
import ExportData from "./ExportData.vue";

export default {
  name: "HomePage",
  components: {
    NavBar,
    InputForm,
    ProgBar,
    UserOverview,
    EloOverTime,
    OpeningGraph,
    WinChart,
    LossChart,
    ExportData
  },
  data() {
    return {
      showSpinner: false,
      spinnerText: "",
      showProg: false,
      showCharts: false,
      gamesFound: 0,
      progress: 0,
      totalUserGames: 0,
      eloTimeClass: '',
      openingsTimeClass: '',
      lossTimeClass: '',
      winTimeClass: '',
      // overview
      ovUserName: '',
      ovTimeClass: '',
      ovUserGames: 0,
      ovWinPercentage: 0,
      ovWinCount: 0,
      ovDrawCount: 0,
      ovDrawPercentage: 0,
      ovLossCount: 0,
      ovLossPercentage: 0,
      ovTotalGames: 0,
    }
  },
  methods: {

    async getAllUserData(userName) {
      this.showCharts = false;           
      clearLocalStorage();

      this.ovUserName = userName;
      this.showSpinner = true;
      this.spinnerText = "Fetching user data...";
      this.showProg = true;

      let playerStatsUrl = `https://api.chess.com/pub/player/${userName}/stats`;
      var playerStatsRes = await fetch(playerStatsUrl);
      var playerStats = await playerStatsRes.json();

      if (playerStatsRes.status != 404) {
        window.localStorage.setItem("playerStats", JSON.stringify(playerStats));
      } 
      else {
        this.showSpinner = false;
        alert("User Not found");
        return;
      }

      let archiveUrl = `https://api.chess.com/pub/player/${userName}/games/archives`;
      var response = await fetch(archiveUrl);
      var archiveMonths = await response.json();
      var archiveUrls = archiveMonths.archives
      let totalGames = 0;

      let archivedGames = []
      for (var i=0; i<archiveUrls.length; i++) {
          var archive = await fetch(archiveUrls[i]);
          var archiveJson = await archive.json();
          var archiveGameList = archiveJson.games;
          for (var j=0; j<archiveGameList.length; j++)  
          {
            if (verifyLiveChess(archiveGameList[j])){
                archivedGames.push(archiveGameList[j]);
                totalGames = totalGames + 1;
            }
          }
        let prog = Math.ceil((i/ archiveUrls.length) * 100);
        this.gamesFound = totalGames;
        this.progress = prog;
      }
      this.totalUserGames = totalGames;
      this.showProg = false;
      if (archivedGames.length < 1) {
        this.showProg = false;
        alert("No games found under that user")
        return; 
      }
      this.spinnerText = "saving data...";
      window.localStorage.setItem("userName", userName);
      try {
          window.localStorage.setItem("archivedGames", JSON.stringify(archivedGames));
        }
        catch(err) {
          let inlineStorage = document.createElement("div");
          let appDiv = document.getElementById("app");
          inlineStorage.setAttribute("id", "inlineStorage");
          inlineStorage.setAttribute("hidden", "hidden");
          inlineStorage.textContent = JSON.stringify(archivedGames);
          appDiv.appendChild(inlineStorage);
        }

        parseAndSaveArchivedGames();
        saveOpeningsData();
        
        let largestTimeClass = getLargestTimeClass(playerStats);

        this.ovTimeClass = largestTimeClass;

        this.openingsTimeClass = largestTimeClass;
        this.winTimeClass = largestTimeClass;
        this.lossTimeClass = largestTimeClass;

        this.updateOverview("all")
        this.writeEloOverTime(largestTimeClass);

        this.showSpinner = false;
        this.showCharts = true;
        
    },

    // writeEloOverTime
    writeEloOverTime(timeClass="rapid"){



      this.eloTimeClass = timeClass;
      this.showCharts = true;

    },

    updateOverview(timeClass) {
        
      let userStats = window.localStorage.getItem("playerStats");
      userStats = JSON.parse(userStats);
      let apiTimeClass = "chess_" + timeClass;
      let numWins = 0;
      let numLosses = 0; 
      let numDraws = 0;


      if (timeClass == "all"){
        let validTimeClasses = ["blitz", "rapid", "bullet", "daily"];
        for (let i = 0; i<validTimeClasses.length; i++) {
          apiTimeClass = "chess_" + validTimeClasses[i];
            if (userStats.hasOwnProperty(apiTimeClass)){
              numWins += userStats[apiTimeClass].record.win;
              numLosses += userStats[apiTimeClass].record.loss;
              numDraws += userStats[apiTimeClass].record.draw;
            }
          }

      } 
      else {

        // eslint-disable-next-line no-prototype-builtins
        if (userStats.hasOwnProperty(apiTimeClass)){
          numWins = userStats[apiTimeClass].record.win;
          numLosses = userStats[apiTimeClass].record.loss;
          numDraws = userStats[apiTimeClass].record.draw;
        }
      }

      

      let totalGames = numWins + numDraws + numLosses;


      let decWins = (numWins * 100) / totalGames;
      let percentWins = parseFloat(decWins.toFixed(1));

      let decDraws = (numDraws * 100) / totalGames;
      let percentDraws = parseFloat(decDraws.toFixed(1));

      let decLosses = (numLosses * 100) / totalGames;
      let percentLosses = parseFloat(decLosses.toFixed(1))


      if (isNaN(percentWins)) {
        percentWins = 0;
      }
      if (isNaN(percentDraws)) {
        percentDraws = 0;
      }
      if (isNaN(percentLosses)) {
        percentLosses = 0;
      } 
  
      this.ovTimeClass = timeClass;

      this.ovTotalGames = totalGames.toString();
      this.ovWinPercentage = percentWins.toString();
      this.ovWinCount = numWins.toString();
      this.ovDrawPercentage = percentDraws.toString();
      this.ovDrawCount = numDraws.toString();
      this.ovLossPercentage = percentLosses.toString();
      this.ovLossCount = numLosses.toString();

      },


    }

}

</script>
