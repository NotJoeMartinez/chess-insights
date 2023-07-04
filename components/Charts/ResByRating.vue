<template>
    <div class="div container chart pt-3 pb-3" id="resByOp">
  <div class="row" id="resByOpRow">
    <div class="card" id="resByOpCard">
    <h2 class="card-title  mt-2">
      <strong>
        Result By Opponent Rating
      </strong>
    </h2>
    <div class="card-body" id="resByOpCardBody">
      <canvas id="resByOppChart"></canvas> 

      <button class="btn btn-primary slicer" 
      :class="{active:timeClass === 'all'}" 
      @click="updateResByOpp('all')">
        All
      </button>

      <button class="btn btn-primary slicer" 
      :class="{ active: timeClass === 'bullet' }" 
      @click="updateResByOpp('bullet')">
      Bullet
      </button>

      <button class="btn btn-primary slicer" 
      :class="{ active: timeClass === 'blitz' }" 
      @click="updateResByOpp('blitz')">
        Blitz
      </button>

      <button class="btn btn-primary slicer" 
      :class="{ active: timeClass === 'rapid' }" 
      @click="updateResByOpp('rapid')">
        Rapid
      </button>

      <button class="btn btn-primary slicer" 
      :class="{ active: timeClass === 'daily' }" 
      @click="updateResByOpp('daily')">
        Daily
      </button>

    </div>
  </div>
  </div>
</div>
</template>

<script>
import { graphResByOpp } from '~/utils/chartResByOpp.js';

export default {
  name: "ResByRating",
  props: {
    timeClass: String,
  },

  mounted: function()  {
    graphResByOpp(this.timeClass);
  },

  methods : {
    updateResByOpp(newTimeClass) {
      this.$emit('updateResByOpp', newTimeClass)
      graphResByOpp(newTimeClass);
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
