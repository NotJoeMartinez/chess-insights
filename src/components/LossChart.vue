
<template>
    <div class="container chart" id="lossContainer" :timeClass="{lossTimeClass}">
        <div class="row lost-by">
            <div class="card lost-by">
                <div class="card-body">
                    <div class="card-text">

                    </div>
                    <div class="card-title">
                        <h2> Games You lost By</h2>
                    </div>

                    <canvas id="gamesLostBy"> </canvas>

                    <button class="btn btn-primary slicer" :class="{ active: timeClass === 'all' }" v-on:click="updateLoss('all')">ALL</button>
                    <button class="btn btn-primary slicer" :class="{ active: timeClass === 'bullet' }" v-on:click="updateLoss('bullet')">BULLET</button>
                    <button class="btn btn-primary slicer" :class="{ active: timeClass === 'blitz' }" v-on:click="updateLoss('blitz')">BLITZ</button>
                    <button class="btn btn-primary slicer" :class="{ active: timeClass === 'rapid' }" v-on:click="updateLoss('rapid')">RAPID</button>
                    <button class="btn btn-primary slicer" :class="{ active: timeClass === 'daily' }" v-on:click="updateLoss('daily')">DAILY</button>

                </div>
            </div>
        </div>
    </div>
    
</template>

<script>
import { graphWinLoss } from '../scripts/graphWinLoss.js'
export default {
    name: "LossChart",
    props: {
        timeClass: String,
    },
    methods: {
        updateLoss(newTimeClass) {
            this.$emit('updateLoss', newTimeClass);
            graphWinLoss("loss", newTimeClass);
        }

        },
    mounted: function() {
        graphWinLoss("loss",this.timeClass)
    }
}
</script>