<template>
<div>
  <NavBar /> 

  <InputForm 
  @get-all-user-data="getAllUserData" 
  @read-file-upload="handleFileUpload" 
  />

  <div v-if="showSpinner" class="container">
    <div class="spinner-border">
    </div>
    {{ spinnerText }}
  </div>

  <ProgBar 
  v-if="showProg" 
  :progress="progress" 
  :games-found="gamesFound" />

  <div v-if="showCharts">

    <div class="container px-4">
      <div class="row">
        <div class="col d-flex justify-content-center gap-2">
          <ButtonsClearCharts />
          <ButtonsExploreBtn />
          <ButtonsExportBtn />
        </div>
      </div>
    </div>

    <UserOverview 
    @update-user-overview="updateOverview($event)" 
    :userName="userName" 
    :ovTimeClass="ovTimeClass"
    :ovTotalGames="ovTotalGames" 
    :ovWinPercentage="ovWinPercentage" 
    :ovWinCount="ovWinCount"
    :ovDrawPercentage="ovDrawPercentage" 
    :ovDrawCount="ovDrawCount" 
    :ovLossPercentage="ovLossPercentage"
    :ovLossCount="ovLossCount"
    :ovTimePlayed="ovTimePlayed" 
    />

    <ChartsEloOverTimeChart 
    @update="writeEloOverTime($event)" 
    :timeClass="eloTimeClass" />

    <ChartsOpeningChart
    @update-time-class="openingsTimeClass = $event" 
    @update-color="openingsColor = $event" 
    :timeClass="openingsTimeClass" 
    :color="openingsColor" />

    <ChartsResByRating
    :timeClass="resByOppTimeClass" 
    @updateResByOpp="resByOppTimeClass = $event" />

    <ChartsWinChart 
    @updateWin="winTimeClass = $event" 
    :timeClass="winTimeClass" />

    <ChartsLossChart 
    @updateLoss="lossTimeClass = $event" 
    :timeClass="lossTimeClass" 
    />

    <ChartsDrawChart 
    @updateDraw="drawTimeClass = $event" 
    :timeClass="drawTimeClass" 
    />

    <ExportPopup />


  </div>
</div>
</template>

