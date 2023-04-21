<template>
    <button type="button" id="exploreBtn" class="btn btn-primary" @click="onClickExploreButton">
      <font-awesome-icon :icon="['fas', 'magnifying-glass']" />
      Explore
    </button>
  </template>
  
  <script>
  import { useRouter } from 'vue-router';
  import { exploreAll  } from '@/scripts/exploreUtils.js';
  import { useStore } from 'vuex';
  


export default {
  name: 'ExploreBtn',
  setup() {
    const router = useRouter();
    const store = useStore();

    const openExplorePage = () => {
      const resolvedRoute = router.resolve({
        name: 'Explore',
      });
      window.open(resolvedRoute.href, '_blank');
    };
    const onClickExploreButton = () => {
      let data = exploreAll();
      store.dispatch('updateExploreData', data);
      openExplorePage();
    };

    return {
      onClickExploreButton,
    };
  },
};

  // export default {
  //   name: 'ExploreBtn',
  //   setup() {
  //     const router = useRouter();
  //     const store = useStore();
  
  //     const openExplorePage = () => {
  //       const resolvedRoute = router.resolve({
  //         name: 'Explore',
  //       });
  //       window.open(resolvedRoute.href, '_blank');
  //     };
  //     const onClickExploreButton = () => {
  //       let data = exploreAll();
  //       store.commit('setExploreData', data[0]);

  //       openExplorePage();
  //     };
  
  //     return {
  //       onClickExploreButton,
  //     };
  //   },
  // };
</script>


