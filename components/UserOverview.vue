<template>
    <div class="div container userOverview chart  pt-3 pb-3" id="userOverview ">
      <div class="row" >
        <div class="card" id="eloCard">

        <h2 class="card-title font-weight-bold m-1" >
          <strong>
            {{ userName }}
          </strong>
        </h2>

          <div class="row" id="totalRow">
            <h3>
              {{ ovTotalGames }} games
            </h3>
          </div>

          <div class="container" id="winLossBar">

          <div class="row" id="winLossRow">
            <div class="col">
              <h4><b>{{ ovWinPercentage }}%</b></h4>
              {{ ovWinCount }} Won
            </div>
            <div class="col">
              <h4><b>{{ ovDrawPercentage }}%</b></h4>
              {{ ovDrawCount }} Drawn
            </div>
            <div class="col">
              <h4><b>{{ ovLossPercentage }}%</b></h4>
              {{ ovLossCount }} Lost
            </div>
          </div>


        <div class="progress">
          <div class="progress-bar" id="progWinds" role="progressbar" :style="{ width: ovWinPercentage + '%' }" :aria-valuenow="ovWinPercentage" aria-valuemin="0" aria-valuemax="100"> </div>
          <div class="progress-bar " id="progDraws" role="progressbar" :style="{ width: ovDrawPercentage + '%'}" :aria-valuenow="ovDrawPercentage" aria-valuemin="0" aria-valuemax="100"></div>
          <div class="progress-bar " id="progLoss" role="progressbar" :style="{ width: ovLossPercentage + '%'}" :aria-valuenow="ovLossPercentage" aria-valuemin="0" aria-valuemax="100"></div>
        </div>

          <div class="row" id="timePlayed">

            <div class="col">
              <h4><b>Time Played</b></h4>
              {{ ovTimePlayed }} 
            </div>
          </div>

        </div>
        <div class="card-body" id="eloCardBody">
          <button  class="btn btn-primary slicer" :class="{ active: ovTimeClass === 'all' }" v-on:click="updateOverview('all')">All</button>
          <button  class="btn btn-primary slicer" :class="{ active: ovTimeClass === 'bullet' }" v-on:click="updateOverview('bullet')">Bullet</button>
          <button  class="btn btn-primary slicer" :class="{ active: ovTimeClass === 'blitz' }" v-on:click="updateOverview('blitz')">Blitz</button>
          <button  class="btn btn-primary slicer" :class="{ active: ovTimeClass === 'rapid' }" v-on:click="updateOverview('rapid')">Rapid</button>
          <button  class="btn btn-primary slicer" :class="{ active: ovTimeClass === 'daily' }" v-on:click="updateOverview('daily')">Daily</button>
        </div>
      </div>
      </div>
    </div>
    

</template>

<script>
export default {
    name: "UserOverview",
    props: {
        ovTimeClass: String,
        userName: String,
        ovWinCount: Number,
        ovDrawCount: Number,
        ovLossCount: Number,
        ovWinPercentage: Number,
        ovDrawPercentage: Number,
        ovLossPercentage: Number,
        ovTotalGames: Number,
        ovTimePlayed: String,
    },
    methods: {
        updateOverview(newovTimeClass) {
            this.$emit('update-user-overview', newovTimeClass);
        },
    },
    mounted: function () {
      console.log("user overview")
    }
}
</script>

<style>



#winLossBar{
  max-width: 60%;
}
#progWinds {
  background-color: #85a94e;
}
#progDraws {
  background-color: #8b8987;
}
#progLoss {
  background-color: #b23330;
}

/* small screens */
@media (max-width: 576px) {
  #eloCard{
    max-width: 100%;
  }
  #eloCardBody{
    max-width: 100%;
  }
  #winLossBar{
    max-width: 100%;
  }
  #progWinds {
    background-color: #85a94e;
  }
  #progDraws {
    background-color: #8b8987;
  }
  #progLoss {
    background-color: #b23330;
  }
}

</style>