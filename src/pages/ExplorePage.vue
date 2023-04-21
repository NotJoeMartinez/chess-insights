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
            gridData: [{
                    timeClass: 'rapid',
                    opponent: 'John',
                    result: 'win',
                    rating: 325,
                    date: '2021.06.25',
                },
                {
                    timeClass: 'bullet',
                    opponent: 'Jane',
                    result: 'checkmated',
                    rating: 542,
                    date: '2022.01.15',
                },
                {
                    timeClass: 'blitz',
                    opponent: 'Alice',
                    result: 'resigned',
                    rating: 715,
                    date: '2021.11.28',
                },
                {
                    timeClass: 'daily',
                    opponent: 'Bob',
                    result: 'win',
                    rating: 480,
                    date: '2021.04.10',
                },
            ]
        })

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