<template>
    <div class="container" id="openingsContainer">
        <div class="card" id="openingsCard">
        <h2 id="openingsTitle" class="card-title">
        Top openings: <b>{{ timeClass }}</b> 
        </h2>
        <p class="card-text">Click to view the chess.com wiki of the opening</p>
        
        <div class="card-body">

            <canvas id="openings"></canvas> 

            <button class="btn btn-primary slicer" :class="{active:timeClass === 'all'}" v-on:click="updateOpenings('all')">
            ALL
            </button>
            <button class="btn btn-primary slicer" :class="{ active: timeClass === 'bullet'}" v-on:click="updateOpenings('bullet')">
            BULLET
            </button>
            <button class="btn btn-primary slicer" :class="{ active: timeClass === 'blitz' }"  v-on:click="updateOpenings('blitz')">
            BLITZ
            </button>
            <button class="btn btn-primary slicer" :class="{ active: timeClass === 'rapid' }" v-on:click="updateOpenings('rapid')">
            RAPID
            </button>
            <button class="btn btn-primary slicer" :class="{ active: timeClass === 'daily' }" v-on:click="updateOpenings('daily')">
            DAILY
            </button>
        </div>
    </div>
    </div>
</template>


<script>

import { graphOpenings } from '../scripts/graphOpenings.js';

export default {
    name: "OpeningGraph",
    props: {
        timeClass: String,
    },

    methods: {
        updateOpenings(newTimeClass) {
            this.$emit('update-time-class', newTimeClass);
            graphOpenings(newTimeClass);
        },
    },
        mounted: function() {
            graphOpenings(this.timeClass);
        }
}

</script>

<style scoped>
#openingsContainer {
    max-width: 70%;
    max-height: 50%;
}
</style>