<template>
    <div class="container pt-4 pb-4">

      <h4>
        <strong> {{ filteredData.length }}  </strong> Games Found 
      </h4>

      <!-- conditionally show and hide spinner -->

      <div v-if="applySpinner" class="container">
        <div class="spinner-border">
        </div>
      </div>

    </div>

    <!-- explore table filter options -->
    <div v-if="filteredData.length" class="container" id="exploreTableOptions">
      <div class="row">
        <div class="col-md-4">
          <span class="input-group-text">ELO Range:</span>
        </div>

        <div class="col-md-8">
          <div class="input-group mb-3">

            <input type="text" class="form-control"  
            id="minEloInput"
            v-bind="{value: eloRange[0]}">

            <input type="text" class="form-control" 
            id="maxEloInput"
            v-bind="{value: eloRange[1]}">

            <button class="btn btn-outline-secondary exploreApplyBtn" 
            type="button" 
            id="applyEloRangeBtn"
            @click="setEloRange">

            Apply
          </button>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-4">
            <span class="input-group-text">Accuracy Range:</span>
        </div>
        <div class="col-md-8">
          <div class="input-group mb-3">

            <input type="text" class="form-control" 
            id="minAccuracyInput"
            v-bind="{value: accuracyRange[0]}">

            <input type="text" class="form-control" 
            id="maxAccuracyInput" 
            v-bind="{value: accuracyRange[1]}">

            <button class="btn btn-outline-secondary exploreApplyBtn" 
            type="button" 
            id="applyAccuracyRangeBtn"
            @click="setAccuracyRange">

            Apply
            </button>
          </div>
                    
        </div>
      </div>
      <div class="row">
        <div class="col-md-4">
            <span class="input-group-text">Date Range:</span>
        </div>
        <div class="col-md-8">
          <div class="input-group mb-3">
            <input type="date" class="form-control" 
            id="minDateInput"
            v-bind="{value: dateRange[0]}">

            <input type="date" class="form-control" 
            id="maxDateInput" 
            v-bind="{value: dateRange[1]}">

            <button class="btn btn-outline-secondary exploreApplyBtn" 
            type="button" 
            id="applyDateRangeBtn"
            @click="setDateRange">
            Apply
            </button>
          </div>
                    
        </div>
      </div>

      <div class="row">
        <div class="col-md-4">
          <span class="input-group-text">Move Count:</span>
        </div>
        <div class="col-md-8">
          <div class="input-group mb-3">
            <input type="text" class="form-control" 
            id="minMoveInput"
            v-bind="{value: moveRange[0]}">

            <input type="text" class="form-control" 
            id="maxMoveInput" 
            v-bind="{value: moveRange[1]}">

            <button class="btn btn-outline-secondary exploreApplyBtn" 
            type="button" 
            id="applyMoveRangeBtn"
            @click="setMoveRange">
            Apply
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- actual table -->
    <div class="table-responsive">

      <table v-if="filteredData.length" class="table table-hover" id="exploreTable">
        <thead>
          <tr>
            <th
              v-for="(key, index) in columns"
              :key="'header-' + index"
              :class="{ active: filterColumn === key }" 
              v-show="key !== 'gameUrl'"
            >

            <button
              class="btn dropdown-toggle column-filter-selector" 
              data-bs-toggle="dropdown"
              >
              {{ capitalize(key) }} 
            </button> 

            <ul class="dropdown-menu dropdown-menu-end ">
              <li v-for="(option, optionIndex) in filterOptions[key] || []"

              class="dropdown-item"
              :class="{ active: activeFilters[key].includes(option) }"
              :key="'option-' + optionIndex"
              @click="filterColumnBy(key, option)"
              >

                {{ option }}

              </li>
              
              <li>
                <hr class="dropdown-divider">
              </li>

              <li class="dropdown-item" @click="sortBy(key)">
                Sort Ascending
              </li>

            </ul>
              
            </th>

          </tr>
        </thead>
        <tbody>
          <tr v-for="(entry, rowIndex) in filteredData" 
            :key="'row-' + rowIndex"
            @click="openGameUrl(entry.gameUrl)"
            class="table-hover-row"
            >
            <td
              v-for="(key, colIndex) in columns"
              :key="'cell-' + rowIndex + '-' + colIndex"
              :class="{'SearchRow': filterColumn === key }" 
              v-bind="{ class: (key === 'result') ?  entry[key] : ''}"
              v-show="key !== 'gameUrl'"
            >
              {{ entry[key] }}
            </td>
          </tr>
        </tbody>
      </table>
  
      <p v-else>No matches found.</p>
    </div>
  </template>

 <script>

 export default {
   name: 'ExploreTable',
   props: {
     data: Array,
     opening: Array,
     columns: Array,
     filterKey: String,
     filterColumn: String,
   },
   data() {
     return {
       sortKey: '',
       sortOrders: this.columns.reduce((o, key) => ((o[key] = 1), o), {}),
       activeFilters: {
         "timeClass": [],
         "result": [],
         "outcome": [],
         "color": [],
         "opening": [], 
       },
       applySpinner: false,
     };
   },
   computed: {
    filteredData() {
       let data = this.data;
       // Apply all active filters
       Object.keys(this.activeFilters).forEach((filterKey) => {
         const filterValues = this.activeFilters[filterKey];
         if (filterValues.length > 0) {
            data = data.filter((row) => filterValues.includes(row[filterKey]));
         }
       });
 
       // Filter data
       if (this.filterKey) {
         const filterText = this.filterKey.toLowerCase();
         data = data.filter((row) => {
           return Object.keys(row).some((key) => {
             if (this.filterColumn === 'all'){
               return String(row[key]).toLowerCase().includes(filterText);
             }
             if (key === this.filterColumn){
               return String(row[key]).toLowerCase().includes(filterText);
             }
           });
         });
       }
 
       // Sort data
       if (this.sortKey) {
         const order = this.sortOrders[this.sortKey] || 1;
         data = data.slice().sort((a, b) => {
           a = a[this.sortKey];
           b = b[this.sortKey];
           return (a === b ? 0 : a > b ? 1 : -1) * order;
         });
       }
       return data;
    },
    filterOptions() {
      return {
        "timeClass": ["rapid", "blitz", "bullet", "daily"],
        "result": ["win", "loss", "draw"],
        "outcome": ["checkmated", "resigned", "timeout", "stalemate", "insufficient", 
                    "agreed",  "abandoned", "timevsinsufficient"],
        "color": ["white", "black"],
        "opening": this.opening
        }
    }, 
    eloRange() {
        let data = this.data;

        let min = data[0].rating;
        let max = data[0].rating;

        for (let i = 0; i < this.data.length; i++) {
          if (this.data[i].rating < min) {
            min = this.data[i].rating;
          }
          if (this.data[i].rating> max) {
            max = this.data[i].rating;
          }
        }

        return [min, max];
    },
    dateRange() {
      let data = this.data;
      let minDateStr = data[0].date.replace(/\./g, '-');
      let maxDateStr = data[0].date.replace(/\./g, '-');

      let minDate = new Date(minDateStr);
      let maxDate = new Date(maxDateStr);

      for (let i = 0; i < data.length; i++) {
        let currentDate = new Date(data[i].date.replace(/\./g, '-'));
        if (currentDate < minDate) {
          minDate = new Date(data[i].date.replace(/\./g, '-'));
        }
        if (currentDate > maxDate) {
          maxDate = new Date(data[i].date.replace(/\./g, '-'));
        }
      }

      // YYYY-MM-DD
      minDateStr = minDate.toISOString().split('T')[0];
      maxDateStr = maxDate.toISOString().split('T')[0];

      return [minDateStr, maxDateStr];
    },
    accuracyRange() {
      let data = this.data;
      let min = data[0].accuracy;
      let max = data[0].accuracy;

      for (let i = 0; i < data.length; i++) {
        let currentAccuracy = data[i].accuracy;

        // check if empty string 
        if (currentAccuracy === "") {
          continue;
        }
   

        if (currentAccuracy < min) {
          min = currentAccuracy;
        }
        if (currentAccuracy > max) {
          max = currentAccuracy;
        }
      }
      return [min, max];
    },
    moveRange() {
      let data = this.data;
      let min = data[0].moves;
      let max = data[0].moves;

      for (let i = 0; i < data.length; i++) {
        let currentMoves = data[i].moves;

        if (currentMoves < min) {
          min = currentMoves;
        }
        if (currentMoves > max) {
          max = currentMoves;
        }
      }
      return [min, max];
    }
    

   },
   methods: {
     sortBy(key) {
       this.sortKey = key;
       this.sortOrders[key] = this.sortOrders[key] * -1;
     },
     filterColumnBy(column, option) {


       const activeFilters = this.activeFilters[column];
       const index = activeFilters.indexOf(option);
 
       if (index >= 0) {
         activeFilters.splice(index, 1); // Remove filter
       } else {
         activeFilters.push(option); // Add filter
       }
     },
     capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
     },
     openGameUrl(url) {
      window.open(url, '_blank');
     },
     filterEloByRange(min, max) {
      for (let i = 0; i < this.data.length; i++) {
        if (this.data[i].rating < min || this.data[i].rating > max) {
          this.data.splice(i, 1);
          i--;
        }
      }
        
     }, 
     async filterByAccuracyRange(min, max) {
        for (let i = 0; i < this.data.length; i++) {
          let currentAccuracy = this.data[i].accuracy;
          if (currentAccuracy < min || currentAccuracy > max) {
            this.data.splice(i, 1);
            i--;
          }
        }
     },
     filterByDateRange(min, max) {
      for (let i = 0; i < this.data.length; i++) {
        let currentDate = new Date(this.data[i].date.replace(/\./g, '-'));
        if (currentDate < min || currentDate > max) {
          this.data.splice(i, 1);
          i--;
        }
      }

     },
     setEloRange() {
       let minInput = document.querySelector("#minEloInput").value; 
       let maxInput = document.querySelector("#maxEloInput").value; 
       this.filterEloByRange(minInput, maxInput);
     },
     setDateRange() {
       let minDateStr = document.querySelector("#minDateInput").value; 
       let maxDateStr = document.querySelector("#maxDateInput").value;
       
       let minDate = new Date(minDateStr.replace(/\./g, '-'));
       let maxDate = new Date(maxDateStr.replace(/\./g, '-'));

       this.filterByDateRange(minDate, maxDate);
     },
     async filterByMoveRange(min, max) {
       for (let i = 0; i < this.data.length; i++) {
         let currentMoves = this.data[i].moves;
         if (currentMoves < min || currentMoves > max) {
           this.data.splice(i, 1);
           i--;
         }
       }
     },
     async setAccuracyRange() {
       let minInput = document.querySelector("#minAccuracyInput").value; 
       let maxInput = document.querySelector("#maxAccuracyInput").value; 
       
       this.applySpinner = true;
       await this.filterByAccuracyRange(minInput, maxInput);
       this.applySpinner = false;

     },
     async setMoveRange() {
       let minInput = document.querySelector("#minMoveInput").value; 
       let maxInput = document.querySelector("#maxMoveInput").value; 
       this.filterByMoveRange(minInput, maxInput);
     }
     
    } 
  }
 </script> 


