<template>
    <button type="button" id="exploreBtn" class="btn btn-primary" @click="onClickExploreButton">
      <font-awesome-icon :icon="['fas', 'magnifying-glass']" />
      Explore
    </button>
  </template>
  
  <script>
  import { useRouter } from 'vue-router';
  


export default {
  name: 'ExploreBtn',
  setup() {
    const router = useRouter();
    const openExplorePage = () => {
      const resolvedRoute = router.resolve({
        name: 'Explore',
      });
      window.open(resolvedRoute.href, '_blank');
    };
    const onClickExploreButton = () => {
      openExplorePage();
    };

    return {
      onClickExploreButton,
    };
  },
};


</script>


