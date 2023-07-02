<template>
    <div class="container pt-4 pb-4">

      <h4>
        <strong> {{ filteredData.length }}  </strong> Games Found 
      </h4>

    </div>
    <div class="table-responsive">
      <table v-if="filteredData.length" class="table" id="exploreTable">
        <thead>
          <tr>
            <th
              v-for="(key, index) in columns"
              :key="'header-' + index"
              :class="{ active: filterColumn === key }" 
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
            <li><hr class="dropdown-divider"></li>
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
              :class="{ 'SearchRow': filterColumn === key }" 

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

// import * as bootstrap from 'bootstrap'
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
         "color": [],
         "opening": [], 
       },
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
        "color": ["white", "black"],
        "opening": this.opening
      }
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


</style>