<script>
  import {
    getLargestTimeClass,
    clearLocalStorage,
    fetchUserStats,
    fetchArchiveUrls,
    logAPIRequest
  } from '~/utils/utils.js'

  import { 
    parseAndSaveArchivedGames, 
    verifyLiveChess,
    getArchivedGames,
    getTotalTimePlayed
  } from '~/utils/archiveUtils.js'

  import {
    calcOpeningsData,
    saveOpeningsData,
    getSavedOpeningsData
  } from '~/utils/openingsUtils.js'

  export default {
    name: "HomePage",
    data() {
      return {
        userName: '',
        showSpinner: false,
        spinnerText: "",
        showProg: false,
        showCharts: false,
        gamesFound: 0,
        progress: 0,
        totalUserGames: 0,
        eloTimeClass: '',
        resByOppTimeClass: 'all',
        lossTimeClass: 'all',
        winTimeClass: 'all',
        drawTimeClass: 'all',
        ovTimeClass: '',
        ovUserGames: 0,
        ovWinPercentage: 0,
        ovWinCount: 0,
        ovDrawCount: 0,
        ovDrawPercentage: 0,
        ovLossCount: 0,
        ovLossPercentage: 0,
        ovTotalGames: 0,
        ovTimePlayed: 0,
      }
    },

    mounted: function () {
      let localData = this.getLocalData();
      if (localData !== null) {
        this.finishSetup();
      }
      else {
        clearLocalStorage();
      }
    },

    methods: {
      async getAllUserData(userName) {
        console.clear();
        clearLocalStorage();

        this.showCharts = false;
        this.showSpinner = true;
        this.spinnerText = "Fetching user data...";
        this.showProg = true;

        let totalGames = 0;
        this.gamesFound = 0;
        this.progress = 0;

        userName = userName.replace(/^\s+|\s+$/g, "");

        // logAPIRequest(userName);
        let userStatsRes = await fetchUserStats(userName);

        if (userStatsRes.error){
          alert(`There was an error fetching the user's stats. code: ${userStatsRes.status}`);
          this.showSpinner = false;
          this.showProg = false;
          this.showCharts = false;
          return;
        }
        else {
          let userStats = await userStatsRes.json();
          window.localStorage.setItem("playerStats", JSON.stringify(userStats));
        }


        let archiveUrlsRes = await fetchArchiveUrls(userName);
        if (archiveUrlsRes.status !== 200){
          this.showSpinner = false;
          this.showProg = false;
          this.showCharts = false;
          alert(`There was an error fetching the user's archives code: ${archiveUrlsRes.status}`);
          return;
        }

        let archiveMonths = await archiveUrlsRes.json()
        let archiveUrls = archiveMonths.archives;
        let archivedGames = []

        for (let i = 0; i < archiveUrls.length; i++) {
          let archive = await fetch(archiveUrls[i]);
          let archiveJson = await archive.json();
          let archiveGameList = archiveJson.games;

          if (archiveGameList === null || archiveGameList === undefined) {
            console.log("No games found in this archive");
            continue;
         }
          for (let j = 0; j < archiveGameList.length; j++) {
            if (verifyLiveChess(archiveGameList[j])) {
              archivedGames.push(archiveGameList[j]);
              totalGames = totalGames + 1;
            }
          }
          let prog = Math.ceil((i / archiveUrls.length) * 100);
          this.gamesFound = totalGames;
          this.progress = prog;
        }

        this.totalUserGames = totalGames;

        if (archivedGames.length < 1) {
          this.showSpinner = false;
          this.showCharts = false;
          this.showProg = false;
          alert("No games found under that user")
          return;
        }


        window.localStorage.setItem("userName", userName);
        parseAndSaveArchivedGames(archivedGames);
        saveOpeningsData(calcOpeningsData());
        this.finishSetup();
      },

      finishSetup(){
        this.showProg = false;
        this.spinnerText = "saving data...";

        this.userName = window.localStorage.getItem("userName");
        let largestTimeClass = getLargestTimeClass();
        this.updateOverview("all")
        this.writeEloOverTime(largestTimeClass);
        this.showSpinner = false;
        
        this.showCharts = true;

        const element = document.getElementById('uname');
        element.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });

      },

      handleFileUpload() {
        this.showCharts = false;
        this.showSpinner = true;
        this.spinnerText = "Fetching user data...";
        this.showProg = true;
        this.finishSetup();
      },

      writeEloOverTime(timeClass = "rapid") {
        this.eloTimeClass = timeClass;
      },

      updateOverview(timeClass) {
        let userStats = window.localStorage.getItem("playerStats");
        userStats = JSON.parse(userStats);
        let apiTimeClass = "chess_" + timeClass;
        let numWins = 0;
        let numLosses = 0;
        let numDraws = 0;


        if (timeClass === "all") {
          let validTimeClasses = ["blitz", "rapid", "bullet", "daily"];
          for (let i = 0; i < validTimeClasses.length; i++) {
            apiTimeClass = "chess_" + validTimeClasses[i];
            if (userStats.hasOwnProperty(apiTimeClass)) {
              numWins += userStats[apiTimeClass].record.win;
              numLosses += userStats[apiTimeClass].record.loss;
              numDraws += userStats[apiTimeClass].record.draw;
            }
          }

        } else {

          // eslint-disable-next-line no-prototype-builtins
          if (userStats.hasOwnProperty(apiTimeClass)) {
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

        let timePlayed = getTotalTimePlayed(); 

        this.ovTimeClass = timeClass;
        this.ovTotalGames = totalGames.toString();
        this.ovWinPercentage = percentWins.toString();
        this.ovWinCount = numWins.toString();
        this.ovDrawPercentage = percentDraws.toString();
        this.ovDrawCount = numDraws.toString();
        this.ovLossPercentage = percentLosses.toString();
        this.ovLossCount = numLosses.toString();
        this.ovTimePlayed = timePlayed.toString();

      },

      getLocalData() {
        let userName = window.localStorage.getItem("userName");
        let playerStats = window.localStorage.getItem("playerStats");
        let openings = getSavedOpeningsData()
        let archivedGames = getArchivedGames(); 
      

        if (userName === null || playerStats === null || openings === null || archivedGames === null) {
          return null;
        } else {
          return {
            userName: userName,
            playerStats: playerStats,
            openings: openings,
            archivedGames: archivedGames
          }
        }

      },

    }
  

  }
</script>