<template>
    <div class="container pt-3">
      {{ filteredData.length }} rows
    </div>
    <div class="table-responsive">
      <table v-if="filteredData.length" class="table">
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
              <!-- <li v-for="(option, optionIndex) in computedFilterOptions[option]" -->
              <li v-for="(option, optionIndex) in filterOptions[key] || []"
              class="dropdown-item"
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
  export default {
    name: 'ExploreGrid',
    props: {
      data: Array,
      columns: Array,
      filterKey: String,
      filterColumn: String,
    },
    data() {
      return {
        sortKey: '',
        sortOrders: this.columns.reduce((o, key) => ((o[key] = 1), o), {}),
        filterOptions: {
        "timeClass": ["rapid", "blitz", "bullet", "daily"],
        "result": ["win", "loss", "draw"],
        }, 
        selectedColumn: null,
        selectedOption: null,
      };
    },
    computed: {
      filteredData() {
        const sortKey = this.sortKey;
        const filterKey = this.filterKey && this.filterKey.toLowerCase();
        const order = this.sortOrders[sortKey] || 1;
        let data = this.data;

        const selectedColumn = this.selectedColumn;
        if (selectedColumn) {
          console.log("selectedColumn", selectedColumn)

          data = data.filter((row) => {
              return Object.keys(row).some((key) => {
                if (this.selectedColumn && key === this.selectedColumn) {
                  return String(row[key]) === this.selectedOption;
                } 
              });
          });


        }
  

        // Filter data
        if (filterKey) {
          data = data.filter((row) => {
              return Object.keys(row).some((key) => {
                if (this.filterColumn === 'all'){
                  return String(row[key]).toLowerCase().indexOf(filterKey) > -1;
                }
                if (key === this.filterColumn){
                  return String(row[key]).toLowerCase().indexOf(filterKey) > -1;
                }
              });
          });
        }

        // Sort data
        if (sortKey) {

          data = data.slice().sort((a, b) => {
            a = a[sortKey];
            b = b[sortKey];
            return (a === b ? 0 : a > b ? 1 : -1) * order;
          });
        }
        return data;
      },
    },
    methods: {
      sortBy(key) {
        console.log(key)
        this.sortKey = key;
        this.sortOrders[key] = this.sortOrders[key] * -1;
      },
      filterColumnBy(column, option) {
        this.selectedColumn = column;
        this.selectedOption = option;
      },
      capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
      },
      openGameUrl(url) {
        window.open(url, '_blank');
        
      },
    },
  };
  </script>


<style scoped>
  .active, .SearchRow {
    --active-color: #e9edcc;
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

    thead {
        color: #cfd9e6 !important;
        background-color: #272522 !important;
    }

    th {
        color: #cfd9e6 !important;
        background-color: #272522 !important;
        user-select: none;
    }

    td {

        color: #cfd9e6 !important;
        /* background-color: #272522 !important; */
        background-color: #272522; 
    }
    table tr {
    /* border-bottom: solid 1px #312e2b; */
    border-bottom: 2px solid #312e2b;
    }
    /* prevent changing tool tips */
    .table-hover-row {
    cursor: pointer;
    }
    .table-hover-row * {
      cursor: pointer;
    }


    th,
    td {

        min-width: 120px;
        /* padding: 10px 20px; */
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
  color: var(--bs-dropdown-link-hover-color);
  background-color: var(--bs-dropdown-link-hover-bg);
}

    /* .column-filter-dropdown{
      background-color: black;
      color: #fff;
    } */
</style>