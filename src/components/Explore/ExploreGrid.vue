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
              @click="sortBy(key)"
              :class="{ active: sortKey == key }"
            >
              {{ capitalize(key) }}
              <span class="arrow" :class="sortOrders[key] > 0 ? 'asc' : 'dsc'"></span>
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
      };
    },
    computed: {
      filteredData() {
        const sortKey = this.sortKey;
        const filterKey = this.filterKey && this.filterKey.toLowerCase();
        const order = this.sortOrders[sortKey] || 1;
        let data = this.data;
  
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
      capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
      },
      openGameUrl(url) {
        window.open(url, '_blank');
        
      },
    },
  };
  </script>


<style>
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
        background-color: #272522 !important;
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
        padding: 10px 20px;
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
</style>