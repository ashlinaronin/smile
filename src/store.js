import Vue from 'vue';
import Vuex from 'vuex';
import mutations from '@/library/dictionary/mutations';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    smilesDonated: 0,
  },
  actions: {

  },
  mutations: {
    [mutations.DONATE_SMILE](state) {
      state.smilesDonated += 1;
    },
  },
  getters: {

  },
});

export default store;
