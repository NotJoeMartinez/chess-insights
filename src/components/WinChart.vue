
<template>
    <div class="container" id="wonContainer" :timeClass="{winTimeClass}">
        <div class="row won-by">
            <div class="card won-by">
                <div class="card-body">
                    <div class="card-text"></div>
                    <div class="card-title">
                        <h2> Games You Won By</h2>
                    </div>
                    <canvas id="gamesWonBy"> </canvas>

                    <button class="btn btn-primary slicer" :class="{ active: timeClass === 'all' }" v-on:click="updateWin('all')">ALL</button>
                    <button class="btn btn-primary slicer" :class="{ active: timeClass === 'bullet' }" v-on:click="updateWin('bullet')">BULLET</button>
                    <button class="btn btn-primary slicer" :class="{ active: timeClass === 'blitz' }" v-on:click="updateWin('blitz')">BLITZ</button>
                    <button class="btn btn-primary slicer" :class="{ active: timeClass === 'rapid' }" v-on:click="updateWin('rapid')">RAPID</button>
                    <button class="btn btn-primary slicer" :class="{ active: timeClass === 'daily' }" v-on:click="updateWin('daily')">DAILY</button>
                </div>
            </div>
        </div>
    </div>
    
</template>

<script>
import { graphWinLoss } from '../scripts/graphWinLoss.js' 

export default {
    name: "WinChart",
    props: {
        timeClass: String,
    },
    methods: {
        updateWin(newTimeClass) {
            this.$emit('updateWin', newTimeClass);
            graphWinLoss("win", newTimeClass);
        }

        },
    mounted: function() {
        graphWinLoss("win",this.timeClass)
    }
}
</script>