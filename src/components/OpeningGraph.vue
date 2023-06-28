<template>
    <div class="container chart pt-3 pb-3" id="openingsContainer">
        <div class="card" id="openingsCard">
        <h2 id="openingsTitle" class="card-title mt-2">
            <strong>
                Top Openings 
            </strong>
        </h2>
        <p class="card-text">Click to view the chess.com wiki of the opening</p>
        
        <div class="card-body">

            <canvas id="openings"></canvas> 

            <button class="btn btn-primary slicer" :class="{active:timeClass === 'all'}" v-on:click="updateOpenings('all')">
            All
            </button>
            <button class="btn btn-primary slicer" :class="{ active: timeClass === 'bullet'}" v-on:click="updateOpenings('bullet')">
            Bullet 
            </button>
            <button class="btn btn-primary slicer" :class="{ active: timeClass === 'blitz' }"  v-on:click="updateOpenings('blitz')">
            Blitz
            </button>
            <button class="btn btn-primary slicer" :class="{ active: timeClass === 'rapid' }" v-on:click="updateOpenings('rapid')">
            Rapid
            </button>
            <button class="btn btn-primary slicer" :class="{ active: timeClass === 'daily' }" v-on:click="updateOpenings('daily')">
            Daily
            </button>
        </div>
    </div>
    </div>
</template>


<script>
import { graphOpenings } from '@/scripts/graphOpenings.js';

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

