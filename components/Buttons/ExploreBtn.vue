<template>
  <nuxt-link to="/explore">
    <button type="button" id="exploreBtn" class="btn btn-primary">
      <font-awesome-icon :icon="['fas', 'magnifying-glass']" />
      Explore
    </button>
  </nuxt-link>
</template>

<script>
export default {
  name: 'ExploreBtn',
};
</script>
