<template>
  <NavBar />
  <div class="container explorePage pt-3">
    <div v-if="showSpinner" class="container">
      <div class="spinner-border">
      </div>
    </div>
    
    <div class="container search-form-container">
      <div class="input-group mb-3">
          <input type="text" 
          class="form-control search-form" 
          aria-label="Text input with dropdown button"
          autocapitalize="none" 
          autocorrect="off"
          v-model="searchQuery"
          >
          <button 
          id="searchColumnSelector"
          class="btn  dropdown-toggle" 
          type="button" 
          data-bs-toggle="dropdown" 
          aria-expanded="false"> {{ searchColumn }} </button>
          <ul class="dropdown-menu dropdown-menu-end">
            <!-- avoid listing current search column -->
            <li v-for="column in filteredColumns" 
            :key="column" 
            @click="editSearchColumn(column)"
            class="dropdown-item"> {{ column }} 
          </li>

          </ul>
      </div>
    </div>



    <div class="container pt-1"> 
      <ExploreGrid 
      :data="gridData" 
      :columns="gridColumns" 
      :filter-key="searchQuery" 
      :filterColumn="searchColumn"
      />
    </div>
  </div>
</template>

<script>
  import NavBar from '@/components/NavBar.vue';
  import ExploreGrid from '@/components/Explore/ExploreGrid.vue';

  import {
    exploreAll,
    exploreFromAPI
  } from '@/scripts/exploreUtils.js';
  export default {
    name: 'ExplorePage',
    components: {
      ExploreGrid,
      NavBar,
    },
    data() {
      return {
        showSpinner: false,
        searchQuery: '',
        searchColumn: 'opening',
        searchColumns: ['opening', 'opponent', 'result', 'rating', 'date', 'all'],
        gridColumns: ['timeClass', 'opponent', 'result', 'opening', 'rating', 'date'],
        gridData: [],

      }
    },
    computed: {
    filteredColumns: function() {
      return this.searchColumns.filter(column => column !== this.searchColumn);
      }
    },
    methods:{
      async fetchData(){
        let userName = window.localStorage.getItem("userName")
        this.showSpinner = true;
        await exploreFromAPI(userName)
        this.showSpinner = false
        this.gridData = exploreAll()
      },
      editSearchColumn(column){
        console.log(column)
        this.searchColumn = column
      }

    },
    mounted: function () {
      if (window.localStorage.getItem("archivedGames") != null) {
        console.log("we have enough space")
        this.gridData = exploreAll()
      } else {
        console.log("we don't have enough space")
        this.fetchData()
      }
    }
  }
</script>





<style >
.search-form-container{
  max-width: 75%;
}

#searchColumnSelector{
  background-color: #272522;
  color: #cfd9e6;
  font-weight: 300;
  border: none;
}
.table {
  background-color: #272522;
}

.search-form {
    font-size: 1.1rem !important;
    padding: 0.8rem 1rem !important;
    position: relative;
    background: rgba(0, 10, 25, 0.5);
    border: 1px solid rgba(0, 0, 0, 0.4);
    border-bottom-color: rgba(0, 0, 0, 0.5);
    box-shadow: 0 5px 12px -2px rgba(0, 0, 0, 0.3);
    font-weight: 300;
    color: #cfd9e6;
  }
  .search-form:hover {
      box-shadow: 0 10px 30px -2px rgba(0, 0, 0, 0.3);
      z-index: 0;
  }
  .search-form:focus {
      z-index: 0;
      background: rgba(0, 0, 0, 0.3);
      color: white;
  }
  .explorePage {
    max-width: 60%;
  }

  @media (max-width: 575.98px) {
    .explorePage {
      max-width: 100%;
    }
  }
</style>