<style scoped>
.win {
  color: #779556 !important;
}
.loss {
  color: #d9534f !important;
}


.table-responsive {
  box-shadow: 0px 0px 20px 0px rgba(0,0,0,0.75);
  border-radius: 10px;
}

.active, .SearchRow {
    --active-color: #81b64c;
    --active-width: 1px;
}
  
td.SearchRow {
    border-color: var(--active-color) !important;
    border-width: var(--active-width) !important;
    border-top: none;
    border-bottom: none;
}
th.active {
  border-top: none;
  border-left: none;
  border-right: none;
  border-width: 2px !important;
  border-color: var(--active-color) !important;
}

th {
    color: #ebecd0 !important;
    background-color: #0c131c!important;
    user-select: none;
    padding-right: 0.1rem;
    padding-left: 0.1rem;
}
.column-filter-selector {
  font-weight: bold;
}

td {
  color: #FFF !important;
  font-size: 16px;
  font-weight: 500;
  background-color: #272522; 
}
table tr {
  border-bottom: 2px solid #312e2b;
}

/* change row background color to #ebecd0 on hover */
table tr:hover {
  background-color: #1f1e1b; 
}

table tr:nth-child(even) {
  background-color: #ebecd0 !important; 
}
.table-hover-row {
cursor: pointer;
}
.table-hover-row * {
  cursor: pointer;
}

