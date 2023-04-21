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
            gridColumns: ['name', 'power'],
            gridData: [{
                    name: 'Chuck Norris',
                    power: Infinity
                },
                {
                    name: 'Bruce Lee',
                    power: 9000
                },
                {
                    name: 'Jackie Chan',
                    power: 7000
                },
                {
                    name: 'Jet Li',
                    power: 8000
                }
            ]
        })

    }
</script>