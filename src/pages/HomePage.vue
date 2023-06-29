<template>

  <NavBar />

  <InputForm 
  @get-all-user-data="getAllUserData" 
  @read-file-upload="finishSetup" 
  />

  <div v-if="showSpinner" class="container">
    <div class="spinner-border">
    </div>
    {{ spinnerText }}
  </div>

  <ProgBar v-if="showProg" :progress="progress" :games-found="gamesFound" />

  <div v-if="showCharts">
    <div class="container px-4">
      <div class="row">
        <div class="col d-flex justify-content-center gap-2">
          <ExploreBtn />
          <ExportBtn />
        </div>
      </div>
    </div>



    <UserOverview @update-user-overview="updateOverview($event)" :userName="userName" :ovTimeClass="ovTimeClass"
      :ovTotalGames="ovTotalGames" :ovWinPercentage="ovWinPercentage" :ovWinCount="ovWinCount"
      :ovDrawPercentage="ovDrawPercentage" :ovDrawCount="ovDrawCount" :ovLossPercentage="ovLossPercentage"
      :ovLossCount="ovLossCount" />

    <EloOverTime @update="writeEloOverTime($event)" :timeClass="eloTimeClass" />

    <ResByOpRating 
    :timeClass="resByOppTimeClass" 
    @updateResByOpp="resByOppTimeClass = $event"  
    />

    <OpeningGraph @update-time-class="openingsTimeClass = $event" :timeClass="openingsTimeClass" />

    <WinChart @updateWin="winTimeClass = $event" :timeClass="winTimeClass" />

    <LossChart @updateLoss="lossTimeClass = $event" :timeClass="lossTimeClass" />

    <DrawChart @updateDraw="drawTimeClass = $event" :timeClass="drawTimeClass" />

    <ExportPopup />

  </div>

</template>

<script>
  import {
    getLargestTimeClass,
    clearLocalStorage,
    fetchUserStats,
    fetchArchiveUrls,
    logAPIRequest
  } from '@/scripts/utils.js'

  import { 
    parseAndSaveArchivedGames, 
    verifyLiveChess,
  } from '@/scripts/archiveUtils.js'

  import {
    calcOpeningsData,
    saveOpeningsData
  } from '@/scripts/openingsUtils.js'


  import NavBar from "@/components/NavBar.vue";
  import InputForm from "@/components/InputForm.vue";
  import ProgBar from "@/components/ProgBar.vue";
  import UserOverview from "@/components/UserOverview.vue";
  import EloOverTime from "@/components/EloOverTime.vue";
  import OpeningGraph from "@/components/OpeningGraph.vue";
  import ResByOpRating from "@/components/ResByOpRating.vue"
  import WinChart from "@/components/WinChart.vue";
  import LossChart from "@/components/LossChart.vue";
  import DrawChart from "@/components/DrawChart.vue";
  import ExportBtn from "@/components/Buttons/ExportBtn.vue";
  import ExploreBtn from "@/components/Buttons/ExploreBtn.vue"
  import ExportPopup from "@/components/ExportPopup.vue"

  export default {
    name: "HomePage",
    components: {
      NavBar,
      InputForm,
      ProgBar,
      UserOverview,
      EloOverTime,
      OpeningGraph,
      ResByOpRating,
      WinChart,
      LossChart,
      DrawChart,
      ExportBtn,
      ExploreBtn,
      ExportPopup
    },
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
        resByOppTimeClass: '',
        openingsTimeClass: '',
        lossTimeClass: '',
        winTimeClass: '',
        drawTimeClass: '',
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
      async fetchUserData(userName){
        console.clear();
        clearLocalStorage();
        this.gamesFound = 0;
        this.progress = 0;
        logAPIRequest(userName);

        // get overall stats
        let userStatsRes = await fetchUserStats(userName);
        if (userStatsRes.status != 200){
          this.showSpinner = false;
          alert(`There was an error fetching the user's stats. code: ${userStatsRes.status}`);
          return "error";
        }
        else {
          let userStats = await userStatsRes.json();
          window.localStorage.setItem("playerStats", JSON.stringify(userStats));
        }


        // get archive urls list
        let archiveUrlsRes = await fetchArchiveUrls(userName);
        if (archiveUrlsRes.status != 200){
          this.showSpinner = false;
          alert(`There was an error fetching the user's archives code: ${archiveUrlsRes.status}`);
          return "error";
        }
        let archiveMonths = await archiveUrlsRes.json()
        let archiveUrls = archiveMonths.archives;
        let totalGames = 0;
        let archivedGames = []

        for (var i = 0; i < archiveUrls.length; i++) {
          var archive = await fetch(archiveUrls[i]);
          var archiveJson = await archive.json();
          var archiveGameList = archiveJson.games;
          for (var j = 0; j < archiveGameList.length; j++) {
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
        this.showProg = false;

        if (archivedGames.length < 1) {
          this.showProg = false;
          alert("No games found under that user")
          return;
        }

        this.spinnerText = "saving data...";

        window.localStorage.setItem("userName", userName);
        parseAndSaveArchivedGames(archivedGames);
        saveOpeningsData(calcOpeningsData());

      },

      async getAllUserData(userName) {
        clearLocalStorage();
        const testUsersEnabled = process.env.VUE_APP_ENABLE_TEST_USERS;
        this.showCharts = false;
        this.showSpinner = true;

        if (testUsersEnabled == "true" && userName.startsWith("testUser")) {
          let userId = userName[userName.length - 1]
          let testDataPath = `./testData/testUser${userId}.json`;
          let testUserData = await fetchTestUserData(testDataPath);
          importJsonData(testUserData);
        }
        else {
          this.spinnerText = "Fetching user data...";
          this.showProg = true;

          userName = userName.replace(/^\s+|\s+$/g, "");
          let fetchStatus = await this.fetchUserData(userName);
          if (fetchStatus == "error") {
            this.showSpinner = false;
            this.showProg = false;
            this.showCharts = false;
            return;
          }
        }
        this.finishSetup();
      },

      finishSetup(){
        
        this.userName = window.localStorage.getItem("userName");

        let largestTimeClass = getLargestTimeClass();
        this.ovTimeClass = largestTimeClass;

        this.openingsTimeClass = "all";
        this.winTimeClass = "all";
        this.lossTimeClass = "all";
        this.drawTimeClass = "all";
        this.resByOppTimeClass = "all";

        this.showSpinner = false;

        this.updateOverview("all")
        this.writeEloOverTime(largestTimeClass);

        this.showCharts = true;

        const element = document.getElementById('uname');
        element.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
      },

      writeEloOverTime(timeClass = "rapid") {
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


        if (timeClass == "all") {
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