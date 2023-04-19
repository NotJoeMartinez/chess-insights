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

    <EloOverTime
    @update="writeEloOverTime($event)"
     :timeClass="eloTimeClass"
     :totalUserGames="totalUserGames"
     :winPercentage="winPercentage"
     :winCount="winCount"
     :drawPercentage="drawPercentage"
     :drawCount="drawCount"
     :lossPercentage="lossPercentage"
     :lossCount="lossCount"
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
import NavBar from './components/NavBar.vue'
import InputForm from './components/InputForm.vue'
import EloOverTime from './components/EloOverTime.vue'
import ProgBar from './components/ProgBar.vue'
import OpeningGraph from './components/OpeningGraph.vue'
import WinChart from './components/WinChart.vue'
import LossChart from './components/LossChart.vue'
import ExportData from './components/ExportData.vue'

// scripts
import { verifyLiveChess, getLargestTimeClass, parseAndSaveArchivedGames, saveOpeningsData } from './scripts/utils.js'

export default {
  name: 'App',
  components: {

    NavBar,
    InputForm,
    EloOverTime, 
    ProgBar,
    OpeningGraph,
    WinChart,
    LossChart,
    ExportData,
  },
  data() {
    return {
      showSpinner: false,
      spinnerText: "Loading...",
      showProg: false,
      showCharts: false,
      gamesFound: 0,
      progress: 0,
      totalUserGames: 0,
      eloTimeClass: '',
      openingsTimeClass: '',
      lossTimeClass: '',
      winTimeClass: '',
    }
  },
  methods: {

    async getAllUserData(userName) {
      console.log(userName)

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

        this.openingsTimeClass = largestTimeClass;
        this.winTimeClass = largestTimeClass;
        this.lossTimeClass = largestTimeClass;

        this.writeEloOverTime(largestTimeClass);
        this.showCharts = true;
        
    },

    // writeEloOverTime
    writeEloOverTime(timeClass="rapid"){

      // if (this.showCharts == true ) {
      //   this.showCharts = false;
      // }
      let userStats = window.localStorage.getItem("playerStats");
      userStats = JSON.parse(userStats);
      let apiTimeClass = "chess_" + timeClass;
      let numWins = 0;
      let numLosses = 0; 
      let numDraws = 0;


      // eslint-disable-next-line no-prototype-builtins
      if (userStats.hasOwnProperty(apiTimeClass)){
        numWins = userStats[apiTimeClass].record.win;
        numLosses = userStats[apiTimeClass].record.loss;
        numDraws = userStats[apiTimeClass].record.draw;
      }

      let totalGames = numWins + numDraws + numLosses;

      let decWins = (numWins * 100)/totalGames;
      let percentWins = Math.round(decWins * 100 ) / 100;

      let decDraws = (numDraws * 100)/totalGames;
      let percentDraws = Math.round(decDraws * 100)/100;

      let decLosses = (numLosses * 100)/totalGames;
      let percentLosses = Math.round(decLosses * 100)/100;

  

      this.showSpinner = false;

      this.winPercentage = percentWins.toString();
      this.winCount = numWins.toString();
      this.drawPercentage = percentDraws.toString();
      this.drawCount = numDraws.toString();
      this.lossPercentage = percentLosses.toString();
      this.lossCount = numLosses.toString();
      this.eloTimeClass = timeClass;

      this.showCharts = true;

      // graphElo(timeClass);

      },

    }
      
}


</script>


<style>
</style>