<template>

    <button type="button" id="exploreBtn" class="btn btn-primary" @click="openExplorePage">
        <font-awesome-icon :icon="['fas', 'magnifying-glass']" />
        Explore 
    </button>

</template>

<script>
    import {
        useRouter
    } from 'vue-router';
    export default {
        name: 'ExploreBtn',
        setup() {
            const router = useRouter();

            const openExplorePage = () => {
                // Replace 'ExampleRoute' with the name of the route you want to navigate to
                const resolvedRoute = router.resolve({
                    name: 'Explore'
                });
                window.open(resolvedRoute.href, '_blank');
            };
            return {
                openExplorePage,
            };
        },

    }
</script>
