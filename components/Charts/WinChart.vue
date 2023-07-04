
<template>
    <div class="container chart pt-3 pb-3" id="wonContainer">
        <div class="row won-by">
            <div class="card won-by">
                <div class="card-body">
                    <div class="card-text"></div>
                    <div class="card-title ">
                        <h2> 
                            <strong>
                                Games Won By
                            </strong>
                        </h2>
                    </div>
                    <div class="container pieChartContainer p-3">
                        <canvas id="gamesWonBy"> </canvas>
                    </div>

                    <button class="btn btn-primary slicer" :class="{ active: timeClass === 'all' }" v-on:click="updateWin('all')">All</button>
                    <button class="btn btn-primary slicer" :class="{ active: timeClass === 'bullet' }" v-on:click="updateWin('bullet')">Bullet</button>
                    <button class="btn btn-primary slicer" :class="{ active: timeClass === 'blitz' }" v-on:click="updateWin('blitz')">Blitz</button>
                    <button class="btn btn-primary slicer" :class="{ active: timeClass === 'rapid' }" v-on:click="updateWin('rapid')">Rapid</button>
                    <button class="btn btn-primary slicer" :class="{ active: timeClass === 'daily' }" v-on:click="updateWin('daily')">Daily</button>
                </div>
            </div>
        </div>
    </div>
    
</template>

<script>
import { graphWinLoss } from '~/utils/chartWinLoss.js' 

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