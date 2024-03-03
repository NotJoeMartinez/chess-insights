<template>
  <div>
  <NavBar />
  <div class="container explorePage pt-3">
    <div v-if="showSpinner" class="container">
      <h1>Loading games..</h1>
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
            class="dropdown-item"
            > 
            {{ column }} 
          </li>

          </ul>
      </div>
    </div>

    <div class="container">
      <ButtonsExportExploreBtn />
    </div>

    <div class="container pt-1"> 
      <ExploreTable
      :data="gridData" 
      :columns="gridColumns" 
      :filter-key="searchQuery" 
      :filterColumn="searchColumn"
      :opening="openingFilter"
      />
    </div>
  </div>
</div>
</template>

<script>
  import { getOpeningsForExplore } from '~/utils/openingsUtils.js';
  import { getArchivedGames } from '~/utils/archiveUtils.js';
  import {
    exploreAll,
    exploreFromAPI,
  } from '~/utils/exploreUtils.js';

  export default {
    name: 'ExplorePage',
    data() {
      return {
        showSpinner: false,
        searchQuery: '',
        searchColumn: 'opening',
        searchColumns: ['opening', 'opponent', 'result', 'rating', 'date', 'all'],

        gridColumns: ['date', 'timeClass', 'color', 'result',
                      'rating', 'moves', 'accuracy', 'outcome', 
                      'opening', 'opponent', 'gameUrl'],
        openingFilter: [],
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
        console.log("fetching data for " + userName)
        this.showSpinner = true;

        await exploreFromAPI(userName)
        this.showSpinner = false
        let games = getArchivedGames();
        this.gridData = exploreAll(games)
      },
      editSearchColumn(column){
        this.searchColumn = column
      },
      showLoadSpinner() {
        this.showSpinner = true
      }

    },
    mounted: async function () {

      let games = JSON.parse(window.localStorage.getItem("archivedGames"))
      if (games !== null) {
        console.log("we have enough space")
        this.gridData = exploreAll(games);
        this.openingFilter = getOpeningsForExplore(games);
      } else {
        console.log("we don't have enough space")
        await this.fetchData();
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
    max-width: 80%;
  }

  @media (max-width: 575.98px) {
    .explorePage {
      max-width: 100%;
    }
  }
</style>