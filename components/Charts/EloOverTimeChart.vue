<template>
        <div class="div container chart pt-3 pb-3" id="eloGraph" >
      <div class="row" id="eloCardRow">
        <div class="card" id="eloCard">
        <h2 class="card-title  mt-2">
          <strong>
            ELO Over Time 
          </strong>
        </h2>
        <p class="card-text"> Click data points to open game in another window. Click and drag to zoom in on specific area </p>
        <div class="card-body" id="eloCardBody">
          <canvas id="eloOverTime"></canvas> 
          <button id="eotBullet" class="btn btn-primary slicer" :class="{ active: timeClass === 'bullet' }" v-on:click="updateElo('bullet')">Bullet</button>
          <button id="eotBlitz" class="btn btn-primary slicer" :class="{ active: timeClass === 'blitz' }" v-on:click="updateElo('blitz')">Blitz</button>
          <button id="eotRapid" class="btn btn-primary slicer" :class="{ active: timeClass === 'rapid' }" v-on:click="updateElo('rapid')">Rapid</button>
          <button id="eotDaily" class="btn btn-primary slicer" :class="{ active: timeClass === 'daily' }" v-on:click="updateElo('daily')">Daily</button>
          <button class="btn btn-secondary slicer" id="eloZoomReset" v-on:click="resetZoom">Reset Zoom</button>
        </div>
      </div>
      </div>
    </div>
  </template>
  
 <script>
  import { graphElo, resetChartZoom } from '~/utils/chartElo.js';
    export default {
      name: 'EloOverTimeChart',
      ssr: false,
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
          this.$emit('update', timeClass);
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