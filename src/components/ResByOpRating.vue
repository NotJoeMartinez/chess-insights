<template>
    <div class="div container resByOp chart pt-3 pb-3" id="resByOp" :timeClass="{timeClass}">
  <div class="row" id="resByOpRow">
    <div class="card" id="resByOpCard">
    <h2 class="card-title  mt-2">
      <strong>
        Result By Opponent Rating
      </strong>
    </h2>
    <div class="card-body" id="resByOpCardBody">
      <!-- <canvas id="eloOverTime" :style="{ display: 'block', boxSizing: 'border-box', touchAction: 'auto', userSelect: 'none', height: '619px', width: '1238px' }" ></canvas> -->
      <canvas id="resByOpChart"></canvas> 
      <button id="eotBullet" class="btn btn-primary slicer" :class="{ active: timeClass === 'bullet' }" v-on:click="updateResByOp('bullet')">Bullet</button>
      <button id="eotBlitz" class="btn btn-primary slicer" :class="{ active: timeClass === 'blitz' }" v-on:click="updateResByOp('blitz')">Blitz</button>
      <button id="eotRapid" class="btn btn-primary slicer" :class="{ active: timeClass === 'rapid' }" v-on:click="updateResByOp('rapid')">Rapid</button>
      <button id="eotDaily" class="btn btn-primary slicer" :class="{ active: timeClass === 'daily' }" v-on:click="updateResByOp('daily')">Daily</button>
    </div>
  </div>
  </div>
</div>
</template>

<script>
import { graphResByOpp } from '@/scripts/graphResByOp.js';

export default {
  name: 'resByOpRating',
  // data() {
  //   return {
  //       eloChartInstance: null,
  //   };
  // },
  props: {
    timeClass: String,
  },
  methods : {
    updateResByOpp(timeClass) {
      this.$emit('update', timeClass)
      graphResByOpp(timeClass);
      // resetChartZoom(timeClass)
    },
  },

  mounted: function()  {
    console.debug("mounted resByOpRating")
    graphResByOpp(this.timeClass);
  }
}


</script>

<style scoped>
/* .eloOverTime {
max-width: 70%;
max-height: 50%;
} */
</style>