
<template>
    <div class="container chart pt-3 pb-3" id="drawContainer">
        <div class="row draw-by">
            <div class="card draw-by">
                <div class="card-body">
                    <div class="card-text"></div>
                    <div class="card-title ">
                        <h2> 
                            <strong>
                                Games Drawn By
                            </strong>
                        </h2>
                    </div>
                    <div class="container pieChartContainer p-3">
                        <canvas id="gamesDrawnBy"> </canvas>
                    </div>
                    <button class="btn btn-primary slicer" :class="{ active: timeClass === 'all' }" v-on:click="updateDraw('all')">All</button>
                    <button class="btn btn-primary slicer" :class="{ active: timeClass === 'bullet' }" v-on:click="updateDraw('bullet')">Bullet</button>
                    <button class="btn btn-primary slicer" :class="{ active: timeClass === 'blitz' }" v-on:click="updateDraw('blitz')">Blitz</button>
                    <button class="btn btn-primary slicer" :class="{ active: timeClass === 'rapid' }" v-on:click="updateDraw('rapid')">Rapid</button>
                    <button class="btn btn-primary slicer" :class="{ active: timeClass === 'daily' }" v-on:click="updateDraw('daily')">Daily</button>
                </div>
            </div>
        </div>
    </div>
    
</template>

<script>
import { graphWinLoss } from '~/utils/chartWinLoss.js' 

export default {
    name: "DrawChart",
    props: {
        timeClass: String,
    },
    methods: {
        updateDraw(newTimeClass) {
            this.$emit('updateDraw', newTimeClass);
            graphWinLoss("draw", newTimeClass);
        }

        },
    mounted: function() {
        graphWinLoss("draw",this.timeClass)
    }
}
</script>