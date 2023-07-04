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

            <button class="btn btn-primary slicer" 
            :class="{ active: timeClass === 'all'}" 
            @click="updateOpenings('all')">
            All
            </button>
            <button class="btn btn-primary slicer" 
            :class="{ active: timeClass === 'bullet'}" 
            @click="updateOpenings('bullet')">
            Bullet 
            </button>
            <button class="btn btn-primary slicer" 
            :class="{ active: timeClass === 'blitz' }"  
            @click="updateOpenings('blitz')">
            Blitz
            </button>
            <button class="btn btn-primary slicer" 
            :class="{ active: timeClass === 'rapid' }" 
            @click="updateOpenings('rapid')">
            Rapid
            </button>
            <button class="btn btn-primary slicer" 
            :class="{ active: timeClass === 'daily' }" 
            @click="updateOpenings('daily')">
            Daily
            </button>


            <button 
			class="btn btn-primary slicer" 
			data-bs-toggle="tooltip" 
			data-bs-placement="top" 
			title="Toggle between white and black openings"
			:class="color"
			id="openingsColorBtn"
            @click="updateColor()">
            {{ color === "all" ? "W/B" : color.charAt(0).toUpperCase() + color.slice(1) }}
            </button>
        </div>
    </div>
    </div>
</template>

<style>

/* small screen */

#openingsContainer{
        padding-left: 0 ;
        padding-right: 0 ;
    }
#openingsColorBtn {
	margin-left: 15px;
	padding: 5px 5px;
	box-shadow: none;
}

#openingsColorBtn.black {
	color: white;
	background-color: #565352;
	border-color: #565352;
}

#openingsColorBtn.white {
	color: #565352;
	background-color: #e9edcc;
	border-color: #e9edcc;

}
</style>


<script>
import { makeOpeningsChart } from '~/utils/chartOpenings.js';

export default {
    name: "OpeningChart",
	data() {
		return {
			timeClass: "all",
			color: "all",
		}
    },
    methods: {
        updateOpenings(newTimeClass) {


            this.$emit('update-time-class', newTimeClass);

			this.timeClass = newTimeClass;
            let filters = {
                timeClass: this.timeClass,
                color: this.color,
            }
            makeOpeningsChart(filters);
        },
        updateColor(){

            let newColor = "";
            if (this.color === "white") {
                newColor = "black";
            } else if (this.color === "black") {
                newColor = "all";
            } else {
                newColor = "white";
            }
            this.color = newColor;
            this.$emit('update-color', newColor);
            let filters = {
                timeClass: this.timeClass,
                color: newColor,
            }
            makeOpeningsChart(filters);
        }

    },
        mounted: function() {
            let filters = {
                timeClass: this.timeClass,
                color: this.color,
            }
            makeOpeningsChart(filters);
        }
}

</script>


