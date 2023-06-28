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
      <canvas id="resByOppChart"></canvas> 
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
import { graphResByOpp } from '@/scripts/graphResByOpp.js';

export default {
  props: {
    timeClass: String,
  },

  mounted: function()  {
    graphResByOpp(this.timeClass);
  },

  methods : {
    updateResByOpp(timeClass) {
      this.$emit('update', timeClass)
      graphResByOpp(timeClass);
    },
    graphTestUser() {
      fetch('/testData/test_user.csv')
      .then(response => {

      if (!response.ok) {
        throw new Error("HTTP error " + response.status);
      }
      return response.text();
    })
    .then(csv => {
      Papa.parse(csv, {
        header: true,
        complete: (results) => {
          this.csvData = results.data;
          graphResByOpp(this.timeClass, this.csvData);
        }
      });
    }).catch(error => {
      console.log(error); });
    }
  }
}


</script>

<style scoped>
/* .eloOverTime {
max-width: 70%;
max-height: 50%;
} */
</style>