<template>
        <div class="div container eloOverTime chart pt-3 pb-3" id="eloGraph" :timeClass="{timeClass}">
      <div class="row" id="eloCardRow">
        <div class="card" id="eloCard">
        <h2 class="card-title  mt-2">
          <strong>
            ELO Over Time 
          </strong>
        </h2>
        <p class="card-text"> Click data points to open game in another window. Click and drag to zoom in on specific area </p>
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
/* .eloOverTime {
  max-width: 70%;
  max-height: 50%;
} */
</style>