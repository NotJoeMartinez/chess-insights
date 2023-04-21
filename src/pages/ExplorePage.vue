<!-- <template>
    <NavBar />

    <div class="container explorePage">
        <form id="search">
            Search <input name="query" v-model="searchQuery">
        </form>
        <ExploreGrid :data="gridData" :columns="gridColumns" :filter-key="searchQuery">
        </ExploreGrid>
    </div>

</template>

<script>
    import NavBar from "@/components/NavBar.vue";
    import ExploreGrid from '@/components/Explore/ExploreGrid.vue'

    export default {
        name: 'ExplorePage',
        components: {
            ExploreGrid,
            NavBar
        },
        data: () => ({
            searchQuery: '',
            gridColumns: ['timeClass', 'opponent', 'result', 'rating', 'date'],
            gridData: []);

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
</style> -->


<template>
    <NavBar />
  
    <div class="container explorePage">
      <form id="search">
        Search <input name="query" v-model="searchQuery">
      </form>
      <ExploreGrid :data="gridData" :columns="gridColumns" :filter-key="searchQuery">
      </ExploreGrid>
    </div>
  </template>
  
  <script>
import { computed } from 'vue';
import { useStore } from 'vuex';
import NavBar from '@/components/NavBar.vue';
import ExploreGrid from '@/components/Explore/ExploreGrid.vue';

export default {
  name: 'ExplorePage',
  components: {
    ExploreGrid,
    NavBar,
  },
  setup() {
    const store = useStore();
    const searchQuery = '';
    const gridColumns = ['timeClass', 'opponent', 'result', 'rating', 'date'];
    const gridData = computed(() => store.state.exploreData);



    return {
      searchQuery,
      gridColumns,
      gridData,
    };
  },
};
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