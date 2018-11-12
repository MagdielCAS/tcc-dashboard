import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    page: undefined,
    temperature: undefined,
    sensor: undefined
  },
  mutations: {
    updatePage(state, { name }) {
      state.page = name;
    },
    updateTemperature(state, { temperature }) {
      state.temperature = temperature;
    },
    updateSensor(state, sensor) {
      state.sensor = sensor;
    }
  },
  actions: {}
});
