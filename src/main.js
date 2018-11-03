import 'vuetify/dist/vuetify.min.css';
import 'material-design-icons-iconfont/dist/material-design-icons.css';

import Vue from 'vue';
import Vuetify from 'vuetify';
import VueCookie from 'vue-cookie';
import VueResource from 'vue-resource';

import App from './App.vue';
import router from './router';
import store from './store';
import './registerServiceWorker';

Vue.use(Vuetify);
Vue.use(VueCookie);
Vue.use(VueResource);

Vue.http.options.root = process.env.VUE_APP_API_URL;

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
