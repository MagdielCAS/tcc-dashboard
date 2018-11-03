import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    page: '',
    temperature: 0
  },
  mutations: {
    updatePage(state, { name }) {
      state.page = name;
    },
    updateTemperature(state, { temperature }) {
      state.temperature = temperature;
    }
  },
  actions: {}
});