th.active .arrow {
    opacity: 1;
}

.arrow {
    display: inline-block;
    vertical-align: middle;
    width: 0;
    height: 0;
    margin-left: 5px;
    opacity: 0.66;
}

.arrow.asc {
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-bottom: 4px solid #fff;
}

.arrow.dsc {
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 4px solid #fff;
}
table tr:hover {
    background-color: #1f1e1b; 
}

.column-filter-selector {
  color: #fff;
}
.dropdown-item:hover, .dropdown-item:focus {
color: #fff;
background-color: #272522; 
}

.dropdown-item.active{
color: #fff;
background-color: #272522; 
}

.exploreApplyBtn {
  color: #fff;

}

@keyframes glow {
        0%, 100% {
            box-shadow: 0 0 8px #ebecd0, 0 0 12px #ebecd0, 0 0 20px #ebecd0;
        }
        50% {
            box-shadow: 0 0 15px #ebecd0, 0 0 20px #ebecd0, 0 0 25px #ebecd0;
        }
}

.exploreApplyBtn:active {
  animation: glow 1.5s infinite alternate; 
}

#exploreTableOptions {
  background-color: #272522; 
  border-radius: 10px;
  max-width: 60%;
  height: 200px;
  margin-bottom: 20px;
  padding: 10px;
}



</style>