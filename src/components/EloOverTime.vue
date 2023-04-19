<template>
        <div class="div container eloOverTime" id="eloGraph" :timeClass="{timeClass}">
      <div class="row" id="eloCardRow">
        <div class="card" id="eloCard">
        <h2 class="card-title">
          ELO Over Time for <b>{{ timeClass }}</b> games   
        </h2>

          <p class="card-text"> Click data points to open game in another window. Click and drag to zoom in on specific area </p>
          <div class="row" id="totalRow">
            <h3>
              {{ Number(winCount) + Number(drawCount) + Number(lossCount) }} Games
            </h3>
          </div>
          <div class="row" id="winLossRow">
            <div class="col">
              <!-- <h3><b>{{ winPercentage }}%</b></h3> -->
              {{ winCount }} Won
            </div>
            <div class="col">
              <!-- <h3><b>{{ drawPercentage }}%</b></h3> -->
              {{ drawCount }} Drawn
            </div>
            <div class="col">
              <!-- <h3><b>{{ lossPercentage }}%</b></h3> -->
              {{ lossCount }} Lost
            </div>
          </div>

        <div class="progress" id="winLossDrawGraph">
          <div class="progress-bar" id="progWinds" role="progressbar" :style="{ width: winPercentage + '%' }" :aria-valuenow="winPercentage" aria-valuemin="0" aria-valuemax="100">{{ winPercentage }}%</div>
          <div class="progress-bar " id="progDraws" role="progressbar" :style="{ width: drawPercentage + '%'}" :aria-valuenow="drawPercentage" aria-valuemin="0" aria-valuemax="100">{{ drawPercentage }}%</div>
          <div class="progress-bar " id="progLoss" role="progressbar" :style="{ width: lossPercentage + '%'}" :aria-valuenow="lossPercentage" aria-valuemin="0" aria-valuemax="100">{{ lossPercentage }}%</div>
        </div>

        <div class="card-body" id="eloCardBody">
          <!-- <canvas id="eloOverTime" :style="{ display: 'block', boxSizing: 'border-box', touchAction: 'auto', userSelect: 'none', height: '619px', width: '1238px' }" ></canvas> -->
          <canvas id="eloOverTime"></canvas> 
          <button id="eotBullet" class="btn btn-primary slicer" :class="{ active: timeClass === 'bullet' }" v-on:click="updateElo('bullet')">BULLET</button>
          <button id="eotBlitz" class="btn btn-primary slicer" :class="{ active: timeClass === 'blitz' }" v-on:click="updateElo('blitz')">BLITZ</button>
          <button id="eotRapid" class="btn btn-primary slicer" :class="{ active: timeClass === 'rapid' }" v-on:click="updateElo('rapid')">RAPID</button>
          <button id="eotDaily" class="btn btn-primary slicer" :class="{ active: timeClass === 'daily' }" v-on:click="updateElo('daily')">DAILY</button>
          <button class="btn btn-secondary" id="eloZoomReset" v-on:click="resetZoom">Reset Zoom</button>
        </div>
      </div>
      </div>
    </div>
  </template>
  
  <script>
  import { graphElo, resetChartZoom } from '../scripts/graphElo.js';
    export default {
      name: 'EloOverTime',
      data() {
        return {
            eloChartInstance: null,
        };
      },
      props: {
        timeClass: String,
        winPercentage: String,
        drawPercentage: String,
        lossPercentage: String,
        winCount: Number,
        drawCount: Number,
        lossCount: Number,
      },
      methods : {
        updateElo(timeClass) {
          this.$emit('update', timeClass)
          graphElo(timeClass);
          },
        resetZoom() {
              resetChartZoom(this.timeClass);
            }
          },

      mounted: function()  {
        graphElo(this.timeClass);
        }
    }
   

  </script>

<style scoped>
#progWinds {
  background-color: #85a94e;
}
#progDraws {
  background-color: #8b8987;
}
#progLoss {
  background-color: #b23330;
}
</style>