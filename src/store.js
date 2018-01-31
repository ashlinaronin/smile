import Vue from 'vue';
import Vuex from 'vuex';
import mutations from '@/library/dictionary/mutations';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    smilesDonated: 0,
    smileImageUrls: [],
  },
  actions: {

  },
  mutations: {
    [mutations.DONATE_SMILE](state, { smileImageUrl }) {
      state.smilesDonated += 1;
      state.smileImageUrls.push(smileImageUrl);
    },
    [mutations.RESET_DONATIONS](state) {
      state.smilesDonated = 0;
      state.smileImageUrls = [];
    },
  },
  getters: {

  },
});

export default store;
