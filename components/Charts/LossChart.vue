
<template>
    <div class="container chart pt-3 pb-3 " id="lossContainer">
        <div class="row lost-by">
            <div class="card lost-by">
                <div class="card-body">
                    <div class="card-text">

                    </div>
                    <div class="card-title">
                        <h2> 
                            <strong>
                            Games Lost By
                            </strong>
                        </h2>
                    </div>

                    <div class="container pieChartContainer p-3">

                        <canvas id="gamesLostBy"> </canvas>
                    </div>

                    <button class="btn btn-primary slicer" :class="{ active: timeClass === 'all' }" v-on:click="updateLoss('all')">All</button>
                    <button class="btn btn-primary slicer" :class="{ active: timeClass === 'bullet' }" v-on:click="updateLoss('bullet')">Bullet</button>
                    <button class="btn btn-primary slicer" :class="{ active: timeClass === 'blitz' }" v-on:click="updateLoss('blitz')">Blitz</button>
                    <button class="btn btn-primary slicer" :class="{ active: timeClass === 'rapid' }" v-on:click="updateLoss('rapid')">Rapid</button>
                    <button class="btn btn-primary slicer" :class="{ active: timeClass === 'daily' }" v-on:click="updateLoss('daily')">Daily</button>

                </div>
            </div>
        </div>
    </div>
    
</template>

<script>
import { graphWinLoss } from '~/utils/chartWinLoss.js'

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
