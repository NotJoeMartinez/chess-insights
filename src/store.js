// src/store.js
import { createStore } from 'vuex';

export const store = createStore({
  state: {
    exploreData: [],
  },
  mutations: {
    setExploreData(state, data) {
      state.exploreData = data;
    },
  },
  actions: {
    updateExploreData({ commit }, data) {
      commit('setExploreData', data);
    },
  },
});

// export default store;
