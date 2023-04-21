<template>
  <NavBar />
  <div v-if="showSpinner" class="container">
    <div class="spinner-border">
    </div>
  </div>
  <div class="container explorePage">
    <form id="search">
      Search <input name="query" v-model="searchQuery">
    </form>
    <ExploreGrid :data="gridData" :columns="gridColumns" :filter-key="searchQuery">
    </ExploreGrid>
  </div>
</template>

<script>
  import NavBar from '@/components/NavBar.vue';
  import ExploreGrid from '@/components/Explore/ExploreGrid.vue';

  import {
    exploreAll,
    exploreFromAPI
  } from '@/scripts/exploreUtils.js';
  import {
    getUserName
  } from '@/scripts/utils.js';

  export default {
    name: 'ExplorePage',
    components: {
      ExploreGrid,
      NavBar,
    },
    // props: {
    //   searchQuery: String,
    //   gridColumns: Array,
    //   gridData: Array,
    // },
    data() {
      return {
        showSpinner: false,
        searchQuery: '',
        gridColumns: ['timeClass', 'opponent', 'result', 'rating', 'date'],
        gridData: []

      }
    },
    methods:{
      async fetchData(){
        let userName = window.localStorage.getItem("userName")
        this.showSpinner = true;
        await exploreFromAPI(userName)
        this.showSpinner = false
        this.gridData = exploreAll()
      }

    },
    mounted: function () {



      if (window.localStorage.getItem("parsedArchiveGames") != null) {
        console.log("we have enough space")
        this.gridData = exploreAll()
      } else {
        console.log("we don't have enough space")
        this.fetchData()

      }
    }
  }
</script>


<style>
  .explorePage {
    max-width: 60%;
  }

  @media (max-width: 575.98px) {
    .explorePage {
      max-width: 100%;
    }
  }
</style>