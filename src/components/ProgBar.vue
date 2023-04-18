<template>
    <div v-if="progress < 100" id="progress-div" class="container">
      <h3 id="gamesFound">{{ gamesFound }} Games Found</h3><br>
      <div class="progress">
        <div id="progBar"
          class="progress-bar"
          role="progressbar"
          aria-label="Example with label"
          :style="{ width: progress + '%' }"
          :aria-valuenow="progress"
          aria-valuemin="0"
          aria-valuemax="100">
          {{ progress }}%
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'progBar',
    props: {
      progress: Number,
      gamesFound: Number
    }
  }
  </script>
  