// import { createStore } from 'vuex';
// import { reactive } from 'vue';

// export const store = createStore({
//   state() {
//     return {
//       exploreData: []
//     };
//   },
//   mutations: {
//     setExploreData(state, data) {
//         state.exploreData.push(data)
//       },
//       actions: {
//         updateExploreData({ commit }, data) {
//           commit('setExploreData', data);
//         },


//   },
// });

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
